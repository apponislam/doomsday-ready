"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Movie } from "@/types";
import { useMovies } from "@/hooks/use-movies";
import { Icon } from "@/components/icons/icon";
import { PrimaryButton } from "@/components/ui/primary-button";
import { MovieSearch } from "@/components/movies/movie-search";
import { MovieRuntimeSummary } from "@/components/movies/movie-runtime-summary";
import { MovieRow } from "@/components/movies/movie-row";
import { MovieFormModal } from "@/components/movies/movie-form-modal";
import { MovieTableSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";

interface MoviesViewProps {
    movies?: Movie[];
    setMovies?: (movies: Movie[]) => void;
}

export function MoviesView({ movies: propsMovies, setMovies: propsSetMovies }: MoviesViewProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Read pagination & search state from URL query params
    const initialPage = parseInt(searchParams.get("page") || "1", 10);
    const initialLimit = parseInt(searchParams.get("limit") || "10", 10);
    const initialSearch = searchParams.get("search") || "";

    const [page, setPage] = useState(isNaN(initialPage) || initialPage < 1 ? 1 : initialPage);
    const [limit, setLimit] = useState(isNaN(initialLimit) || initialLimit < 1 ? 10 : initialLimit);
    const [search, setSearch] = useState(initialSearch);
    const [modal, setModal] = useState<"add" | number | null>(null);

    // Sync from URL if query parameters change
    useEffect(() => {
        const p = parseInt(searchParams.get("page") || "1", 10);
        const l = parseInt(searchParams.get("limit") || "10", 10);
        const s = searchParams.get("search") || "";

        if (!isNaN(p) && p !== page) setPage(p);
        if (!isNaN(l) && l !== limit) setLimit(l);
        if (s !== search) setSearch(s);
    }, [searchParams]);

    const {
        movies: apiMovies,
        stats,
        meta,
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
        toggleWatched: apiToggleWatched,
        saveMovie: apiSaveMovie,
    } = useMovies(
        propsMovies
            ? undefined
            : {
                  page,
                  limit,
                  searchTerm: search,
              }
    );

    const toggleWatched = apiToggleWatched;
    const saveMovie = apiSaveMovie;

    // Handle client props fallback if provided
    const displayedMovies = propsMovies
        ? propsMovies
              .filter((m) => m.title.toLowerCase().includes(search.toLowerCase()))
              .slice((page - 1) * limit, page * limit)
        : apiMovies;

    const totalItems = propsMovies
        ? propsMovies.filter((m) => m.title.toLowerCase().includes(search.toLowerCase())).length
        : meta?.total ?? apiMovies.length;

    const totalPages = propsMovies
        ? Math.max(1, Math.ceil(totalItems / limit))
        : meta?.totalPage ?? 1;

    const watchedCount = stats?.watchedCount ?? displayedMovies.filter((m) => m.watched).length;
    const totalRuntime = stats?.totalRuntimeMinutes ?? displayedMovies.reduce((sum, m) => sum + m.runtime, 0);

    const editing = typeof modal === "number" ? displayedMovies.find((m) => m.id === modal) : undefined;

    // Update URL query parameters
    const updateUrlParams = useCallback(
        (newPage: number, newLimit: number, newSearch: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (newPage > 1) params.set("page", String(newPage));
            else params.delete("page");

            if (newLimit !== 10) params.set("limit", String(newLimit));
            else params.delete("limit");

            if (newSearch) params.set("search", newSearch);
            else params.delete("search");

            const q = params.toString();
            router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
        },
        [searchParams, pathname, router]
    );

    const handleSearchChange = (newSearch: string) => {
        setSearch(newSearch);
        setPage(1);
        updateUrlParams(1, limit, newSearch);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        updateUrlParams(newPage, limit, search);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleToggleWatched = (id: number) => {
        if (propsSetMovies && propsMovies) {
            propsSetMovies(propsMovies.map((m) => (m.id === id ? { ...m, watched: !m.watched } : m)));
        } else {
            toggleWatched(id);
        }
    };

    const handleSaveMovie = (movieData: Omit<Movie, "watched">) => {
        if (propsSetMovies && propsMovies) {
            if (editing) {
                propsSetMovies(
                    propsMovies.map((m) =>
                        m.id === editing.id
                            ? {
                                  ...m,
                                  title: movieData.title,
                                  year: movieData.year,
                                  runtime: movieData.runtime,
                                  prerequisites: movieData.prerequisites,
                              }
                            : m
                    )
                );
            } else {
                const nextId = propsMovies.length ? Math.max(...propsMovies.map((m) => m.id)) + 1 : 1;
                propsSetMovies([
                    ...propsMovies,
                    {
                        id: nextId,
                        title: movieData.title,
                        year: movieData.year,
                        runtime: movieData.runtime,
                        prerequisites: movieData.prerequisites,
                        watched: false,
                    },
                ]);
            }
        } else {
            saveMovie(movieData);
        }
        setModal(null);
    };

    return (
        <>
            <div className="flex justify-between items-end max-md:items-center max-md:gap-3 mb-2">
                <div className="min-w-0">
                    <p className="text-brand-red text-[9px] font-bold tracking-[1.8px] mb-1 uppercase">
                        {isLoading
                            ? "SYNCING ARCHIVE..."
                            : `${watchedCount.toLocaleString()} OF ${(stats?.totalMovies ?? totalItems).toLocaleString()} WATCHED`}
                    </p>
                    <h2 className="font-condensed font-semibold text-[clamp(20px,3vw,38px)] leading-tight text-white tracking-[-0.4px]">
                        Your cinematic timeline
                    </h2>
                </div>
                <PrimaryButton className="shrink-0 max-md:h-9.5 max-md:min-h-9.5 max-md:px-3.5 max-md:text-[11px]" onClick={() => setModal("add")}>
                    <Icon name="plus" /> <span className="btn-text">ADD MOVIE</span>
                </PrimaryButton>
            </div>

            <div className="flex items-center justify-between my-7 mb-3.5 flex-wrap gap-3">
                <MovieSearch value={search} onChange={handleSearchChange} />
                <MovieRuntimeSummary totalMinutes={totalRuntime} />
            </div>

            {isLoading ? (
                <MovieTableSkeleton rows={limit} />
            ) : isError ? (
                <ErrorState title="Unable to Load MCU Movies" error={error} onRetry={refetch} />
            ) : displayedMovies.length === 0 ? (
                totalItems === 0 && !search ? (
                    <EmptyState
                        title="Archive is Currently Empty"
                        description="No films found in the database. Add your first film to start tracking your rewatch order."
                        actionLabel="ADD FIRST MOVIE"
                        onAction={() => setModal("add")}
                    />
                ) : (
                    <div className="p-12 text-center border border-[#25282c] bg-[#121417]/75 text-[#888]">
                        <p className="text-sm font-medium">No movies match &ldquo;{search}&rdquo;</p>
                        <button onClick={() => handleSearchChange("")} className="mt-3 text-brand-red text-xs underline cursor-pointer">
                            Clear search
                        </button>
                    </div>
                )
            ) : (
                <div className="border border-[#25282c] bg-[#121417]/75 max-md:border-0 max-md:bg-transparent">
                    <div className="grid items-center px-5 min-h-10.75 text-[#64686e] border-b border-[#292c30] text-[8px] tracking-[1.3px] font-semibold max-md:hidden grid-cols-[62px_minmax(240px,1.5fr)_100px_110px_minmax(180px,1fr)_72px] max-lg:grid-cols-[50px_minmax(210px,1.5fr)_80px_90px_1fr_68px]">
                        <span>STATUS</span>
                        <span>MOVIE</span>
                        <span>RELEASE</span>
                        <span>RUNTIME</span>
                        <span>PREREQUISITES</span>
                        <span className="text-right">ACTIONS</span>
                    </div>
                    {displayedMovies.map((movie, index) => (
                        <MovieRow
                            key={movie.id}
                            movie={movie}
                            index={(page - 1) * limit + index}
                            allMovies={displayedMovies}
                            onToggleWatched={handleToggleWatched}
                            onEdit={(id) => setModal(id)}
                        />
                    ))}

                    {/* Site HUD Pagination */}
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        pageSize={limit}
                        onPageChange={handlePageChange}
                        isLoading={isFetching}
                    />
                </div>
            )}

            {modal !== null && (
                <MovieFormModal
                    editingMovie={editing}
                    allMovies={displayedMovies}
                    onClose={() => setModal(null)}
                    onSave={handleSaveMovie}
                />
            )}
        </>
    );
}
