"use client";

import React, { useState, useEffect, useMemo } from "react";
import { bookingQuote } from "@/utils/booking-quote";
import { BookingForm } from "@/components/booking/booking-form";
import { QuotePanel } from "@/components/booking/quote-panel";
import { useGetCinemasQuery, useGetBookingQuoteQuery } from "@/redux/features/cinemas/cinemaApi";
import { BookingSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";

export function BookingView() {
    const {
        data: cinemasResponse,
        isLoading: isCinemasLoading,
        isError: isCinemasError,
        error: cinemasError,
        refetch: refetchCinemas,
    } = useGetCinemasQuery();

    const cinemas = cinemasResponse?.data ?? [];

    const [cinemaId, setCinemaId] = useState<number>(1);
    const [group, setGroup] = useState<number>(11);
    const [quoted, setQuoted] = useState<boolean>(true);

    // Auto-select first cinema when cinemas data arrives
    useEffect(() => {
        if (cinemas.length > 0) {
            const exists = cinemas.some((c) => c.id === cinemaId);
            if (!exists) {
                setCinemaId(cinemas[0].id);
            }
        }
    }, [cinemas, cinemaId]);

    const cinema = cinemas.find((c) => c.id === cinemaId) || cinemas[0];

    // Query backend booking quote API
    const {
        data: quoteResponse,
    } = useGetBookingQuoteQuery(
        { id: cinemaId, groupSize: group },
        { skip: !quoted || !cinema?.bundles }
    );

    // Backend DP coin-change solver quote calculation
    const quote = useMemo(() => {
        if (!quoted || !cinema) return null;
        if (quoteResponse?.data) {
            if (quoteResponse.data.possible && quoteResponse.data.picks) {
                return {
                    count: quoteResponse.data.totalBundles ?? quoteResponse.data.picks.length,
                    picks: quoteResponse.data.picks,
                };
            }
            if (quoteResponse.data.possible === false) {
                return null;
            }
        }
        return bookingQuote(cinema.bundles, group);
    }, [quoted, quoteResponse?.data, cinema, group]);

    const handleCinemaChange = (id: number) => {
        setCinemaId(id);
        setQuoted(false);
    };

    const handleGroupChange = (newGroup: number) => {
        setGroup(newGroup);
        setQuoted(false);
    };

    if (isCinemasLoading) {
        return <BookingSkeleton />;
    }

    if (isCinemasError) {
        return (
            <ErrorState
                title="Unable to Load Cinemas"
                error={cinemasError}
                onRetry={refetchCinemas}
            />
        );
    }

    if (cinemas.length === 0) {
        return (
            <EmptyState
                title="No Screening Cinemas Available"
                description="No cinema locations currently configured in the database. Add cinemas through the backend API."
            />
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(330px,0.85fr)_minmax(420px,1.15fr)] border border-[#292c30] min-h-162.5 max-md:min-h-0">
            <BookingForm
                cinemas={cinemas}
                cinemaId={cinemaId}
                onCinemaChange={handleCinemaChange}
                group={group}
                onGroupChange={handleGroupChange}
                onCalculate={() => setQuoted(true)}
            />
            <QuotePanel cinema={cinema} group={group} quoted={quoted} quote={quote} />
        </div>
    );
}
