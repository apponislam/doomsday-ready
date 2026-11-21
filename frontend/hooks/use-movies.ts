import {
    useGetMoviesQuery,
    useCreateMovieMutation,
    useUpdateMovieMutation,
} from "@/redux/features/movies/movieApi";
import { Movie } from "@/types";

export function useMovies() {
    const { data: response, isLoading, isFetching, isError, error, refetch } = useGetMoviesQuery();
    const [updateMovieMutation, { isLoading: isUpdating }] = useUpdateMovieMutation();
    const [createMovieMutation, { isLoading: isCreating }] = useCreateMovieMutation();

    const movies: Movie[] = response?.data ?? [];

    const toggleWatched = async (id: number) => {
        const target = movies.find((m) => m.id === id);
        if (!target) return;
        try {
            await updateMovieMutation({
                id,
                data: { watched: !target.watched },
            }).unwrap();
        } catch (err) {
            console.error("Failed to update movie watch state:", err);
            throw err;
        }
    };

    const saveMovie = async (movieData: Omit<Movie, "watched">) => {
        const exists = movies.some((m) => m.id === movieData.id);
        try {
            if (exists) {
                await updateMovieMutation({
                    id: movieData.id,
                    data: movieData,
                }).unwrap();
            } else {
                await createMovieMutation({
                    ...movieData,
                    watched: false,
                }).unwrap();
            }
        } catch (err) {
            console.error("Failed to save movie:", err);
            throw err;
        }
    };

    return {
        movies,
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
        toggleWatched,
        saveMovie,
        isMutating: isUpdating || isCreating,
    };
}
