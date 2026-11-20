import type { Metadata } from 'next';
import { MoviesView } from '@/components/movies/movies-view';

export const metadata: Metadata = {
  title: 'Movie Archive — Build Your Path to Doomsday',
  description:
    'Explore the complete Marvel Cinematic Universe timeline leading up to Avengers: Doomsday. Track watched movies, total runtime, and storyline prerequisites.',
  openGraph: {
    title: 'Movie Archive — Build Your Path to Doomsday | DOOMSDAY READY',
    description:
      'Explore the complete Marvel Cinematic Universe timeline leading up to Avengers: Doomsday. Track watched movies, total runtime, and storyline prerequisites.',
  },
};

export default function HomePage() {
  return <MoviesView />;
}
