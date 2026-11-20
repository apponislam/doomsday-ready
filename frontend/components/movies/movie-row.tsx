import React, { CSSProperties } from "react";
import { Movie } from "@/types";
import { Icon } from "@/components/icons/icon";

interface MovieRowProps {
    movie: Movie;
    index: number;
    allMovies: Movie[];
    onToggleWatched: (id: number) => void;
    onEdit: (id: number) => void;
}

export function MovieRow({ movie, index, allMovies, onToggleWatched, onEdit }: MovieRowProps) {
    const hours = Math.floor(movie.runtime / 60);
    const minutes = movie.runtime % 60;

    return (
        <div className="movie-row" style={{ "--delay": `${index * 35}ms` } as CSSProperties}>
            <button className={`watch-check ${movie.watched ? "checked" : ""}`} aria-label={`Mark ${movie.title} ${movie.watched ? "unwatched" : "watched"}`} onClick={() => onToggleWatched(movie.id)}>
                {movie.watched && <Icon name="check" size={14} />}
            </button>

            <div className="movie-title">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                    <strong>{movie.title}</strong>
                    <small>{movie.watched ? "MISSION COMPLETE" : "AWAITING WATCH"}</small>
                </div>
            </div>

            <span className="mono">{movie.year}</span>
            <span className="mono">
                {hours}H {minutes}M
            </span>

            <div className="prereq-cell">{movie.prerequisites.length ? movie.prerequisites.map((id) => <span key={id}>{allMovies.find((m) => m.id === id)?.title.replace("Captain America: ", "") ?? `ID ${id}`}</span>) : <em>None</em>}</div>

            <button className="icon-button" onClick={() => onEdit(movie.id)} aria-label={`Edit ${movie.title}`}>
                <Icon name="edit" size={16} />
            </button>
        </div>
    );
}
