"use client";

import React, { useState } from "react";
import { Movie } from "@/types";
import { useMovies } from "@/context/movie-context";
import { Icon } from "@/components/icons/icon";
import { PrimaryButton } from "@/components/ui/primary-button";
import { MovieSearch } from "@/components/movies/movie-search";
import { MovieRuntimeSummary } from "@/components/movies/movie-runtime-summary";
import { MovieRow } from "@/components/movies/movie-row";
import { MovieFormModal } from "@/components/movies/movie-form-modal";

interface MoviesViewProps {
    movies?: Movie[];
    setMovies?: (movies: Movie[]) => void;
}

export function MoviesView({ movies: propsMovies, setMovies: propsSetMovies }: MoviesViewProps) {
    const context = useMovies();
    const movies = propsMovies ?? context.movies;
    const toggleWatched = context.toggleWatched;
    const saveMovie = context.saveMovie;

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
            <div className="section-lead">
                <div>
                    <p>
                        {watchedCount} OF {movies.length} WATCHED
                    </p>
                    <h2>Your cinematic timeline</h2>
                </div>
                <PrimaryButton onClick={() => setModal("add")}>
                    <Icon name="plus" /> <span className="btn-text">ADD MOVIE</span>
                </PrimaryButton>
            </div>

            <div className="toolbar">
                <MovieSearch value={search} onChange={setSearch} />
                <MovieRuntimeSummary totalMinutes={totalRuntime} />
            </div>

            <div className="movie-list">
                <div className="table-head">
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

            {modal !== null && <MovieFormModal editingMovie={editing} allMovies={movies} onClose={() => setModal(null)} onSave={handleSaveMovie} />}
        </>
    );
}
