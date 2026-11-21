import { Movie } from "@/types";

/**
 * Calculates topological rewatch order for a target movie based on prerequisites.
 */
export function getRewatchOrder(targetId: number, movies: Movie[]): Movie[] {
    const result: Movie[] = [];
    const visited = new Set<string>();
    const inStack = new Set<string>();
    const byKey = new Map<string, Movie>();

    for (const movie of movies) {
        byKey.set(String(movie.id), movie);
        if ((movie as any)._id) {
            byKey.set(String((movie as any)._id), movie);
        }
    }

    const visit = (key: string) => {
        const movie = byKey.get(key);
        if (!movie) return;

        const primaryKey = String(movie.id);
        if (visited.has(primaryKey)) return;
        if (inStack.has(primaryKey)) return;

        inStack.add(primaryKey);
        (movie.prerequisites || []).forEach((prereq) => {
            visit(String(prereq));
        });
        inStack.delete(primaryKey);

        if (movie.id !== targetId && !visited.has(primaryKey)) {
            visited.add(primaryKey);
            result.push(movie);
        }
    };

    visit(String(targetId));
    return result;
}
