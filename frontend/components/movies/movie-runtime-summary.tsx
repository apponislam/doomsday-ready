import React from "react";
import { Icon } from "@/components/icons/icon";

interface MovieRuntimeSummaryProps {
    totalMinutes: number;
}

export function MovieRuntimeSummary({ totalMinutes }: MovieRuntimeSummaryProps) {
    const hours = Math.floor(totalMinutes / 60);

    return (
        <span className="runtime-summary">
            <Icon name="clock" /> {hours}H TOTAL RUNTIME
        </span>
    );
}
