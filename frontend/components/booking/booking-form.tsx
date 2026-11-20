import React from "react";
import { Cinema } from "@/types";
import { Icon } from "@/components/icons/icon";
import { PrimaryButton } from "@/components/ui/primary-button";
import { GroupSizeCounter } from "@/components/booking/group-size-counter";

interface BookingFormProps {
    cinemas: Cinema[];
    cinemaId: number;
    onCinemaChange: (id: number) => void;
    group: number;
    onGroupChange: (group: number) => void;
    onCalculate: () => void;
}

export function BookingForm({ cinemas, cinemaId, onCinemaChange, group, onGroupChange, onCalculate }: BookingFormProps) {
    const cinema = cinemas.find((c) => c.id === cinemaId) || cinemas[0];

    return (
        <section className="booking-form">
            <span className="eyebrow">
                <Icon name="ticket" size={15} /> WATCH PARTY QUOTE
            </span>
            <h2>
                No empty seats.
                <br />
                No one left behind.
            </h2>
            <p>Tell us where and how many. We&apos;ll find the fewest exact bundles for your squad.</p>

            <label>
                CINEMA
                <select value={cinemaId} onChange={(e) => onCinemaChange(Number(e.target.value))}>
                    {cinemas.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </label>

            <label>
                GROUP SIZE
                <GroupSizeCounter value={group} onChange={onGroupChange} />
            </label>

            <div className="bundle-note">
                <span>AVAILABLE BUNDLES</span>
                <div>
                    {cinema.bundles.map((size) => (
                        <b key={size}>{size} SEATS</b>
                    ))}
                </div>
            </div>

            <PrimaryButton className="quote-button" onClick={onCalculate}>
                CALCULATE BEST BUNDLE <Icon name="chevron" />
            </PrimaryButton>
        </section>
    );
}
