import React from "react";

interface BundleGridProps {
    counts: Record<number, number>;
}

export function BundleGrid({ counts }: BundleGridProps) {
    const sorted = Object.entries(counts).sort((a, b) => Number(b[0]) - Number(a[0]));

    return (
        <div className="bundle-grid">
            {sorted.map(([size, count]) => (
                <div key={size}>
                    <span>{count}×</span>
                    <strong>{size}</strong>
                    <small>SEAT BUNDLE</small>
                </div>
            ))}
        </div>
    );
}
