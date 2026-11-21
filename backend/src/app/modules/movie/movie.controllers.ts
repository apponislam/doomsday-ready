import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { movieServices } from "./movie.services";

const createMovie = catchAsync(async (req: Request, res: Response) => {
    const result = await movieServices.createMovie(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Movie created successfully.",
        data: result,
    });
});

const getAllMovies = catchAsync(async (req: Request, res: Response) => {
    const result = await movieServices.getAllMovies(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Movies retrieved successfully.",
        data: result,
    });
});

const getMovieById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await movieServices.getMovieById(id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Movie retrieved successfully.",
        data: result,
    });
});

const updateMovie = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await movieServices.updateMovie(id as string, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Movie updated successfully.",
        data: result,
    });
});

const getRewatchOrder = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await movieServices.getRewatchOrder(id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Rewatch order retrieved successfully.",
        data: result,
    });
});

export const movieControllers = {
    createMovie,
    getAllMovies,
    getMovieById,
    updateMovie,
    getRewatchOrder,
};
