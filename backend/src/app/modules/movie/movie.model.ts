import mongoose, { Schema } from "mongoose";
import { IMovie } from "./movie.interface";

const MovieSchema = new Schema<IMovie>(
    {
        id: {
            type: Number,
            index: true,
        },
        title: {
            type: String,
            required: [true, "Title is required."],
            unique: true,
            trim: true,
        },
        year: {
            type: Number,
            required: [true, "Release year is required."],
            min: [1900, "Release year must be 1900 or later."],
            max: [2100, "Release year cannot exceed 2100."],
        },
        runtime: {
            type: Number,
            required: [true, "Runtime in minutes is required."],
            min: [1, "Runtime must be at least 1 minute."],
            max: [300, "Runtime cannot exceed 300 minutes."],
        },
        prerequisites: {
            type: [Schema.Types.Mixed],
            default: [],
        },
        watched: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

// High-Performance Query Indexes
MovieSchema.index({ title: 1 }, { unique: true });
MovieSchema.index({ watched: 1, year: 1 });

export const MovieModel = mongoose.model<IMovie>("Movie", MovieSchema);
