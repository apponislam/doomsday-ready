import React from "react";
import { Icon } from "@/components/icons/icon";

interface MovieSearchProps {
    value: string;
    onChange: (value: string) => void;
}

export function MovieSearch({ value, onChange }: MovieSearchProps) {
    return (
        <label className="h-9.5 flex items-center gap-2.5 px-3 border border-line bg-panel text-[#60646a] w-full sm:max-w-[320px]">
            <Icon name="search" />
            <input
                className="w-full border-0 outline-none bg-transparent text-white text-[11px] placeholder:text-[#60646a]"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search the archive..."
            />
        </label>
    );
}
