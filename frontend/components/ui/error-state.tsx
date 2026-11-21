import React from "react";
import { Icon } from "@/components/icons/icon";
import { PrimaryButton } from "@/components/ui/primary-button";

interface ErrorStateProps {
    title?: string;
    message?: string;
    error?: any;
    onRetry?: () => void;
    className?: string;
}

export function ErrorState({
    title = "System Connection Error",
    message,
    error,
    onRetry,
    className = "",
}: ErrorStateProps) {
    const errorMessage =
        message ||
        error?.data?.message ||
        error?.message ||
        (error?.status ? `HTTP ${error.status}: Service communication failed.` : "Could not reach backend API server. Verify server is running on http://localhost:5000.");

    return (
        <div className={`p-8 border border-brand-red/50 bg-[#150f11] text-center my-6 max-w-2xl mx-auto shadow-[0_0_30px_rgba(158,41,37,0.18)] ${className}`}>
            <span className="w-12 h-12 mx-auto mb-4 grid place-items-center rounded-full bg-brand-deep text-brand-red border border-brand-red/40">
                <span className="font-condensed font-bold text-xl">!</span>
            </span>
            <span className="text-brand-red text-[8px] font-bold tracking-[2px] uppercase block mb-1.5">
                API CONNECTION FAILED
            </span>
            <h3 className="font-condensed font-semibold text-[24px] text-white leading-tight mb-2">
                {title}
            </h3>
            <p className="text-[#a4a7ac] text-[12px] leading-relaxed max-w-md mx-auto mb-6">
                {errorMessage}
            </p>
            {onRetry && (
                <PrimaryButton onClick={onRetry} className="mx-auto">
                    RETRY CONNECTION <Icon name="route" size={14} />
                </PrimaryButton>
            )}
        </div>
    );
}

