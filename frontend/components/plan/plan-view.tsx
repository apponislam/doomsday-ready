'use client';

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Movie } from '@/types';
import { useMovies } from '@/hooks/use-movies';
import { getRewatchOrder } from '@/utils/rewatch-order';
import { PlanHero } from '@/components/plan/plan-hero';
import { PlanStatsGrid } from '@/components/plan/plan-stats-grid';
import { PlanTimeline } from '@/components/plan/plan-timeline';
import { PlanSkeleton } from '@/components/ui/loading-skeleton';
import { ErrorState } from '@/components/ui/error-state';
import { EmptyState } from '@/components/ui/empty-state';

interface PlanViewProps {
  movies?: Movie[];
  setMovies?: (movies: Movie[]) => void;
}

export function PlanView({ movies: propsMovies, setMovies: propsSetMovies }: PlanViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    movies: apiMovies,
    isLoading,
    isError,
    error,
    refetch,
    toggleWatched: apiToggleWatched,
  } = useMovies({ all: true });

  const movies = propsMovies ?? apiMovies;
  const toggleWatched = apiToggleWatched;

  const targetQuery = searchParams.get('target') || searchParams.get('movie');

  // Initialize target: check query param first, default to 8
  const [target, setTarget] = useState<number>(() => {
    if (targetQuery) {
      const parsed = parseInt(targetQuery, 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return 8;
  });

  // Sync state from URL query parameter if URL changes
  useEffect(() => {
    if (!targetQuery || movies.length === 0) return;

    // 1. Try numeric ID
    const numericId = parseInt(targetQuery, 10);
    if (!isNaN(numericId)) {
      const exists = movies.some((m) => m.id === numericId);
      if (exists && numericId !== target) {
        setTarget(numericId);
      }
      return;
    }

    // 2. Try normalized title/slug match
    const normalizedQuery = targetQuery.toLowerCase().replace(/[^a-z0-9]/g, '');
    const matched = movies.find(
      (m) => m.title.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedQuery
    );
    if (matched && matched.id !== target) {
      setTarget(matched.id);
    }
  }, [targetQuery, movies, target]);

  // Ensure target is valid once movies load
  useEffect(() => {
    if (movies.length > 0) {
      const targetValid = movies.some((m) => m.id === target);
      if (!targetValid) {
        const doomsday = movies.find((m) => m.id === 8);
        const fallbackId = doomsday ? doomsday.id : movies[movies.length - 1].id;
        setTarget(fallbackId);
      }
    }
  }, [movies, target]);

  // Handle user changing target: update local state AND query param in URL
  const handleTargetChange = useCallback(
    (newTargetId: number) => {
      setTarget(newTargetId);
      const params = new URLSearchParams(searchParams.toString());
      params.set('target', String(newTargetId));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  const targetMovie = useMemo(
    () => movies.find((m) => m.id === target),
    [movies, target]
  );

  const order = useMemo(() => getRewatchOrder(target, movies), [target, movies]);
  const watched = order.filter((m) => m.watched).length;
  const remaining = order.filter((m) => !m.watched).reduce((sum, m) => sum + m.runtime, 0);
  const percent = order.length ? Math.round((watched / order.length) * 100) : 100;

  const handleToggleWatched = (id: number) => {
    if (propsSetMovies) {
      propsSetMovies(
        movies.map((m) => (m.id === id ? { ...m, watched: !m.watched } : m))
      );
    } else {
      toggleWatched(id);
    }
  };

  if (isLoading) {
    return <PlanSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Unable to Calculate Rewatch Order"
        error={error}
        onRetry={refetch}
      />
    );
  }

  if (movies.length === 0) {
    return (
      <EmptyState
        title="No Movies in Archive"
        description="Add MCU films to your database to calculate and track your prerequisite rewatch sequence."
      />
    );
  }

  return (
    <>
      <PlanHero
        targetId={target}
        onTargetChange={handleTargetChange}
        movies={movies}
        percent={percent}
      />
      <PlanStatsGrid
        order={order}
        watchedCount={watched}
        remainingMinutes={remaining}
        percent={percent}
      />
      <PlanTimeline
        order={order}
        targetMovie={targetMovie}
        onToggleWatched={handleToggleWatched}
      />
    </>
  );
}
