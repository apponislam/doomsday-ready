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
        <section className={`grid grid-rows-[250px_1fr] max-lg:grid-rows-[minmax(330px,auto)] max-lg:grid-cols-[1fr_1.2fr] max-md:block bg-[#0d0f11] ${!quoted ? "brightness-90" : ""}`}>
            <div className="relative overflow-hidden max-md:h-55 max-md:min-h-55 after:content-[''] after:absolute after:inset-0 after:pointer-events-none after:bg-[linear-gradient(0deg,#0d0f11,transparent_80%),linear-gradient(90deg,rgba(0,0,0,0.55),transparent)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=85"
                    alt="Rows of red seats in a dark cinema"
                    className="w-full h-full object-cover saturate-[0.65] contrast-[1.15]"
                />
                <div className="absolute z-2 left-9 bottom-7">
                    <span className="block text-brand-red text-[8px] tracking-[1.6px] font-semibold mb-1.5 uppercase">OPENING NIGHT</span>
                    <strong className="block font-condensed font-semibold text-[23px] text-white leading-tight">{cinema.name}</strong>
                    <small className="block text-[#9a9da2] text-[9px] mt-1.5">December 18, 2026 · 7:30 PM</small>
                </div>
            </div>

            {quoted && quote ? (
                <div className="p-[30px_36px] max-md:p-[26px_20px]">
                    <div className="flex items-center gap-3.5">
                        <span className="w-8.75 h-8.75 grid place-items-center rounded-full text-[#d7e86b] bg-[#282d19] border border-[#4b5326] shrink-0">
                            <Icon name="check" />
                        </span>
                        <div>
                            <p className="m-0 mb-0.5 text-[#929f4c] text-[7px] tracking-[1.4px] font-semibold uppercase">PERFECT MATCH FOUND</p>
                            <h3 className="m-0 font-condensed font-semibold text-[20px] text-white">
                                {quote.count} bundles for {group} people
                            </h3>
                        </div>
                    </div>

                    <BundleGrid counts={counts ?? {}} />

                    <div className="flex justify-between text-[#777b80] text-[8px] tracking-[1.1px] font-semibold">
                        <span>SEATS RESERVED</span>
                        <strong className="text-[#d8d9d6]">
                            {group} / {group}
                        </strong>
                    </div>
                    <div className="h-1.25 mt-2.5 bg-[#282b2f] overflow-hidden rounded-full">
                        <i className="block w-full h-full bg-linear-to-r from-[#9e2925] to-brand-red not-italic" />
                    </div>
                    <p className="flex gap-2 items-center justify-center text-[#7b843f] text-[8px] tracking-[0.8px] font-semibold mt-4">
                        <Icon name="check" size={15} /> Exact fit. Zero empty seats.
                    </p>
                </div>
            ) : quoted ? (
                <div className="p-12 text-center self-center">
                    <span className="text-brand-red text-[8px] tracking-[1.5px] font-semibold block uppercase">NO EXACT MATCH</span>
                    <h3 className="font-condensed font-semibold text-[28px] text-white my-2.5">Not possible for {group} people</h3>
                    <p className="text-[#70747a] text-[10px] m-0">Try adjusting your group size to match the available bundles.</p>
                </div>
            ) : (
                <div className="p-12 text-center self-center">
                    <span className="text-brand-red text-[8px] tracking-[1.5px] font-semibold block uppercase">READY WHEN YOU ARE</span>
                    <h3 className="font-condensed font-semibold text-[28px] text-white my-2.5">Calculate your bundle</h3>
                    <p className="text-[#70747a] text-[10px] m-0">Your exact opening-night seat plan will appear here.</p>
                </div>
            )}
        </section>
    );
}
