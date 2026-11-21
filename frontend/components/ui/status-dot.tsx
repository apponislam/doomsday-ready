import React from "react";

export function StatusDot({ className }: { className?: string }) {
    return <span className={`inline-block w-1.5 h-1.5 bg-brand-red rounded-full shadow-[0_0_8px_#ef3e36] align-middle mr-1.5 ${className ?? ""}`} aria-hidden="true" />;
}
