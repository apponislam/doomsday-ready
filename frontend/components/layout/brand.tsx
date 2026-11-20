import React from "react";
import Link from "next/link";

interface BrandProps {
    onClick?: () => void;
}

export function Brand({ onClick }: BrandProps) {
    return (
        <Link href="/" className="brand" onClick={onClick} aria-label="Doomsday Ready home">
            <span className="brand-mark">DR</span>
            <span>
                <strong>DOOMSDAY</strong>
                <small>READY</small>
            </span>
        </Link>
    );
}
