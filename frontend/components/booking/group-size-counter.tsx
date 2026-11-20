import React from "react";

interface GroupSizeCounterProps {
    value: number;
    onChange: (value: number) => void;
}

export function GroupSizeCounter({ value, onChange }: GroupSizeCounterProps) {
    return (
        <div className="number-field">
            <button type="button" onClick={() => onChange(Math.max(1, value - 1))} aria-label="Decrease group size">
                −
            </button>
            <input type="number" min="1" max="10000" value={value} onChange={(e) => onChange(Math.max(1, Number(e.target.value) || 1))} />
            <button type="button" onClick={() => onChange(value + 1)} aria-label="Increase group size">
                +
            </button>
            <span>PEOPLE</span>
        </div>
    );
}
