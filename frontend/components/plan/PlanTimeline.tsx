import React from 'react';
import { Movie } from '@/types';
import { PlanTimelineRow } from '@/components/plan/plan-timeline-row';

interface PlanTimelineProps {
  order: Movie[];
  onToggleWatched: (id: number) => void;
}

export function PlanTimeline({ order, onToggleWatched }: PlanTimelineProps) {
  return (
    <section className="timeline">
      <div className="timeline-heading">
        <div>
          <p>THE SEQUENCE</p>
          <h2>
            {order.length
              ? `${order.length} films stand between you and Doomsday`
              : 'No prerequisites required'}
          </h2>
        </div>
        <span>ORDERED BY STORY DEPENDENCY</span>
      </div>

      {order.map((movie, index) => (
        <PlanTimelineRow
          key={movie.id}
          movie={movie}
          index={index}
          onToggleWatched={onToggleWatched}
        />
      ))}
    </section>
  );
}

export default PlanTimeline;
