import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import { MoviesView } from '@/components/movies/movies-view';
import { MovieTableSkeleton } from '@/components/ui/loading-skeleton';

export const metadata: Metadata = {
  title: 'Movie Archive — Build Your Path to Doomsday',
  description:
    'Explore the complete Marvel Cinematic Universe timeline leading up to Avengers: Doomsday. Track watched movies, total runtime, and storyline prerequisites.',
  openGraph: {
    title: 'Movie Archive — Build Your Path to Doomsday | DOOMSDAY READY',
    description:
      'Explore the complete Marvel Cinematic Universe timeline leading up to Avengers: Doomsday.',
  },
};

export default function MoviesPage() {
  return (
    <Suspense fallback={<MovieTableSkeleton rows={8} />}>
      <MoviesView />
    </Suspense>
  );
}
