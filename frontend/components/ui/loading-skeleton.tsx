import React from "react";

export function Skeleton({ className = "" }: { className?: string }) {
    return <div className={`animate-pulse bg-[#1c1f24] rounded-xs ${className}`} />;
}

export function MovieTableSkeleton({ rows = 6 }: { rows?: number }) {
    return (
        <div className="border border-[#25282c] bg-[#121417]/75">
            <div className="grid items-center px-5 min-h-10.75 text-[#64686e] border-b border-[#292c30] text-[8px] tracking-[1.3px] font-semibold max-md:hidden grid-cols-[62px_minmax(240px,1.5fr)_100px_110px_minmax(180px,1fr)_42px] max-lg:grid-cols-[50px_minmax(210px,1.5fr)_80px_90px_1fr_36px]">
                <span>STATUS</span>
                <span>MOVIE</span>
                <span>RELEASE</span>
                <span>RUNTIME</span>
                <span>PREREQUISITES</span>
                <span />
            </div>
            {Array.from({ length: rows }).map((_, idx) => (
                <div
                    key={idx}
                    className="grid items-center px-5 min-h-18.5 border-b border-[#24262a] last:border-b-0 grid-cols-[62px_minmax(240px,1.5fr)_100px_110px_minmax(180px,1fr)_42px] max-lg:grid-cols-[50px_minmax(210px,1.5fr)_80px_90px_1fr_36px] gap-3"
                >
                    <Skeleton className="w-5 h-5 rounded" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-48 max-w-full" />
                        <Skeleton className="h-2.5 w-24" />
                    </div>
                    <Skeleton className="h-3.5 w-12" />
                    <Skeleton className="h-3.5 w-16" />
                    <div className="flex gap-2">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-16" />
                    </div>
                    <Skeleton className="w-6 h-6 rounded" />
                </div>
            ))}
        </div>
    );
}

export function PlanSkeleton() {
    return (
        <div className="space-y-8">
            <div className="p-8 border border-[#25282c] bg-panel flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-3 w-full max-w-md">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-8 w-72" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <Skeleton className="w-32 h-32 rounded-full shrink-0" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="p-5 border border-[#25282c] bg-panel space-y-2">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-7 w-16" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function BookingSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(330px,0.85fr)_minmax(420px,1.15fr)] border border-[#292c30] min-h-162.5">
            <div className="p-8 bg-panel space-y-6">
                <Skeleton className="h-3 w-36" />
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
            <div className="bg-[#0d0f11] p-8 flex flex-col justify-center items-center space-y-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
            </div>
        </div>
    );
}

