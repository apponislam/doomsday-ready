import { Movie } from "@/types";

/**
 * Calculates topological rewatch order for a target movie based on prerequisites.
 */
export function getRewatchOrder(targetId: number, movies: Movie[]): Movie[] {
    const result: Movie[] = [];
    const visited = new Set<number>();
    const byId = new Map(movies.map((movie) => [movie.id, movie]));

    const visit = (id: number) => {
        const movie = byId.get(id);
        if (!movie) return;
        movie.prerequisites.forEach(visit);
        if (id !== targetId && !visited.has(id)) {
            visited.add(id);
            result.push(movie);
        }
    };

    visit(targetId);
    return result;
}
