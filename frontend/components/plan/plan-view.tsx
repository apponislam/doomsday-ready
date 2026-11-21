'use client';

import React, { useMemo, useState, useEffect } from 'react';
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
  const {
    movies: apiMovies,
    isLoading,
    isError,
    error,
    refetch,
    toggleWatched: apiToggleWatched,
  } = useMovies();

  const movies = propsMovies ?? apiMovies;
  const toggleWatched = apiToggleWatched;

  const [target, setTarget] = useState<number>(8);

  // Auto-select valid target when movies load
  useEffect(() => {
    if (movies.length > 0) {
      const hasDefaultTarget = movies.some((m) => m.id === 8);
      if (!hasDefaultTarget) {
        setTarget(movies[movies.length - 1].id);
      }
    }
  }, [movies]);

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
        onTargetChange={setTarget}
        movies={movies}
        percent={percent}
      />
      <PlanStatsGrid
        order={order}
        watchedCount={watched}
        remainingMinutes={remaining}
        percent={percent}
      />
      <PlanTimeline order={order} onToggleWatched={handleToggleWatched} />
    </>
  );
}
