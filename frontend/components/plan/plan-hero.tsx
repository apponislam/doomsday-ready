import React from "react";
import { Movie } from "@/types";
import { Icon } from "@/components/icons/icon";
import { CompletionOrb } from "@/components/plan/completion-orb";

interface PlanHeroProps {
    targetId: number;
    onTargetChange: (id: number) => void;
    movies: Movie[];
    percent: number;
}

export function PlanHero({ targetId, onTargetChange, movies, percent }: PlanHeroProps) {
    return (
        <div className="plan-hero">
            <div className="hero-copy">
                <span className="eyebrow">
                    <Icon name="spark" size={15} /> TARGET MOVIE
                </span>
                <label>
                    <select value={targetId} onChange={(e) => onTargetChange(Number(e.target.value))}>
                        {movies.map((m) => (
                            <option key={m.id} value={m.id}>
                                {m.title}
                            </option>
                        ))}
                    </select>
                    <Icon name="chevron" />
                </label>
                <p>Your optimized watch order is ready. Every story, in the right sequence.</p>
            </div>

            <CompletionOrb percentage={percent} />
        </div>
    );
}
