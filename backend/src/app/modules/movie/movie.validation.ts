import { z } from "zod";

const createMovieZodSchema = z.object({
    id: z.number().int().optional(),
    title: z
        .string({
            message: "Title is required.",
        })
        .min(1, "Title must not be empty.")
        .trim(),
    year: z
        .number({
            message: "Release year is required.",
        })
        .int("Year must be an integer.")
        .min(1900, "Release year must be at least 1900.")
        .max(2100, "Release year cannot exceed 2100."),
    runtime: z
        .number({
            message: "Runtime in minutes is required.",
        })
        .int("Runtime must be an integer.")
        .min(1, "Runtime must be at least 1 minute.")
        .max(300, "Runtime cannot exceed 300 minutes."),
    prerequisites: z
        .array(z.union([z.string(), z.number()]))
        .optional()
        .default([]),
    watched: z.boolean().optional().default(false),
});

const updateMovieZodSchema = z.object({
    id: z.number().int().optional(),
    title: z.string().min(1, "Title must not be empty.").trim().optional(),
    year: z.number().int().min(1900).max(2100).optional(),
    runtime: z.number().int().min(1).max(300).optional(),
    prerequisites: z.array(z.union([z.string(), z.number()])).optional(),
    watched: z.boolean().optional(),
});

export const movieValidations = {
    createMovieZodSchema,
    updateMovieZodSchema,
};
