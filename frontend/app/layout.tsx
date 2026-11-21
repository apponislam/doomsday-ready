import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ReduxProvider } from "@/components/providers/redux-provider";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const viewport: Viewport = {
    themeColor: "#0b0c0e",
    colorScheme: "dark",
    width: "device-width",
    initialScale: 1,
};

export const metadata: Metadata = {
    ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
    title: {
        default: "DOOMSDAY READY — MCU Rewatch Guide & Premiere Booking",
        template: "%s | DOOMSDAY READY",
    },
    description: "Build your path to Avengers: Doomsday. Optimized MCU rewatch orders, story prerequisite dependency tracking, and opening-night watch party ticket bundle calculator.",
    applicationName: "DOOMSDAY READY",
    keywords: ["Avengers Doomsday", "MCU Rewatch Order", "Marvel Cinematic Universe", "Movie Watch Order", "Story Prerequisite Graph", "Marvel Timeline", "Cinema Ticket Bundles", "Watch Party Booking"],
    authors: [{ name: "Alex Rivera" }],
    creator: "Doomsday Ready",
    publisher: "Doomsday Ready",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        ...(siteUrl ? { url: siteUrl } : {}),
        siteName: "DOOMSDAY READY",
        title: "DOOMSDAY READY — MCU Rewatch Guide & Premiere Booking",
        description: "Build your path to Avengers: Doomsday. Optimized MCU rewatch orders, story prerequisite dependency tracking, and opening-night watch party ticket bundle calculator.",
        images: [
            {
                url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=85",
                width: 1200,
                height: 630,
                alt: "Doomsday Ready Cinema & MCU Rewatch Experience",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "DOOMSDAY READY — MCU Rewatch Guide & Premiere Booking",
        description: "Build your path to Avengers: Doomsday. Optimized MCU rewatch orders, story prerequisite dependency tracking, and opening-night watch party ticket bundle calculator.",
        images: ["https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=85"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    icons: {
        icon: [
            { url: "/icon.svg", type: "image/svg+xml" },
            { url: "/favicon.ico", sizes: "any" },
        ],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="bg-background text-foreground min-h-screen min-w-[320px] font-sans">
                <ReduxProvider>
                    <div className="min-h-screen bg-[radial-gradient(circle_at_90%_0%,rgba(131,24,22,0.12),transparent_30%),var(--color-background)]">
                        <Sidebar />
                        <main className="min-h-screen md:ml-61 max-lg:md:ml-19.5 max-md:pb-17">
                            <Header />
                            <div className="p-[44px_clamp(28px,5vw,76px)_70px] max-md:p-[24px_16px_calc(76px+env(safe-area-inset-bottom,0px))] max-w-[1540px] mx-auto">
                                {children}
                            </div>
                        </main>
                        <MobileNav />
                    </div>
                </ReduxProvider>
            </body>
        </html>
    );
}
