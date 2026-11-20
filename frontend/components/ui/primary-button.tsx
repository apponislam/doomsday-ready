import React, { ButtonHTMLAttributes } from "react";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export function PrimaryButton({ children, className, ...props }: PrimaryButtonProps) {
    return (
        <button className={`primary-button ${className ?? ""}`} {...props}>
            {children}
        </button>
    );
}
