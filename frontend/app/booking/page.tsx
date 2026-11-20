import type { Metadata } from 'next';
import { BookingView } from '@/components/booking/booking-view';

export const metadata: Metadata = {
  title: 'Opening Night Booking — Reserve the Squad',
  description:
    'Reserve the squad for Avengers: Doomsday opening night. Calculate the fewest exact cinema seat bundles for your group with zero empty seats.',
  openGraph: {
    title: 'Opening Night Booking — Reserve the Squad | DOOMSDAY READY',
    description:
      'Calculate the fewest exact cinema seat bundles for your group with zero empty seats for Avengers: Doomsday.',
  },
};

export default function BookingPage() {
  return <BookingView />;
}
