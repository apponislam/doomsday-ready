import React from "react";
import { IconName } from "@/types";

interface IconProps {
    name: IconName;
    size?: number;
    className?: string;
}

export function Icon({ name, size = 18, className }: IconProps) {
    const paths: Record<IconName, React.ReactNode> = {
        film: (
            <>
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <path d="M7 4v16M17 4v16M3 9h4M17 9h4M3 15h4M17 15h4" />
            </>
        ),
        route: (
            <>
                <circle cx="6" cy="18" r="2" />
                <circle cx="18" cy="6" r="2" />
                <path d="M8 18h3a3 3 0 0 0 3-3v-6a3 3 0 0 1 3-3" />
            </>
        ),
        ticket: <path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4V8Z" />,
        plus: <path d="M12 5v14M5 12h14" />,
        clock: (
            <>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
            </>
        ),
        check: <path d="m5 12 4 4L19 7" />,
        chevron: <path d="m9 18 6-6-6-6" />,
        edit: <path d="m14 5 5 5M4 20l4-1 11-11a2 2 0 0 0-3-3L5 16l-1 4Z" />,
        search: (
            <>
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
            </>
        ),
        spark: (
            <>
                <path d="m12 3 1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7L12 3Z" />
                <path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
            </>
        ),
    };

    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
            {paths[name]}
        </svg>
    );
}
