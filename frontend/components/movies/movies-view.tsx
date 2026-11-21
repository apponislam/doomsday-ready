"use client";

import React, { useState } from "react";
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

interface MoviesViewProps {
    movies?: Movie[];
    setMovies?: (movies: Movie[]) => void;
}

export function MoviesView({ movies: propsMovies, setMovies: propsSetMovies }: MoviesViewProps) {
    const {
        movies: apiMovies,
        isLoading,
        isError,
        error,
        refetch,
        toggleWatched: apiToggleWatched,
        saveMovie: apiSaveMovie,
    } = useMovies();

    const movies = propsMovies ?? apiMovies;
    const toggleWatched = apiToggleWatched;
    const saveMovie = apiSaveMovie;

    const [search, setSearch] = useState("");
    const [modal, setModal] = useState<"add" | number | null>(null);

    const filtered = movies.filter((movie) => movie.title.toLowerCase().includes(search.toLowerCase()));

    const editing = typeof modal === "number" ? movies.find((m) => m.id === modal) : undefined;
    const watchedCount = movies.filter((m) => m.watched).length;
    const totalRuntime = movies.reduce((sum, m) => sum + m.runtime, 0);

    const handleToggleWatched = (id: number) => {
        if (propsSetMovies) {
            propsSetMovies(movies.map((m) => (m.id === id ? { ...m, watched: !m.watched } : m)));
        } else {
            toggleWatched(id);
        }
    };

    const handleSaveMovie = (movieData: Omit<Movie, "watched">) => {
        if (propsSetMovies) {
            if (editing) {
                propsSetMovies(
                    movies.map((m) =>
                        m.id === editing.id
                            ? {
                                  ...m,
                                  title: movieData.title,
                                  year: movieData.year,
                                  runtime: movieData.runtime,
                                  prerequisites: movieData.prerequisites,
                              }
                            : m,
                    ),
                );
            } else {
                const nextId = movies.length ? Math.max(...movies.map((m) => m.id)) + 1 : 1;
                propsSetMovies([
                    ...movies,
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
                        {isLoading ? "SYNCING ARCHIVE..." : `${watchedCount} OF ${movies.length} WATCHED`}
                    </p>
                    <h2 className="font-condensed font-semibold text-[clamp(20px,3vw,38px)] leading-tight text-white tracking-[-0.4px]">Your cinematic timeline</h2>
                </div>
                <PrimaryButton className="shrink-0 max-md:h-9.5 max-md:min-h-9.5 max-md:px-3.5 max-md:text-[11px]" onClick={() => setModal("add")}>
                    <Icon name="plus" /> <span className="btn-text">ADD MOVIE</span>
                </PrimaryButton>
            </div>

            <div className="flex items-center justify-between my-7 mb-3.5">
                <MovieSearch value={search} onChange={setSearch} />
                <MovieRuntimeSummary totalMinutes={totalRuntime} />
            </div>

            {isLoading ? (
                <MovieTableSkeleton rows={8} />
            ) : isError ? (
                <ErrorState title="Unable to Load MCU Movies" error={error} onRetry={refetch} />
            ) : filtered.length === 0 ? (
                movies.length === 0 ? (
                    <EmptyState
                        title="Archive is Currently Empty"
                        description="No films found in the database. Initialize data or add your first film to start tracking your rewatch order."
                        actionLabel="ADD FIRST MOVIE"
                        onAction={() => setModal("add")}
                    />
                ) : (
                    <div className="p-12 text-center border border-[#25282c] bg-[#121417]/75 text-[#888]">
                        <p className="text-sm font-medium">No movies match &ldquo;{search}&rdquo;</p>
                        <button onClick={() => setSearch("")} className="mt-3 text-brand-red text-xs underline cursor-pointer">
                            Clear search
                        </button>
                    </div>
                )
            ) : (
                <div className="border border-[#25282c] bg-[#121417]/75 max-md:border-0 max-md:bg-transparent">
                    <div className="grid items-center px-5 min-h-10.75 text-[#64686e] border-b border-[#292c30] text-[8px] tracking-[1.3px] font-semibold max-md:hidden grid-cols-[62px_minmax(240px,1.5fr)_100px_110px_minmax(180px,1fr)_42px] max-lg:grid-cols-[50px_minmax(210px,1.5fr)_80px_90px_1fr_36px]">
                        <span>STATUS</span>
                        <span>MOVIE</span>
                        <span>RELEASE</span>
                        <span>RUNTIME</span>
                        <span>PREREQUISITES</span>
                        <span />
                    </div>
                    {filtered.map((movie, index) => (
                        <MovieRow key={movie.id} movie={movie} index={index} allMovies={movies} onToggleWatched={handleToggleWatched} onEdit={(id) => setModal(id)} />
                    ))}
                </div>
            )}

            {modal !== null && <MovieFormModal editingMovie={editing} allMovies={movies} onClose={() => setModal(null)} onSave={handleSaveMovie} />}
        </>
    );
}
