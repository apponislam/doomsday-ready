import React, { CSSProperties } from "react";
import { Movie } from "@/types";

interface PlanStatsGridProps {
    order: Movie[];
    watchedCount: number;
    remainingMinutes: number;
    percent: number;
}

export function PlanStatsGrid({ order, watchedCount, remainingMinutes, percent }: PlanStatsGridProps) {
    const nextMovie = order.find((m) => !m.watched);
    const hours = Math.floor(remainingMinutes / 60);
    const minutes = remainingMinutes % 60;
    const movieNights = Math.ceil(remainingMinutes / 120);

    return (
        <div className="stats-grid">
            <div>
                <span>PROGRESS</span>
                <strong>
                    {watchedCount}
                    <small> / {order.length} watched</small>
                </strong>
                <div className="progress">
                    <i style={{ width: `${percent}%` } as CSSProperties} />
                </div>
            </div>

            <div>
                <span>TIME REMAINING</span>
                <strong>
                    {hours}h <small>{minutes}m</small>
                </strong>
                <p>Approximately {movieNights} movie nights</p>
            </div>

            <div>
                <span>NEXT UP</span>
                <strong className="next-title">{nextMovie ? nextMovie.title : "All caught up"}</strong>
                <p>{nextMovie ? nextMovie.runtime : 0} minutes</p>
            </div>
        </div>
    );
}
