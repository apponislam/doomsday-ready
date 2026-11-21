import mongoose, { Schema } from "mongoose";
import { ICinema } from "./cinema.interface";

const CinemaSchema = new Schema<ICinema>(
    {
        id: {
            type: Number,
            required: false,
        },
        name: {
            type: String,
            required: [true, "Cinema name is required."],
            trim: true,
        },
        bundles: {
            type: [Number],
            required: [true, "Bundle sizes are required."],
            validate: {
                validator: (val: number[]) => val.length >= 1 && val.length <= 10,
                message: "A cinema must have between 1 and 10 different bundle sizes.",
            },
        },
    },
    {
        timestamps: true,
        versionKey: false,
        autoIndex: true,
    },
);

CinemaSchema.index({ id: 1 }, { unique: true, sparse: true, name: "idx_cinema_id_unique" });
CinemaSchema.index(
    { name: 1 },
    {
        unique: true,
        collation: { locale: "en", strength: 2 },
        name: "idx_cinema_name_unique_ci",
    },
);
CinemaSchema.index({ bundles: 1 }, { name: "idx_cinema_bundles_multikey" });
CinemaSchema.index({ id: 1, createdAt: 1 }, { name: "idx_cinema_listing_id_created" });
CinemaSchema.index({ createdAt: -1 }, { name: "idx_cinema_created_at" });

export const CinemaModel = mongoose.model<ICinema>("Cinema", CinemaSchema);
