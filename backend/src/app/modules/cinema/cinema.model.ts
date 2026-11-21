import mongoose, { Schema } from "mongoose";
import { ICinema } from "./cinema.interface";

const CinemaSchema = new Schema<ICinema>(
    {
        id: {
            type: Number,
            index: true,
        },
        name: {
            type: String,
            required: [true, "Cinema name is required."],
            unique: true,
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
    },
);

CinemaSchema.index({ name: 1 }, { unique: true });

export const CinemaModel = mongoose.model<ICinema>("Cinema", CinemaSchema);
