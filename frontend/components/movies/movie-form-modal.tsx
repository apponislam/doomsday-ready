import React, { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Movie } from "@/types";
import { Icon } from "@/components/icons/icon";
import { PrimaryButton } from "@/components/ui/primary-button";
import { useGetMoviesQuery } from "@/redux/features/movies/movieApi";

const currentYear = new Date().getFullYear();

const movieFormSchema = z.object({
    title: z
        .string({ error: "Movie title is required" })
        .trim()
        .min(1, "Movie title is required")
        .max(120, "Title cannot exceed 120 characters"),
    year: z
        .number({ error: "Please enter a release year (e.g. 2026)" })
        .int("Release year must be a whole year")
        .min(1900, "Release year must be 1900 or later")
        .max(2100, "Release year cannot exceed 2100"),
    runtime: z
        .number({ error: "Please enter runtime in minutes (e.g. 135)" })
        .int("Runtime must be a whole number of minutes")
        .min(1, "Runtime must be at least 1 minute")
        .max(600, "Runtime cannot exceed 600 minutes"),
    prerequisites: z.array(z.number()),
});

type MovieFormValues = z.infer<typeof movieFormSchema>;

interface MovieFormModalProps {
    editingMovie?: Movie;
    allMovies: Movie[];
    onClose: () => void;
    onSave: (movieData: Omit<Movie, "watched">) => void;
}

/**
 * Checks if candidateId reaches targetId through its prerequisite chain.
 */
function hasDependencyPath(fromMovieId: number, toMovieId: number, movieList: Movie[]): boolean {
    if (fromMovieId === toMovieId) return true;
    const movie = movieList.find((m) => m.id === fromMovieId || String(m.id) === String(fromMovieId) || String((m as any)._id) === String(fromMovieId));
    if (!movie) return false;
    return movie.prerequisites.some((id) => {
        const numId = typeof id === "number" ? id : movieList.find((m) => String((m as any)._id) === String(id))?.id;
        return numId ? hasDependencyPath(numId, toMovieId, movieList) : false;
    });
}

