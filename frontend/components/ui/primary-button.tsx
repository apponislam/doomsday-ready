import React, { ButtonHTMLAttributes } from "react";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export function PrimaryButton({ children, className, ...props }: PrimaryButtonProps) {
    return (
        <button
            className={`inline-flex items-center justify-center gap-2 min-h-10.5 px-4.5 border border-[#fd5149] bg-linear-to-b from-[#ed453d] to-[#b92722] text-white text-[10px] font-bold tracking-[1.2px] shadow-[0_6px_22px_rgba(188,37,32,0.18)] cursor-pointer transition-all duration-150 hover:brightness-110 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed ${className ?? ""}`}
            {...props}
        >
            {children}
        </button>
    );
}
