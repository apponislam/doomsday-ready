'use client';

import React, { useMemo, useState } from 'react';
import { Movie } from '@/types';
import { useMovies } from '@/context/movie-context';
import { getRewatchOrder } from '@/utils/rewatch-order';
import { PlanHero } from '@/components/plan/plan-hero';
import { PlanStatsGrid } from '@/components/plan/plan-stats-grid';
import { PlanTimeline } from '@/components/plan/plan-timeline';

interface PlanViewProps {
  movies?: Movie[];
  setMovies?: (movies: Movie[]) => void;
}

export function PlanView({ movies: propsMovies, setMovies: propsSetMovies }: PlanViewProps) {
  const context = useMovies();
  const movies = propsMovies ?? context.movies;
  const toggleWatched = context.toggleWatched;

  const [target, setTarget] = useState(8);

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
