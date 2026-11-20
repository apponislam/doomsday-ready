"use client";

import React, { useEffect, useState } from "react";
import { StatusDot } from "@/components/ui/status-dot";

export function PremiereCountdown() {
    const [timeLeft, setTimeLeft] = useState({
        days: "278",
        hours: "06",
        minutes: "42",
    });

    useEffect(() => {
        const premiereDate = new Date("2026-12-18T00:00:00");

        const update = () => {
            const now = new Date();
            const diff = premiereDate.getTime() - now.getTime();

            if (diff > 0) {
                const d = Math.floor(diff / (1000 * 60 * 60 * 24));
                const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const m = Math.floor((diff / (1000 * 60)) % 60);

                setTimeLeft({
                    days: String(d),
                    hours: String(h).padStart(2, "0"),
                    minutes: String(m).padStart(2, "0"),
                });
            }
        };

        update();
        const interval = setInterval(update, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="premiere-card">
            <StatusDot />
            <p>PREMIERE COUNTDOWN</p>
            <strong>DEC 18, 2026</strong>
            <div className="count-row">
                <span>
                    <b>{timeLeft.days}</b>
                    <small>DAYS</small>
                </span>
                <i />
                <span>
                    <b>{timeLeft.hours}</b>
                    <small>HRS</small>
                </span>
                <i />
                <span>
                    <b>{timeLeft.minutes}</b>
                    <small>MIN</small>
                </span>
            </div>
        </div>
    );
}
