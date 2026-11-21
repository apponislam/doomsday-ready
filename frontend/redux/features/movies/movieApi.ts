import { baseApi } from "../../api/baseApi";
import { Movie } from "@/types";

export interface ApiResponse<T> {
    statusCode?: number;
    success: boolean;
    message?: string;
    data: T;
    meta?: Record<string, any>;
    stats?: Record<string, any>;
}

export interface GetMoviesParams {
    searchTerm?: string;
    watched?: boolean;
}

export interface RewatchOrderData {
    targetMovie: Movie;
    order: Movie[];
    watchedCount: number;
    totalPrerequisites: number;
    unwatchedRuntime: number;
}

export interface CreateMoviePayload {
    id?: number;
    title: string;
    year: number;
    runtime: number;
    prerequisites: number[];
    watched?: boolean;
}

export interface UpdateMoviePayload {
    id: number | string;
    data: Partial<CreateMoviePayload>;
}

export const movieApi = baseApi
    .enhanceEndpoints({ addTagTypes: ["Movie"] })
    .injectEndpoints({
        overrideExisting: true,
        endpoints: (builder) => ({
            // GET /movies - List all movies
            getMovies: builder.query<ApiResponse<Movie[]>, GetMoviesParams | void>({
                query: (params) => {
                    const queryParams = new URLSearchParams();
                    if (params?.searchTerm) queryParams.append("searchTerm", params.searchTerm);
                    if (params?.watched !== undefined) queryParams.append("watched", String(params.watched));

                    const queryString = queryParams.toString();
                    return {
                        url: queryString ? `/movies?${queryString}` : "/movies",
                        method: "GET",
                    };
                },
                providesTags: (result) =>
                    result?.data
                        ? [
                              ...result.data.map(({ id }) => ({ type: "Movie" as const, id })),
                              { type: "Movie", id: "LIST" },
                          ]
                        : [{ type: "Movie", id: "LIST" }],
            }),

            // GET /movies/:id - Single movie by ID
            getMovieById: builder.query<ApiResponse<Movie>, number | string>({
                query: (id) => ({
                    url: `/movies/${id}`,
                    method: "GET",
                }),
                providesTags: (_result, _error, id) => [{ type: "Movie", id }],
            }),

            // GET /movies/:id/rewatch-order - Rewatch order for target movie
            getRewatchOrder: builder.query<ApiResponse<RewatchOrderData>, number | string>({
                query: (id) => ({
                    url: `/movies/${id}/rewatch-order`,
                    method: "GET",
                }),
                providesTags: (_result, _error, id) => [{ type: "Movie", id: `ORDER_${id}` }],
            }),

            // POST /movies - Create movie
            createMovie: builder.mutation<ApiResponse<Movie>, CreateMoviePayload>({
                query: (body) => ({
                    url: "/movies",
                    method: "POST",
                    body,
                }),
                invalidatesTags: [{ type: "Movie", id: "LIST" }],
            }),

            // PATCH /movies/:id - Update movie
            updateMovie: builder.mutation<ApiResponse<Movie>, UpdateMoviePayload>({
                query: ({ id, data }) => ({
                    url: `/movies/${id}`,
                    method: "PATCH",
                    body: data,
                }),
                invalidatesTags: (_result, _error, { id }) => [
                    { type: "Movie", id },
                    { type: "Movie", id: "LIST" },
                    { type: "Movie", id: `ORDER_${id}` },
                ],
            }),
        }),
    });

export const {
    useGetMoviesQuery,
    useGetMovieByIdQuery,
    useGetRewatchOrderQuery,
    useCreateMovieMutation,
    useUpdateMovieMutation,
} = movieApi;

