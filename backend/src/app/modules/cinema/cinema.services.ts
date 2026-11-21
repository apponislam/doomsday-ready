import { Types } from "mongoose";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { ICinema } from "./cinema.interface";
import { CinemaModel } from "./cinema.model";

/**
 * DP coin-change algorithm to find the fewest bundles adding up to exact group size.
 */
const computeFewestBundles = (bundleSizes: number[], groupSize: number) => {
    const dp: ({ count: number; picks: number[] } | null)[] = Array(groupSize + 1).fill(null);
    dp[0] = { count: 0, picks: [] };

    const sortedSizes = [...bundleSizes].sort((a, b) => b - a);

    for (let total = 1; total <= groupSize; total++) {
        for (const size of sortedSizes) {
            if (total >= size) {
                const prev = dp[total - size];
                if (prev && (!dp[total] || prev.count + 1 < dp[total]!.count)) {
                    dp[total] = {
                        count: prev.count + 1,
                        picks: [...prev.picks, size],
                    };
                }
            }
        }
    }

    return dp[groupSize];
};

const findCinemaById = async (id: string | number) => {
    if (Types.ObjectId.isValid(String(id))) {
        const byObjectId = await CinemaModel.findById(id);
        if (byObjectId) return byObjectId;
    }

    const num = Number(id);
    if (!isNaN(num)) {
        const byNum = await CinemaModel.findOne({ id: num });
        if (byNum) return byNum;
    }

    return null;
};

const createCinema = async (payload: ICinema) => {
    // Support either bundleSizes or bundles field
    if ((!payload.bundles || payload.bundles.length === 0) && payload.bundleSizes) {
        payload.bundles = payload.bundleSizes;
    }

    const existing = await CinemaModel.findOne({ name: payload.name.trim() });
    if (existing) {
        throw new ApiError(httpStatus.CONFLICT, `A cinema named "${payload.name}" already exists.`);
    }

    if (!payload.id) {
        const lastCinema = await CinemaModel.findOne().sort({ id: -1 });
        payload.id = (lastCinema?.id ?? 0) + 1;
    }

    // Deduplicate and filter bundle sizes
    payload.bundles = Array.from(new Set(payload.bundles)).sort((a, b) => a - b);

    const result = await CinemaModel.create(payload);
    return result;
};

const getAllCinemas = async () => {
    const data = await CinemaModel.find({}).sort({ id: 1, createdAt: 1 });
    return data;
};

const getCinemaById = async (id: string) => {
    const cinema = await findCinemaById(id);
    if (!cinema) {
        throw new ApiError(httpStatus.NOT_FOUND, "Cinema not found.");
    }
    return cinema;
};

const getBookingQuote = async (id: string, groupSize: number) => {
    if (isNaN(groupSize) || groupSize < 1 || groupSize > 10000) {
        throw new ApiError(httpStatus.BAD_REQUEST, "groupSize must be an integer between 1 and 10,000.");
    }

    const cinema = await findCinemaById(id);
    if (!cinema) {
        throw new ApiError(httpStatus.NOT_FOUND, "Cinema not found.");
    }

    const quote = computeFewestBundles(cinema.bundles, groupSize);

    if (!quote) {
        return {
            possible: false,
            message: "Not possible",
            cinema: {
                id: cinema.id,
                name: cinema.name,
                bundles: cinema.bundles,
            },
            groupSize,
            bundles: null,
        };
    }

    const counts = quote.picks.reduce<Record<number, number>>((acc, size) => {
        acc[size] = (acc[size] || 0) + 1;
        return acc;
    }, {});

    const sortedBreakdown = Object.entries(counts)
        .sort((a, b) => Number(b[0]) - Number(a[0]))
        .map(([size, count]) => `${size} × ${count}`)
        .join(", ");

    const formatted = `${quote.count} ${quote.count === 1 ? "bundle" : "bundles"}: ${sortedBreakdown}`;

    return {
        possible: true,
        message: "Booking quote calculated successfully.",
        cinema: {
            id: cinema.id,
            name: cinema.name,
            bundles: cinema.bundles,
        },
        groupSize,
        totalBundles: quote.count,
        breakdown: counts,
        formatted,
        picks: quote.picks,
    };
};

export const cinemaServices = {
    createCinema,
    getAllCinemas,
    getCinemaById,
    getBookingQuote,
};
