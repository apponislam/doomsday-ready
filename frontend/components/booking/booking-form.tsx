import React, { useEffect } from "react";
import { Cinema } from "@/types";
import { Icon } from "@/components/icons/icon";
import { PrimaryButton } from "@/components/ui/primary-button";
import { GroupSizeCounter } from "@/components/booking/group-size-counter";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const bookingFormSchema = z.object({
    cinemaId: z.number().min(1, "Please select a cinema"),
    groupSize: z
        .number()
        .int("Group size must be an integer")
        .min(1, "Group size must be at least 1 person")
        .max(1000, "Group size cannot exceed 1,000 people"),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface BookingFormProps {
    cinemas: Cinema[];
    cinemaId: number;
    onCinemaChange: (id: number) => void;
    group: number;
    onGroupChange: (group: number) => void;
    onCalculate: () => void;
}

export function BookingForm({ cinemas, cinemaId, onCinemaChange, group, onGroupChange, onCalculate }: BookingFormProps) {
    const {
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<BookingFormValues>({
        resolver: zodResolver(bookingFormSchema),
        defaultValues: {
            cinemaId,
            groupSize: group,
        },
    });

    const currentCinemaId = watch("cinemaId");
    const cinema = cinemas.find((c) => c.id === currentCinemaId) || cinemas[0];

    useEffect(() => {
        setValue("cinemaId", cinemaId);
    }, [cinemaId, setValue]);

    useEffect(() => {
        setValue("groupSize", group);
    }, [group, setValue]);

    const onSubmit = (data: BookingFormValues) => {
        onCinemaChange(data.cinemaId);
        onGroupChange(data.groupSize);
        onCalculate();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-[clamp(30px,5vw,64px)] max-md:p-[30px_22px] bg-panel">
            <span className="flex items-center gap-1.5 text-brand-red font-semibold text-[10px] tracking-[2px] uppercase">
                <Icon name="ticket" size={15} /> WATCH PARTY QUOTE
            </span>
            <h2 className="my-4 mb-3 font-condensed font-semibold text-[clamp(36px,4vw,52px)] leading-[0.98] text-white tracking-[-0.6px]">
                No empty seats.
                <br />
                No one left behind.
            </h2>
            <p className="max-w-100 text-[#7f8389] text-[11px] leading-[1.7] mb-9">Tell us where and how many. We&apos;ll find the fewest exact bundles for your squad.</p>

            <label className="grid gap-2.5 mt-5 text-[#777b81] text-[8px] tracking-[1.5px] font-semibold">
                CINEMA
                <Controller
                    name="cinemaId"
                    control={control}
                    render={({ field }) => (
                        <select
                            value={field.value}
                            onChange={(e) => {
                                const id = Number(e.target.value);
                                field.onChange(id);
                                onCinemaChange(id);
                            }}
                            className="appearance-none w-full h-10.5 px-3 border border-[#34373c] bg-[#17191c] text-white outline-none focus:border-brand-red cursor-pointer"
                        >
                            {cinemas.map((c) => (
                                <option key={c.id} value={c.id} className="bg-[#17191c] text-white">
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    )}
                />
                {errors.cinemaId && (
                    <span className="text-brand-red text-[10px] tracking-normal font-normal">{errors.cinemaId.message}</span>
                )}
            </label>

            <label className="grid gap-2.5 mt-5 text-[#777b81] text-[8px] tracking-[1.5px] font-semibold">
                GROUP SIZE
                <Controller
                    name="groupSize"
                    control={control}
                    render={({ field }) => (
                        <GroupSizeCounter
                            value={field.value}
                            onChange={(val) => {
                                field.onChange(val);
                                onGroupChange(val);
                            }}
                        />
                    )}
                />
                {errors.groupSize && (
                    <span className="text-brand-red text-[10px] tracking-normal font-normal">{errors.groupSize.message}</span>
                )}
            </label>

            <div className="flex items-center justify-between mt-5">
                <span className="text-[#666a70] text-[8px] tracking-[1.3px] font-semibold">AVAILABLE BUNDLES</span>
                <div className="flex gap-1.5 flex-wrap">
                    {cinema.bundles.map((size) => (
                        <b key={size} className="px-2 py-1 border border-[#383b40] bg-[#1b1d21] text-[#9b9ea3] text-[7px] font-normal tracking-[0.6px]">
                            {size} SEATS
                        </b>
                    ))}
                </div>
            </div>

            <PrimaryButton type="submit" className="w-full mt-7.5">
                CALCULATE BEST BUNDLE <Icon name="chevron" />
            </PrimaryButton>
        </form>
    );
}
