import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import { PlanView } from '@/components/plan/plan-view';
import { PlanSkeleton } from '@/components/ui/loading-skeleton';

export const metadata: Metadata = {
  title: 'Rewatch Plan — Mission Briefing',
  description:
    'Calculate your optimized MCU story sequence for Avengers: Doomsday based on topological prerequisite dependencies, remaining runtime, and movie nights.',
  openGraph: {
    title: 'Rewatch Plan — Mission Briefing | DOOMSDAY READY',
    description:
      'Calculate your optimized MCU story sequence for Avengers: Doomsday based on topological prerequisite dependencies.',
  },
};

export default function PlanPage() {
  return (
    <Suspense fallback={<PlanSkeleton />}>
      <PlanView />
    </Suspense>
  );
}
