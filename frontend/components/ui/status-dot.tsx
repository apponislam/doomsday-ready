import React from "react";

export function StatusDot({ className }: { className?: string }) {
    return <span className={`status-dot ${className ?? ""}`} aria-hidden="true" />;
}
