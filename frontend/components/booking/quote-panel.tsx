import React from "react";
import { Cinema, BookingQuote } from "@/types";
import { Icon } from "@/components/icons/icon";
import { BundleGrid } from "@/components/booking/bundle-grid";

interface QuotePanelProps {
    cinema: Cinema;
    group: number;
    quoted: boolean;
    quote: BookingQuote | null;
}

export function QuotePanel({ cinema, group, quoted, quote }: QuotePanelProps) {
    const counts = quote?.picks.reduce<Record<number, number>>((acc, size) => ({ ...acc, [size]: (acc[size] || 0) + 1 }), {});

    return (
        <section className={`quote-panel ${!quoted ? "waiting" : ""}`}>
            <div className="cinema-image">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=85" alt="Rows of red seats in a dark cinema" />
                <div>
                    <span>OPENING NIGHT</span>
                    <strong>{cinema.name}</strong>
                    <small>December 18, 2026 · 7:30 PM</small>
                </div>
            </div>

            {quoted && quote ? (
                <div className="quote-result">
                    <div className="quote-success">
                        <span>
                            <Icon name="check" />
                        </span>
                        <div>
                            <p>PERFECT MATCH FOUND</p>
                            <h3>
                                {quote.count} bundles for {group} people
                            </h3>
                        </div>
                    </div>

                    <BundleGrid counts={counts ?? {}} />

                    <div className="seat-check">
                        <span>SEATS RESERVED</span>
                        <strong>
                            {group} / {group}
                        </strong>
                    </div>
                    <div className="seat-bar">
                        <i />
                    </div>
                    <p className="exact-note">
                        <Icon name="check" size={15} /> Exact fit. Zero empty seats.
                    </p>
                </div>
            ) : quoted ? (
                <div className="impossible">
                    <span>NO EXACT MATCH</span>
                    <h3>Not possible for {group} people</h3>
                    <p>Try adjusting your group size to match the available bundles.</p>
                </div>
            ) : (
                <div className="impossible">
                    <span>READY WHEN YOU ARE</span>
                    <h3>Calculate your bundle</h3>
                    <p>Your exact opening-night seat plan will appear here.</p>
                </div>
            )}
        </section>
    );
}
