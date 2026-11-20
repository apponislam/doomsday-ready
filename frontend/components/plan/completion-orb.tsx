import React from "react";

interface CompletionOrbProps {
    percentage: number;
}

export function CompletionOrb({ percentage }: CompletionOrbProps) {
    return (
        <div
            className="orb"
            style={{
                background: `conic-gradient(var(--red) 0 ${percentage}%, #2a2022 ${percentage}%)`,
            }}
        >
            <div>
                <strong>{percentage}%</strong>
                <span>COMPLETE</span>
            </div>
        </div>
    );
}
