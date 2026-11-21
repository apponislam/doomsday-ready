"use client";

import React, { useState, useEffect, useRef } from "react";
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
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const selectedMovie = movies.find((m) => m.id === targetId) ?? movies[0];

    const filteredMovies = movies.filter(
        (m) =>
            m.title.toLowerCase().includes(search.toLowerCase()) ||
            String(m.year).includes(search) ||
            String(m.id) === search.trim()
    );

    // Auto-focus search input when dropdown opens
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                inputRef.current?.focus();
            }, 50);
            return () => clearTimeout(timer);
        } else {
            setSearch("");
        }
    }, [isOpen]);

    // Close on click outside and escape key
    useEffect(() => {
        if (!isOpen) return;

        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }

        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    return (
        <div className="relative z-10 min-h-57.5 max-md:min-h-65 flex max-sm:block items-center justify-between border border-[#342526] p-[30px_clamp(25px,5vw,60px)] max-md:p-6 bg-[radial-gradient(circle_at_82%_50%,rgba(222,51,45,0.2),transparent_22%),linear-gradient(110deg,#181316,#111316_70%)]">
            {/* Background pattern layer */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-15 bg-[repeating-linear-gradient(115deg,transparent_0_34px,#912723_35px,transparent_36px)] [mask-image:linear-gradient(90deg,transparent,black)]" />

            <div className="relative z-2 max-w-full">
                <span className="flex items-center gap-1.5 text-brand-red font-semibold text-[10px] tracking-[2px] uppercase">
                    <Icon name="spark" size={15} /> TARGET MOVIE
                </span>

                {/* Custom HUD Dropdown */}
                <div className="relative my-3 mb-2.5" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setIsOpen((prev) => !prev)}
                        aria-haspopup="listbox"
                        aria-expanded={isOpen}
                        className="group flex items-center justify-between gap-4 text-left border border-[#3e2c2f] hover:border-brand-red/80 bg-[#161315]/90 hover:bg-[#1e191c] px-4 py-3 rounded-lg transition-all duration-150 cursor-pointer shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-red/50 max-w-full"
                    >
                        <div className="min-w-0 pr-2">
                            <span className="block font-condensed font-bold text-2xl sm:text-3xl md:text-4xl text-white tracking-wide truncate group-hover:text-red-400 transition-colors">
                                {selectedMovie ? selectedMovie.title : "Select Target Movie"}
                            </span>
                            {selectedMovie && (
                                <span className="flex items-center gap-2 mt-1.5 text-[10px] text-[#9a9da3] font-medium tracking-wider flex-wrap">
                                    <span className="px-1.5 py-0.5 rounded bg-brand-red/20 text-brand-red border border-brand-red/40 uppercase text-[9px] font-bold">
                                        TARGET #{String(selectedMovie.id).padStart(2, "0")}
                                    </span>
                                    <span>{selectedMovie.year}</span>
                                    <span>•</span>
                                    <span>
                                        {Math.floor(selectedMovie.runtime / 60)}H {selectedMovie.runtime % 60}M
                                    </span>
                                    <span>•</span>
                                    <span>
                                        {selectedMovie.prerequisites.length === 0
                                            ? "0 Prerequisites (Origin)"
                                            : `${selectedMovie.prerequisites.length} Prerequisite${
                                                  selectedMovie.prerequisites.length > 1 ? "s" : ""
                                              }`}
                                    </span>
                                </span>
                            )}
                        </div>

                        <span
                            className={`shrink-0 w-8 h-8 rounded-md bg-[#2a1d20] group-hover:bg-brand-red/20 text-brand-red grid place-items-center transition-all duration-200 ${
                                isOpen
                                    ? "rotate-180 bg-brand-red text-white shadow-[0_0_12px_rgba(239,62,54,0.6)]"
                                    : "group-hover:text-white"
                            }`}
                        >
                            <Icon name="chevron" size={16} />
                        </span>
                    </button>

                    {/* Popover Dropdown Menu */}
                    {isOpen && (
                        <div
                            role="listbox"
                            aria-label="Target movie options"
                            className="absolute left-0 top-[calc(100%+8px)] z-50 w-full min-w-[320px] max-w-[480px] max-md:max-w-[calc(100vw-48px)] bg-[#121316] border border-[#443033] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_30px_rgba(222,51,45,0.2)] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150"
                        >
                            {/* Search bar inside dropdown */}
                            <div className="p-3 border-b border-[#292225] bg-[#181518]">
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#73777f]">
                                        <Icon name="search" size={14} />
                                    </span>
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search MCU movie or year..."
                                        className="w-full pl-9 pr-8 py-2 text-xs bg-[#0f1013] border border-[#34282c] rounded-md text-white placeholder-[#686c75] focus:outline-none focus:border-brand-red transition-colors"
                                    />
                                    {search && (
                                        <button
                                            type="button"
                                            onClick={() => setSearch("")}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#686c75] hover:text-white text-xs px-1 cursor-pointer"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                                <div className="flex items-center justify-between mt-2 px-1 text-[9px] text-[#7d818a] uppercase tracking-wider font-semibold">
                                    <span>Select target to recalculate sequence</span>
                                    <span>{filteredMovies.length} Films</span>
                                </div>
                            </div>

                            {/* Movie List */}
                            <div className="max-h-72 overflow-y-auto divide-y divide-[#231e21] p-1.5">
                                {filteredMovies.length === 0 ? (
                                    <div className="p-6 text-center text-xs text-[#7e828a]">
                                        No movies found matching &ldquo;{search}&rdquo;
                                    </div>
                                ) : (
                                    filteredMovies.map((movie) => {
                                        const isSelected = movie.id === targetId;
                                        return (
                                            <button
                                                key={movie.id}
                                                type="button"
                                                role="option"
                                                aria-selected={isSelected}
                                                onClick={() => {
                                                    onTargetChange(movie.id);
                                                    setIsOpen(false);
                                                    setSearch("");
                                                }}
                                                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-all duration-150 cursor-pointer ${
                                                    isSelected
                                                        ? "bg-brand-red/15 border border-brand-red/50 text-white"
                                                        : "hover:bg-[#1a1618] text-[#c4c7cc] hover:text-white border border-transparent"
                                                }`}
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <span
                                                        className={`text-xs font-condensed font-bold px-1.5 py-0.5 rounded ${
                                                            isSelected
                                                                ? "bg-brand-red text-white"
                                                                : "bg-[#251f22] text-[#8e929a]"
                                                        }`}
                                                    >
                                                        #{String(movie.id).padStart(2, "0")}
                                                    </span>
                                                    <div className="min-w-0">
                                                        <p
                                                            className={`text-xs sm:text-sm font-semibold truncate ${
                                                                isSelected ? "text-white" : "text-[#dcdfe4]"
                                                            }`}
                                                        >
                                                            {movie.title}
                                                        </p>
                                                        <p className="text-[10px] text-[#797d86] mt-0.5">
                                                            {movie.year} • {movie.runtime} min • {movie.prerequisites.length}{" "}
                                                            Prereqs
                                                        </p>
                                                    </div>
                                                </div>

                                                {isSelected && (
                                                    <span className="shrink-0 text-brand-red ml-2 bg-brand-red/15 p-1 rounded-full">
                                                        <Icon name="check" size={14} />
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <p className="text-[#8b8e93] text-[11px] m-0 max-sm:max-w-55">
                    Your optimized watch order is ready. Every story, in the right sequence.
                </p>
            </div>

            <CompletionOrb percentage={percent} />
        </div>
    );
}
