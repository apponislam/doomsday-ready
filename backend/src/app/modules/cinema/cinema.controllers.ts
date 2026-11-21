import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { cinemaServices } from "./cinema.services";

const createCinema = catchAsync(async (req: Request, res: Response) => {
    const result = await cinemaServices.createCinema(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Cinema created successfully.",
        data: result,
    });
});

const getAllCinemas = catchAsync(async (_req: Request, res: Response) => {
    const result = await cinemaServices.getAllCinemas();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Cinemas retrieved successfully.",
        data: result,
    });
});

const getCinemaById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await cinemaServices.getCinemaById(id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Cinema details retrieved successfully.",
        data: result,
    });
});

const getBookingQuote = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const groupSize = Number(req.query.groupSize);

    const result = await cinemaServices.getBookingQuote(id as string, groupSize);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: result.message,
        data: result,
    });
});

export const cinemaControllers = {
    createCinema,
    getAllCinemas,
    getCinemaById,
    getBookingQuote,
};