export function MovieFormModal({ editingMovie, allMovies, onClose, onSave }: MovieFormModalProps) {
    const isEditing = Boolean(editingMovie);
    const [error, setError] = useState<string | null>(null);
    const [prereqSearch, setPrereqSearch] = useState("");
    const [visibleLimit, setVisibleLimit] = useState(20);

    // Fetch candidate movies if user searches or to supplement current page
    const { data: remoteData } = useGetMoviesQuery(
        prereqSearch ? { searchTerm: prereqSearch, limit: 100 } : { limit: 100, all: true }
    );

    // Combine movies from props and remote query without duplicates
    const candidatePool = useMemo(() => {
        const map = new Map<number, Movie>();
        for (const m of allMovies) {
            if (m.id !== editingMovie?.id) map.set(m.id, m);
        }
        if (remoteData?.data) {
            for (const m of remoteData.data) {
                if (m.id !== editingMovie?.id) map.set(m.id, m);
            }
        }
        return Array.from(map.values());
    }, [allMovies, remoteData, editingMovie]);

    // Filter candidate list based on search
    const filteredCandidates = useMemo(() => {
        const q = prereqSearch.trim().toLowerCase();
        let list = candidatePool;
        if (q) {
            list = list.filter((m) => m.title.toLowerCase().includes(q) || String(m.year).includes(q));
        }
        return list;
    }, [candidatePool, prereqSearch]);

    // Lazy visible slice
    const visibleCandidates = useMemo(
        () => filteredCandidates.slice(0, visibleLimit),
        [filteredCandidates, visibleLimit]
    );

    const handlePrereqScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - scrollTop - clientHeight < 40) {
            if (visibleLimit < filteredCandidates.length) {
                setVisibleLimit((prev) => Math.min(prev + 20, filteredCandidates.length));
            }
        }
    };

    const initialPrereqs = (editingMovie?.prerequisites || [])
        .map((p) => {
            if (typeof p === "number") return p;
            const found = candidatePool.find((m) => String((m as any)._id) === String(p));
            return found ? found.id : Number(p);
        })
        .filter((n) => !isNaN(n));

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<MovieFormValues>({
        resolver: zodResolver(movieFormSchema),
        defaultValues: {
            title: editingMovie?.title ?? "",
            year: editingMovie?.year ?? currentYear,
            runtime: editingMovie?.runtime ?? ("" as any),
            prerequisites: initialPrereqs,
        },
    });

    const onSubmit = (values: MovieFormValues) => {
        setError(null);

        // 1. Title uniqueness check
        const isDuplicateTitle = candidatePool.some(
            (m) => m.id !== editingMovie?.id && m.title.trim().toLowerCase() === values.title.toLowerCase()
        );

        if (isDuplicateTitle) {
            setError(`A movie titled "${values.title}" already exists. Title must be unique.`);
            return;
        }

        // 2. Circular dependency check
        if (editingMovie) {
            for (const prereqId of values.prerequisites) {
                if (hasDependencyPath(prereqId, editingMovie.id, candidatePool)) {
                    const offending = candidatePool.find((m) => m.id === prereqId)?.title ?? "selected movie";
                    setError(`409 CIRCULAR_DEPENDENCY: "${offending}" already depends on "${editingMovie.title}". A movie cannot depend on itself.`);
                    return;
                }
            }
        }

        onSave({
            id: editingMovie ? editingMovie.id : 0,
            title: values.title,
            year: values.year,
            runtime: values.runtime,
            prerequisites: values.prerequisites,
        });
    };

    return (
        <div className="fixed inset-0 z-50 grid place-items-center p-5 bg-[#030405]/80 backdrop-blur-md" onMouseDown={onClose}>
            <form className="w-full max-w-140 max-h-[90vh] overflow-y-auto p-7 bg-[#15171a] border border-[#34373c] shadow-2xl" onSubmit={handleSubmit(onSubmit)} onMouseDown={(e) => e.stopPropagation()}>
                <div className="flex gap-3.5 items-center mb-6">
                    <span className="w-9.5 h-9.5 grid place-items-center bg-brand-deep text-brand-red">
                        <Icon name={isEditing ? "edit" : "plus"} />
                    </span>
                    <div>
                        <p className="text-brand-red text-[8px] tracking-[1.5px] font-semibold m-0 mb-1">MOVIE ARCHIVE</p>
                        <h3 className="font-condensed font-semibold text-[25px] text-white m-0">{isEditing ? "Edit movie" : "Add a new movie"}</h3>
                    </div>
                </div>

                {error && <div className="p-2.5 px-3.5 mb-4 bg-brand-red/15 border border-brand-red rounded text-[#ff8a84] text-[11px] leading-relaxed">{error}</div>}

                <label className="grid gap-2 text-[#8a8e94] text-[9px] tracking-[1px] font-semibold">
                    Movie title
                    <input {...register("title")} placeholder="e.g. Thunderbolts*" className="h-10.5 px-3 border border-[#34373c] bg-[#0f1113] text-white outline-none focus:border-brand-red text-[12px]" />
                    {errors.title && <span className="text-brand-red text-[10px] tracking-normal font-normal">{errors.title.message}</span>}
                </label>

                <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-3.5 my-4">
                    <label className="grid gap-2 text-[#8a8e94] text-[9px] tracking-[1px] font-semibold">
                        Release year
                        <input type="number" min="1900" max="2100" placeholder={String(currentYear)} {...register("year", { valueAsNumber: true })} className="h-10.5 px-3 border border-[#34373c] bg-[#0f1113] text-white outline-none focus:border-brand-red text-[12px]" />
                        {errors.year && <span className="text-brand-red text-[10px] tracking-normal font-normal">{errors.year.message}</span>}
                    </label>
                    <label className="grid gap-2 text-[#8a8e94] text-[9px] tracking-[1px] font-semibold">
                        Runtime (minutes)
                        <input type="number" min="1" max="300" placeholder="e.g. 135" {...register("runtime", { valueAsNumber: true })} className="h-10.5 px-3 border border-[#34373c] bg-[#0f1113] text-white outline-none focus:border-brand-red text-[12px]" />
                        {errors.runtime && <span className="text-brand-red text-[10px] tracking-normal font-normal">{errors.runtime.message}</span>}
                    </label>
                </div>

                <fieldset className="p-0 border-0">
                    <legend className="text-[#8a8e94] text-[9px] tracking-[1px] font-semibold mb-2 flex items-center justify-between w-full">
                        <span>WATCH THESE FIRST</span>
                        <span className="text-[8px] text-[#63676e] font-normal uppercase tracking-wider">
                            PREREQUISITE DEPENDENCY
                        </span>
                    </legend>

                    <Controller
                        name="prerequisites"
                        control={control}
                        render={({ field }) => (
                            <div>
                                {/* Selected Prerequisite Badges Tray */}
                                {field.value.length > 0 && (
                                    <div className="flex items-center gap-1.5 flex-wrap mb-2.5 p-2 bg-[#0e1012] border border-[#26282e] rounded">
                                        <span className="text-[9px] uppercase tracking-wider text-brand-red font-bold px-1 shrink-0">
                                            SELECTED ({field.value.length}):
                                        </span>
                                        {field.value.map((prereqId) => {
                                            const matched = candidatePool.find((m) => m.id === prereqId);
                                            return (
                                                <span
                                                    key={prereqId}
                                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-brand-red/15 text-white border border-brand-red/40 text-[9px] font-medium"
                                                >
                                                    <span>{matched ? matched.title : `ID ${prereqId}`}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => field.onChange(field.value.filter((id) => id !== prereqId))}
                                                        className="text-[#999] hover:text-white cursor-pointer ml-0.5 text-xs font-bold leading-none"
                                                        title="Remove prerequisite"
                                                    >
                                                        ✕
                                                    </button>
                                                </span>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Inline filter input for prerequisites */}
                                <div className="relative mb-2">
                                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#5d6168]">
                                        <Icon name="search" size={13} />
                                    </span>
                                    <input
                                        type="text"
                                        value={prereqSearch}
                                        onChange={(e) => {
                                            setPrereqSearch(e.target.value);
                                            setVisibleLimit(20);
                                        }}
                                        placeholder="Filter prerequisite films..."
                                        className="w-full pl-8 pr-3 py-1.5 text-[11px] bg-[#0d0f11] border border-[#2b2e33] rounded text-white placeholder-[#53575d] focus:border-brand-red outline-none transition-colors"
                                    />
                                    {prereqSearch && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPrereqSearch("");
                                                setVisibleLimit(20);
                                            }}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#686c75] hover:text-white text-xs px-1 cursor-pointer"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>

                                {/* Lazy-loaded scroll container */}
                                <div
                                    onScroll={handlePrereqScroll}
                                    className="max-h-42 overflow-y-auto grid grid-cols-2 max-sm:grid-cols-1 gap-1.5 p-1 bg-[#0b0d0e] border border-[#26282d] rounded"
                                >
                                    {visibleCandidates.length === 0 ? (
                                        <div className="col-span-2 p-4 text-center text-[10px] text-[#6d7178]">
                                            {prereqSearch ? `No films match "${prereqSearch}"` : "No other movies available in archive"}
                                        </div>
                                    ) : (
                                        visibleCandidates.map((m) => {
                                            const createsCycle = editingMovie && hasDependencyPath(m.id, editingMovie.id, candidatePool);
                                            const isChecked = field.value.includes(m.id);

                                            return (
                                                <label
                                                    key={m.id}
                                                    className={`flex items-center gap-2 text-[#a9acb0] text-[10px] p-2 bg-[#121417] border border-[#202227] rounded cursor-pointer transition-colors ${
                                                        createsCycle
                                                            ? "opacity-45 cursor-not-allowed border-[#3d2325]"
                                                            : isChecked
                                                            ? "border-brand-red/60 bg-[#1e1517] text-white"
                                                            : "hover:bg-[#181a1e] hover:border-[#32363e]"
                                                    }`}
                                                    title={
                                                        createsCycle
                                                            ? `Cannot select: circular dependency (this film depends on ${editingMovie.title})`
                                                            : undefined
                                                    }
                                                >
                                                    <input
                                                        type="checkbox"
                                                        disabled={Boolean(createsCycle)}
                                                        checked={isChecked}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                field.onChange([...field.value, m.id]);
                                                            } else {
                                                                field.onChange(field.value.filter((id) => id !== m.id));
                                                            }
                                                        }}
                                                        className="peer hidden"
                                                    />
                                                    <span
                                                        className={`w-4 h-4 grid place-items-center border text-transparent rounded shrink-0 transition-colors ${
                                                            isChecked
                                                                ? "bg-brand-red border-brand-red text-white"
                                                                : "border-[#3e4247] bg-[#16181c]"
                                                        }`}
                                                    >
                                                        {isChecked && <Icon name="check" size={11} />}
                                                    </span>
                                                    <span className="truncate">{m.title}</span>
                                                    <span className="text-[9px] text-[#5b5f66] ml-auto shrink-0">{m.year}</span>
                                                    {createsCycle && <em className="text-[8px] text-brand-red ml-1 not-italic font-semibold uppercase">cycle</em>}
                                                </label>
                                            );
                                        })
                                    )}
                                </div>

                                {/* Lazy load status */}
                                <div className="flex items-center justify-between mt-1.5 px-1 text-[9px] text-[#6d7178] uppercase tracking-wider font-semibold">
                                    <span>
                                        Showing {Math.min(visibleLimit, filteredCandidates.length)} of {filteredCandidates.length} films
                                    </span>
                                    {visibleLimit < filteredCandidates.length && (
                                        <span className="text-brand-red">Scroll down to load more</span>
                                    )}
                                </div>
                            </div>
                        )}
                    />
                </fieldset>

                <div className="flex justify-end gap-2.5 mt-6">
                    <button type="button" className="px-4 min-h-10.5 border border-[#35383d] bg-transparent text-[9px] tracking-[1px] font-semibold cursor-pointer text-white hover:border-[#666] transition-colors" onClick={onClose}>
                        CANCEL
                    </button>
                    <PrimaryButton type="submit">{isEditing ? "SAVE CHANGES" : "ADD TO ARCHIVE"}</PrimaryButton>
                </div>
            </form>
        </div>
    );
}
