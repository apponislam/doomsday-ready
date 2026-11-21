import React from "react";
import Link from "next/link";
import { Icon } from "@/components/icons/icon";
import { StatusDot } from "@/components/ui/status-dot";

export default function NotFound() {
    return (
        <div className="fixed inset-0 z-50 bg-[#0b0c0e] bg-[radial-gradient(ellipse_at_center,rgba(185,39,34,0.15),transparent_65%)] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="w-full max-w-2xl relative border border-[#292c31] bg-[#111316] p-8 sm:p-12 text-center shadow-[0_0_80px_rgba(0,0,0,0.9)]">
                {/* HUD Corner Tactical Accents */}
                <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-brand-red" />
                <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-brand-red" />
                <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-[#3d424b]" />
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-[#3d424b]" />

                {/* Sector Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#17191d] border border-[#292c31] text-[10px] font-bold tracking-[2px] text-brand-red uppercase mb-4">
                    <StatusDot />
                    <span>TIMELINE ANOMALY // 404</span>
                </div>

                {/* Glitch 404 Typography */}
                <div className="relative inline-block my-2">
                    <h1 className="font-condensed font-black text-[96px] sm:text-[132px] tracking-tight text-white leading-none select-none">
                        4<span className="text-brand-red">0</span>4
                    </h1>
                    <div className="absolute -inset-6 bg-radial from-brand-red/25 to-transparent blur-3xl pointer-events-none -z-10" />
                </div>

                <h2 className="font-condensed font-bold text-[22px] sm:text-[28px] text-white tracking-wide uppercase mb-3">
                    SECTOR NOT FOUND // COORDINATES UNRESOLVED
                </h2>

                <p className="text-[#8e9299] text-[13px] leading-relaxed max-w-lg mx-auto mb-6">
                    The requested timeline node does not exist in the Marvel Cinematic Universe archive or was severed from the Sacred Timeline. Recalibrate your navigation coordinates to rejoin the active mission.
                </p>

                {/* Diagnostic HUD Box */}
                <div className="p-4 bg-[#0b0c0e]/95 border border-[#202226] font-mono text-[11px] text-[#8e9299] max-w-md mx-auto text-left space-y-1.5 mb-8">
                    <div className="flex justify-between items-center text-[10px] uppercase tracking-wider border-b border-[#202226] pb-2 mb-2 text-[#64686e]">
                        <span>TELEMETRY DIAGNOSTIC</span>
                        <span className="text-brand-red font-bold">BRANCH SEVERED</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[#64686e]">ANOMALY:</span>
                        <span className="text-white">ERR_HTTP_404_PAGE_MISSING</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[#64686e]">TARGET:</span>
                        <span className="text-brand-red font-semibold">UNKNOWN ROUTE</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[#64686e]">STATUS:</span>
                        <span className="text-[#f1f0ed]">SAFE BASE RECOVERY READY</span>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 min-h-11 px-5.5 border border-[#fd5149] bg-linear-to-b from-[#ed453d] to-[#b92722] text-white text-[11px] font-bold tracking-[1.3px] uppercase shadow-[0_6px_22px_rgba(188,37,32,0.3)] transition-all hover:brightness-110 active:translate-y-px"
                    >
                        <Icon name="film" size={15} />
                        <span>RETURN TO ARCHIVE</span>
                    </Link>

                    <Link
                        href="/plan"
                        className="inline-flex items-center justify-center gap-2 min-h-11 px-5 border border-[#292c31] bg-[#17191d] text-[#f1f0ed] text-[11px] font-bold tracking-[1.3px] uppercase transition-colors hover:border-[#3d424b] hover:bg-[#202329]"
                    >
                        <Icon name="route" size={15} />
                        <span>REWATCH PLANNER</span>
                    </Link>

                    <Link
                        href="/booking"
                        className="inline-flex items-center justify-center gap-2 min-h-11 px-5 border border-[#292c31] bg-[#17191d] text-[#f1f0ed] text-[11px] font-bold tracking-[1.3px] uppercase transition-colors hover:border-[#3d424b] hover:bg-[#202329]"
                    >
                        <Icon name="ticket" size={15} />
                        <span>TICKET BUNDLES</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
