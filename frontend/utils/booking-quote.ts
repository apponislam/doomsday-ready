import { BookingQuote } from "@/types";

/**
 * DP coin-change algorithm to calculate the minimal number of exact seat bundles.
 */
export function bookingQuote(sizes: number[], groupSize: number): BookingQuote | null {
    const dp: (BookingQuote | null)[] = Array(groupSize + 1).fill(null);
    dp[0] = { count: 0, picks: [] };

    for (let total = 1; total <= groupSize; total++) {
        for (const size of sizes) {
            const previous = total >= size ? dp[total - size] : null;
            if (previous && (!dp[total] || previous.count + 1 < dp[total]!.count)) {
                dp[total] = { count: previous.count + 1, picks: [...previous.picks, size] };
            }
        }
    }

    return dp[groupSize];
}
