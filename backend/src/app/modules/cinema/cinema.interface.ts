import { Types } from "mongoose";

export interface ICinema {
    _id?: Types.ObjectId;
    id?: number;
    name: string;
    bundles: number[];
    bundleSizes?: number[];
    createdAt?: Date;
    updatedAt?: Date;
}
