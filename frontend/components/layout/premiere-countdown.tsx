"use client";

import React, { useEffect, useState } from "react";
import { StatusDot } from "@/components/ui/status-dot";

export function PremiereCountdown() {
    const [timeLeft, setTimeLeft] = useState<{
        days: string;
        hours: string;
        minutes: string;
        seconds: string;
    } | null>(null);

    useEffect(() => {
        const premiereDate = new Date("2026-12-18T00:00:00");

        const update = () => {
            const now = new Date();
            const diff = premiereDate.getTime() - now.getTime();

            if (diff > 0) {
                const d = Math.floor(diff / (1000 * 60 * 60 * 24));
                const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const m = Math.floor((diff / (1000 * 60)) % 60);
                const s = Math.floor((diff / 1000) % 60);

                setTimeLeft({
                    days: String(d),
                    hours: String(h).padStart(2, "0"),
                    minutes: String(m).padStart(2, "0"),
                    seconds: String(s).padStart(2, "0"),
                });
            } else {
                setTimeLeft({
                    days: "0",
                    hours: "00",
                    minutes: "00",
                    seconds: "00",
                });
            }
        };

        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="mt-auto p-4 border border-[#2a2c30] bg-linear-to-br from-[#181719] to-[#101113] max-lg:hidden">
            <div className="flex items-center mb-2">
                <StatusDot />
                <p className="text-[#74777c] text-[8px] tracking-[1.6px] font-semibold m-0">PREMIERE COUNTDOWN</p>
            </div>
            <strong className="block font-condensed font-semibold text-[17px] tracking-[1px] text-white">DEC 18, 2026</strong>
            <div className="grid grid-cols-4 items-center text-center mt-3.5 divide-x divide-[#303237]">
                <span className="px-1">
                    <b className="block font-condensed font-semibold text-[18px] text-white leading-tight">
                        {timeLeft ? timeLeft.days : "--"}
                    </b>
                    <small className="block text-[#686b70] text-[7px] tracking-[1px] mt-0.5">DAYS</small>
                </span>
                <span className="px-1">
                    <b className="block font-condensed font-semibold text-[18px] text-white leading-tight">
                        {timeLeft ? timeLeft.hours : "--"}
                    </b>
                    <small className="block text-[#686b70] text-[7px] tracking-[1px] mt-0.5">HRS</small>
                </span>
                <span className="px-1">
                    <b className="block font-condensed font-semibold text-[18px] text-white leading-tight">
                        {timeLeft ? timeLeft.minutes : "--"}
                    </b>
                    <small className="block text-[#686b70] text-[7px] tracking-[1px] mt-0.5">MIN</small>
                </span>
                <span className="px-1">
                    <b className="block font-condensed font-semibold text-[18px] text-brand-red leading-tight">
                        {timeLeft ? timeLeft.seconds : "--"}
                    </b>
                    <small className="block text-brand-red/80 text-[7px] tracking-[1px] mt-0.5 font-bold">SEC</small>
                </span>
            </div>
        </div>
    );
}
