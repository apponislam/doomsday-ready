import { Types } from "mongoose";

export interface IMovie {
    _id?: Types.ObjectId;
    id?: number;
    title: string;
    year: number;
    runtime: number;
    prerequisites: (Types.ObjectId | number)[];
    watched: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
