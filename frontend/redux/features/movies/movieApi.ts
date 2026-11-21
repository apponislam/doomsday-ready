import { baseApi } from "../../api/baseApi";
import { Movie } from "@/types";

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
}

export interface MovieStats {
    totalMovies: number;
    watchedCount: number;
    totalRuntimeMinutes: number;
    totalRuntimeHours: number;
    formattedRuntime: string;
}

export interface ApiResponse<T> {
    statusCode?: number;
    success: boolean;
    message?: string;
    data: T;
    meta?: PaginationMeta;
    stats?: MovieStats;
}

export interface GetMoviesParams {
    page?: number;
    limit?: number;
    searchTerm?: string;
    watched?: boolean;
    all?: boolean;
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
    prerequisites: (number | string)[];
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
            // GET /movies - List movies with pagination & search
            getMovies: builder.query<ApiResponse<Movie[]>, GetMoviesParams | void>({
                query: (params) => {
                    const queryParams = new URLSearchParams();
                    if (params?.page) queryParams.append("page", String(params.page));
                    if (params?.limit) queryParams.append("limit", String(params.limit));
                    if (params?.searchTerm) queryParams.append("searchTerm", params.searchTerm);
                    if (params?.watched !== undefined) queryParams.append("watched", String(params.watched));
                    if (params?.all) queryParams.append("all", "true");

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
                async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
                    const patchResult = dispatch(
                        movieApi.util.updateQueryData("getMovies", undefined, (draft) => {
                            if (draft?.data) {
                                const target = draft.data.find(
                                    (m) => m.id === id || String(m.id) === String(id) || String((m as any)._id) === String(id)
                                );
                                if (target) {
                                    Object.assign(target, data);
                                }
                            }
                        })
                    );
                    try {
                        await queryFulfilled;
                    } catch {
                        patchResult.undo();
                    }
                },
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

