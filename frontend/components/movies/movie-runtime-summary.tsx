import React from "react";
import { Icon } from "@/components/icons/icon";

interface MovieRuntimeSummaryProps {
    totalMinutes: number;
}

export function MovieRuntimeSummary({ totalMinutes }: MovieRuntimeSummaryProps) {
    const hours = Math.floor(totalMinutes / 60);

    return (
        <span className="hidden sm:flex items-center gap-2 text-[#696d73] text-[8px] tracking-[1.3px] font-semibold">
            <Icon name="clock" /> {hours}H TOTAL RUNTIME
        </span>
    );
}
