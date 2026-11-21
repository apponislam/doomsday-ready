"use client";

import React from "react";
import { Icon } from "@/components/icons/icon";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
}

export function Pagination({
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    onPageChange,
    isLoading = false,
}: PaginationProps) {
    if (totalItems <= 0) return null;

    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, "...", totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, "...", currentPage, "...", totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-between px-5 py-2.5 border border-[#24262a] border-t-0 bg-[#0d0e11] min-h-11">
            {/* Left side: Compact range indicator */}
            <div className="text-[10px] font-condensed font-semibold tracking-[1.3px] text-[#6d7178] uppercase select-none">
                SHOWING <span className="text-white font-bold">{startItem.toLocaleString()}</span>–
                <span className="text-white font-bold">{endItem.toLocaleString()}</span> OF{" "}
                <span className="text-brand-red font-bold">{totalItems.toLocaleString()}</span> FILMS
            </div>

            {/* Right side: Sleek, compact HUD pagination buttons */}
            <div className="ml-auto flex items-center gap-1">
                {/* First page (if > 3 pages) */}
                {totalPages > 3 && (
                    <button
                        type="button"
                        onClick={() => onPageChange(1)}
                        disabled={currentPage <= 1 || isLoading}
                        className="w-7 h-7 rounded border border-[#25282e] bg-[#121417] text-[#7d828a] hover:text-white hover:border-[#383b42] hover:bg-[#1a1d22] disabled:opacity-20 disabled:pointer-events-none transition-colors grid place-items-center cursor-pointer select-none text-[11px] font-mono font-bold leading-none"
                        title="First page"
                        aria-label="First page"
                    >
                        «
                    </button>
                )}

                {/* Prev page button */}
                <button
                    type="button"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1 || isLoading}
                    className="w-7 h-7 rounded border border-[#25282e] bg-[#121417] text-[#7d828a] hover:text-white hover:border-[#383b42] hover:bg-[#1a1d22] disabled:opacity-20 disabled:pointer-events-none transition-colors grid place-items-center cursor-pointer select-none"
                    title="Previous page"
                    aria-label="Previous page"
                >
                    <span className="rotate-180 -mr-0.5">
                        <Icon name="chevron" size={13} />
                    </span>
                </button>

                {/* Page number pills */}
                <div className="flex items-center gap-1">
                    {getPageNumbers().map((p, idx) => {
                        if (typeof p === "string") {
                            return (
                                <span
                                    key={`ellipsis-${idx}`}
                                    className="w-5 h-7 grid place-items-center text-[#4b4e56] select-none font-bold text-[11px]"
                                >
                                    …
                                </span>
                            );
                        }

                        const isActive = p === currentPage;
                        return (
                            <button
                                key={p}
                                type="button"
                                onClick={() => onPageChange(p)}
                                disabled={isLoading}
                                className={`w-7 h-7 rounded text-[10px] font-condensed font-bold transition-all duration-150 grid place-items-center cursor-pointer select-none ${
                                    isActive
                                        ? "bg-brand-red text-white border border-brand-red shadow-[0_0_8px_rgba(239,62,54,0.45)]"
                                        : "border border-[#25282e] bg-[#121417] text-[#8e929a] hover:text-white hover:border-[#383b42] hover:bg-[#1a1d22]"
                                }`}
                            >
                                {p}
                            </button>
                        );
                    })}
                </div>

                {/* Next page button */}
                <button
                    type="button"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || isLoading}
                    className="w-7 h-7 rounded border border-[#25282e] bg-[#121417] text-[#7d828a] hover:text-white hover:border-[#383b42] hover:bg-[#1a1d22] disabled:opacity-20 disabled:pointer-events-none transition-colors grid place-items-center cursor-pointer select-none"
                    title="Next page"
                    aria-label="Next page"
                >
                    <span className="-ml-0.5">
                        <Icon name="chevron" size={13} />
                    </span>
                </button>

                {/* Last page (if > 3 pages) */}
                {totalPages > 3 && (
                    <button
                        type="button"
                        onClick={() => onPageChange(totalPages)}
                        disabled={currentPage >= totalPages || isLoading}
                        className="w-7 h-7 rounded border border-[#25282e] bg-[#121417] text-[#7d828a] hover:text-white hover:border-[#383b42] hover:bg-[#1a1d22] disabled:opacity-20 disabled:pointer-events-none transition-colors grid place-items-center cursor-pointer select-none text-[11px] font-mono font-bold leading-none"
                        title="Last page"
                        aria-label="Last page"
                    >
                        »
                    </button>
                )}
            </div>
        </div>
    );
}
