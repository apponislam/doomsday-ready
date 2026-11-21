import React from "react";
import { Icon } from "@/components/icons/icon";
import { PrimaryButton } from "@/components/ui/primary-button";

interface EmptyStateProps {
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
    return (
        <div className="p-12 border border-[#292c30] bg-[#111316] text-center my-6">
            <span className="w-12 h-12 mx-auto mb-4 grid place-items-center rounded-full bg-[#1c1f24] text-[#8e9299]">
                <Icon name="film" size={20} />
            </span>
            <span className="text-[#64686e] text-[8px] font-bold tracking-[2px] uppercase block mb-1">
                ARCHIVE EMPTY
            </span>
            <h3 className="font-condensed font-semibold text-[22px] text-white leading-tight mb-2">
                {title}
            </h3>
            <p className="text-[#8e9299] text-[11px] leading-relaxed max-w-sm mx-auto mb-6">
                {description}
            </p>
            {onAction && actionLabel && (
                <PrimaryButton onClick={onAction} className="mx-auto">
                    <Icon name="plus" /> {actionLabel}
                </PrimaryButton>
            )}
        </div>
    );
}

