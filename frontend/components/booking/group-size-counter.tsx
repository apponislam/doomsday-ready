import React from "react";

interface GroupSizeCounterProps {
    value: number;
    onChange: (value: number) => void;
}

export function GroupSizeCounter({ value, onChange }: GroupSizeCounterProps) {
    return (
        <div className="h-14.5 flex items-center border border-[#34373c] bg-[#17191c]">
            <button type="button" className="w-11.25 h-full border-0 bg-transparent text-[#92969b] hover:text-white text-[20px] cursor-pointer flex items-center justify-center transition-colors" onClick={() => onChange(Math.max(1, value - 1))} aria-label="Decrease group size">
                −
            </button>
            <input type="number" min="1" max="10000" value={value} onChange={(e) => onChange(Math.max(1, Number(e.target.value) || 1))} className="w-20 h-full border-0 outline-none bg-transparent text-white text-center font-condensed font-semibold text-[29px]" />
            <button type="button" className="w-11.25 h-full border-0 bg-transparent text-[#92969b] hover:text-white text-[20px] cursor-pointer flex items-center justify-center transition-colors" onClick={() => onChange(value + 1)} aria-label="Increase group size">
                +
            </button>
            <span className="ml-auto mr-4.5 text-[#5f6368] text-[8px] font-semibold tracking-wider">PEOPLE</span>
        </div>
    );
}
