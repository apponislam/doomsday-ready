import React from "react";
import { Icon } from "@/components/icons/icon";

interface MovieSearchProps {
    value: string;
    onChange: (value: string) => void;
}

export function MovieSearch({ value, onChange }: MovieSearchProps) {
    return (
        <label className="search">
            <Icon name="search" />
            <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Search the archive..." />
        </label>
    );
}
