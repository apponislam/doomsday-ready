import mongoose, { Schema } from "mongoose";
import { IMovie } from "./movie.interface";

const MovieSchema = new Schema<IMovie>(
    {
        id: {
            type: Number,
            required: false,
        },
        title: {
            type: String,
            required: [true, "Title is required."],
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
        autoIndex: true,
    },
);

MovieSchema.index({ id: 1 }, { unique: true, sparse: true, name: "idx_movie_id_unique" });
MovieSchema.index(
    { title: 1 },
    {
        unique: true,
        collation: { locale: "en", strength: 2 },
        name: "idx_movie_title_unique_ci",
    },
);
MovieSchema.index(
    { title: "text" },
    {
        weights: { title: 10 },
        name: "idx_movie_title_text",
    },
);
MovieSchema.index({ watched: 1, year: 1, id: 1 }, { name: "idx_movie_watched_year_id" });
MovieSchema.index({ year: 1, id: 1 }, { name: "idx_movie_chronological_year_id" });
MovieSchema.index({ prerequisites: 1 }, { name: "idx_movie_prerequisites_multikey" });
MovieSchema.index({ watched: 1, runtime: 1 }, { name: "idx_movie_watched_runtime" });

export const MovieModel = mongoose.model<IMovie>("Movie", MovieSchema);
