import React from "react";
import { Movie } from "@/types";
import { Icon } from "@/components/icons/icon";

interface PlanTimelineRowProps {
    movie: Movie;
    index: number;
    onToggleWatched: (id: number) => void;
}

export function PlanTimelineRow({ movie, index, onToggleWatched }: PlanTimelineRowProps) {
    return (
        <div className={`timeline-row ${movie.watched ? "done" : ""}`}>
            <div className="timeline-marker">
                <span>{movie.watched ? <Icon name="check" size={15} /> : index + 1}</span>
            </div>

            <div className="timeline-movie">
                <div>
                    <span className="sequence-no">FILM {String(index + 1).padStart(2, "0")}</span>
                    <h3>{movie.title}</h3>
                    <p>
                        {movie.year} <i /> {movie.runtime} MIN
                    </p>
                </div>

                <button onClick={() => onToggleWatched(movie.id)}>
                    {movie.watched ? "WATCHED" : "MARK AS WATCHED"}
                    <span className={movie.watched ? "checked" : ""}>{movie.watched && <Icon name="check" size={13} />}</span>
                </button>
            </div>
        </div>
    );
}
