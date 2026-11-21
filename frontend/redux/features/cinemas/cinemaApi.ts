import { baseApi } from "../../api/baseApi";
import { Cinema } from "@/types";
import { ApiResponse } from "../movies/movieApi";

export interface BookingQuoteData {
    possible: boolean;
    message: string;
    cinema: {
        id: number;
        name: string;
        bundles: number[];
    };
    groupSize: number;
    bundles: {
        count: number;
        picks: number[];
        breakdown: string;
    } | null;
}

export interface BookingQuoteParams {
    id: number | string;
    groupSize: number;
}

export interface CreateCinemaPayload {
    id?: number;
    name: string;
    bundles: number[];
}

export const cinemaApi = baseApi
    .enhanceEndpoints({ addTagTypes: ["Cinema"] })
    .injectEndpoints({
        overrideExisting: true,
        endpoints: (builder) => ({
            // GET /cinemas - List all cinemas
            getCinemas: builder.query<ApiResponse<Cinema[]>, void>({
                query: () => ({
                    url: "/cinemas",
                    method: "GET",
                }),
                providesTags: (result) =>
                    result?.data
                        ? [
                              ...result.data.map(({ id }) => ({ type: "Cinema" as const, id })),
                              { type: "Cinema", id: "LIST" },
                          ]
                        : [{ type: "Cinema", id: "LIST" }],
            }),

            // GET /cinemas/:id - Cinema details
            getCinemaById: builder.query<ApiResponse<Cinema>, number | string>({
                query: (id) => ({
                    url: `/cinemas/${id}`,
                    method: "GET",
                }),
                providesTags: (_result, _error, id) => [{ type: "Cinema", id }],
            }),

            // GET /cinemas/:id/booking?groupSize=X - Booking quote
            getBookingQuote: builder.query<ApiResponse<BookingQuoteData>, BookingQuoteParams>({
                query: ({ id, groupSize }) => ({
                    url: `/cinemas/${id}/booking?groupSize=${groupSize}`,
                    method: "GET",
                }),
            }),

            // POST /cinemas - Create cinema
            createCinema: builder.mutation<ApiResponse<Cinema>, CreateCinemaPayload>({
                query: (body) => ({
                    url: "/cinemas",
                    method: "POST",
                    body,
                }),
                invalidatesTags: [{ type: "Cinema", id: "LIST" }],
            }),
        }),
    });

export const {
    useGetCinemasQuery,
    useGetCinemaByIdQuery,
    useGetBookingQuoteQuery,
    useCreateCinemaMutation,
} = cinemaApi;

