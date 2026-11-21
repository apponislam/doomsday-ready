import { z } from "zod";

const bundleItemSchema = z
    .number({
        message: "Bundle size must be a number.",
    })
    .int("Bundle size must be an integer.")
    .min(1, "Bundle size must be at least 1 seat.")
    .max(500, "Bundle size cannot exceed 500 seats.");

const createCinemaZodSchema = z
    .object({
        id: z.number().int().optional(),
        name: z
            .string({
                message: "Cinema name is required.",
            })
            .min(1, "Cinema name must not be empty.")
            .trim(),
        bundles: z.array(bundleItemSchema).min(1, "A cinema must have at least 1 bundle size.").max(10, "A cinema can have at most 10 different bundle sizes.").optional(),
        bundleSizes: z.array(bundleItemSchema).min(1, "A cinema must have at least 1 bundle size.").max(10, "A cinema can have at most 10 different bundle sizes.").optional(),
    })
    .refine((data) => (data.bundles && data.bundles.length > 0) || (data.bundleSizes && data.bundleSizes.length > 0), {
        message: "A cinema must have between 1 and 10 bundle sizes (pass 'bundles' or 'bundleSizes').",
        path: ["bundles"],
    });

const updateCinemaZodSchema = z.object({
    name: z.string().min(1, "Cinema name must not be empty.").trim().optional(),
    bundles: z.array(bundleItemSchema).min(1).max(10).optional(),
    bundleSizes: z.array(bundleItemSchema).min(1).max(10).optional(),
});

export const cinemaValidations = {
    createCinemaZodSchema,
    updateCinemaZodSchema,
};
