'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Movie } from '@/types';
import { initialMovies } from '@/data/initial-data';

interface MovieContextType {
  movies: Movie[];
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
  toggleWatched: (id: number) => void;
  saveMovie: (movieData: Omit<Movie, 'watched'>) => void;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export function MovieProvider({ children }: { children: React.ReactNode }) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);

  const toggleWatched = (id: number) => {
    setMovies((prev) =>
      prev.map((m) => (m.id === id ? { ...m, watched: !m.watched } : m))
    );
  };

  const saveMovie = (movieData: Omit<Movie, 'watched'>) => {
    setMovies((prev) => {
      const exists = prev.some((m) => m.id === movieData.id);
      if (exists) {
        return prev.map((m) =>
          m.id === movieData.id
            ? {
                ...m,
                title: movieData.title,
                year: movieData.year,
                runtime: movieData.runtime,
                prerequisites: movieData.prerequisites,
              }
            : m
        );
      } else {
        const nextId = prev.length ? Math.max(...prev.map((m) => m.id)) + 1 : 1;
        return [
          ...prev,
          {
            id: nextId,
            title: movieData.title,
            year: movieData.year,
            runtime: movieData.runtime,
            prerequisites: movieData.prerequisites,
            watched: false,
          },
        ];
      }
    });
  };

  return (
    <MovieContext.Provider
      value={{
        movies,
        setMovies,
        toggleWatched,
        saveMovie,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}

export function useMovies() {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovies must be used within a MovieProvider');
  }
  return context;
}
