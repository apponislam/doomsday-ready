"use client";

import React, { useState } from "react";
import { cinemas } from "@/data/initial-data";
import { bookingQuote } from "@/utils/booking-quote";
import { BookingForm } from "@/components/booking/booking-form";
import { QuotePanel } from "@/components/booking/quote-panel";

export function BookingView() {
    const [cinemaId, setCinemaId] = useState(1);
    const [group, setGroup] = useState(11);
    const [quoted, setQuoted] = useState(true);

    const cinema = cinemas.find((c) => c.id === cinemaId) || cinemas[0];
    const quote = quoted ? bookingQuote(cinema.bundles, group) : null;

    const handleCinemaChange = (id: number) => {
        setCinemaId(id);
        setQuoted(false);
    };

    const handleGroupChange = (newGroup: number) => {
        setGroup(newGroup);
        setQuoted(false);
    };

    return (
        <div className="booking-layout">
            <BookingForm cinemas={cinemas} cinemaId={cinemaId} onCinemaChange={handleCinemaChange} group={group} onGroupChange={handleGroupChange} onCalculate={() => setQuoted(true)} />
            <QuotePanel cinema={cinema} group={group} quoted={quoted} quote={quote} />
        </div>
    );
}
