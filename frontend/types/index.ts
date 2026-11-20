export type View = "movies" | "plan" | "booking";

export type Movie = {
    id: number;
    title: string;
    year: number;
    runtime: number;
    prerequisites: number[];
    watched: boolean;
};

export type IconName = "film" | "route" | "ticket" | "plus" | "clock" | "check" | "chevron" | "edit" | "search" | "spark";

export type Cinema = {
    id: number;
    name: string;
    bundles: number[];
};

export type BookingQuote = {
    count: number;
    picks: number[];
};
