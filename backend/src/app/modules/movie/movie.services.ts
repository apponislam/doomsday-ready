import { Types } from "mongoose";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { IMovie } from "./movie.interface";
import { MovieModel } from "./movie.model";

/**
 * Checks if targetId can be reached from startId through prerequisite links.
 */
const canReach = (startId: string, targetId: string, graph: Map<string, string[]>, visited: Set<string> = new Set()): boolean => {
    if (startId === targetId) return true;
    if (visited.has(startId)) return false;
    visited.add(startId);

    const neighbors = graph.get(startId) || [];
    for (const neighbor of neighbors) {
        if (canReach(neighbor, targetId, graph, visited)) {
            return true;
        }
    }
    return false;
};

/**
 * Validates that adding candidatePrereqs to movieId does not form a circular dependency.
 */
const validateNoCircularDependency = async (movieId: string, candidatePrereqIds: (string | number)[]) => {
    // 1. Direct self-dependency
    for (const pid of candidatePrereqIds) {
        if (String(pid) === String(movieId)) {
            throw new ApiError(httpStatus.CONFLICT, "409 CIRCULAR_DEPENDENCY: A movie cannot depend on itself directly.");
        }
    }

    // 2. Transitive / indirect circular dependency
    const allMovies = await MovieModel.find({});
    const graph = new Map<string, string[]>();

    for (const m of allMovies) {
        const idStr = m._id.toString();
        const numIdStr = m.id !== undefined ? String(m.id) : null;
        const prereqs = (m.prerequisites || []).map((p: any) => String(p));
        graph.set(idStr, prereqs);
        if (numIdStr) graph.set(numIdStr, prereqs);
    }

    for (const candidateId of candidatePrereqIds) {
        const cStr = String(candidateId);
        // If candidateId can already reach movieId, then making movieId depend on candidateId forms a cycle!
        if (canReach(cStr, movieId, graph, new Set())) {
            throw new ApiError(httpStatus.CONFLICT, "409 CIRCULAR_DEPENDENCY: Circular dependency detected in movie prerequisites.");
        }
    }
};

/**
 * Normalizes any legacy ObjectId prerequisites to clean numeric movie IDs.
 */
const formatMoviePrerequisites = async (movies: any[]) => {
    const all = await MovieModel.find({}, { id: 1, _id: 1 });
    const idMap = new Map<string, number>();
    for (const m of all) {
        if (m.id !== undefined && m._id) {
            idMap.set(m._id.toString(), m.id);
        }
    }
    return movies.map((m) => {
        const obj = typeof m.toObject === "function" ? m.toObject() : { ...m };
        if (Array.isArray(obj.prerequisites)) {
            obj.prerequisites = obj.prerequisites.map((p: any) => {
                const str = String(p);
                return idMap.has(str) ? idMap.get(str)! : p;
            });
        }
        return obj;
    });
};

/**
 * Finds a movie by Mongo _id OR numeric id.
 */
const findMovieById = async (id: string | number) => {
    if (Types.ObjectId.isValid(String(id))) {
        const byObjectId = await MovieModel.findById(id);
        if (byObjectId) return byObjectId;
    }

    const num = Number(id);
    if (!isNaN(num)) {
        const byNum = await MovieModel.findOne({ id: num });
        if (byNum) return byNum;
    }

    return null;
};

const createMovie = async (payload: IMovie) => {
    const existing = await MovieModel.findOne({ title: payload.title.trim() });
    if (existing) {
        throw new ApiError(httpStatus.CONFLICT, `A movie titled "${payload.title}" already exists.`);
    }

    if (!payload.id) {
        const lastMovie = await MovieModel.findOne().sort({ id: -1 });
        payload.id = (lastMovie?.id ?? 0) + 1;
    }

    // Convert any numeric or string prerequisite references to numeric sequence IDs
    const normalizedPrereqs: any[] = [];
    if (payload.prerequisites && payload.prerequisites.length > 0) {
        for (const p of payload.prerequisites) {
            const prereqMovie = await findMovieById(p as any);
            if (!prereqMovie) {
                throw new ApiError(httpStatus.BAD_REQUEST, `Prerequisite movie "${p}" not found.`);
            }

            // Direct self-dependency check on creation
            if (
                prereqMovie.title.trim().toLowerCase() === payload.title.trim().toLowerCase() ||
                (payload.id && prereqMovie.id === payload.id)
            ) {
                throw new ApiError(httpStatus.CONFLICT, "409 CIRCULAR_DEPENDENCY: A movie cannot depend on itself directly.");
            }

            normalizedPrereqs.push(prereqMovie.id !== undefined ? prereqMovie.id : prereqMovie._id);
        }
    }
    payload.prerequisites = normalizedPrereqs;

    const result = await MovieModel.create(payload);
    const [formatted] = await formatMoviePrerequisites([result]);
    return formatted;
};

const getAllMovies = async (query: Record<string, unknown> = {}) => {
    const filter: Record<string, any> = {};

    if (query.searchTerm) {
        filter.title = { $regex: query.searchTerm, $options: "i" };
    }
    if (query.watched !== undefined) {
        filter.watched = query.watched === "true" || query.watched === true;
    }

    const data = await MovieModel.find(filter).sort({ year: 1, id: 1 });
    return formatMoviePrerequisites(data);
};

const getMovieById = async (id: string) => {
    const movie = await findMovieById(id);
    if (!movie) {
        throw new ApiError(httpStatus.NOT_FOUND, "Movie not found.");
    }
    const [formatted] = await formatMoviePrerequisites([movie]);
    return formatted;
};

const updateMovie = async (id: string, payload: Partial<IMovie>) => {
    const movie = await findMovieById(id);
    if (!movie) {
        throw new ApiError(httpStatus.NOT_FOUND, "Movie not found.");
    }

    const movieObjectIdStr = movie._id.toString();

    // Title unique check
    if (payload.title && payload.title.trim().toLowerCase() !== movie.title.toLowerCase()) {
        const existing = await MovieModel.findOne({ title: payload.title.trim() });
        if (existing) {
            throw new ApiError(httpStatus.CONFLICT, `A movie titled "${payload.title}" already exists.`);
        }
    }

    // Prerequisite circular dependency check
    if (payload.prerequisites !== undefined) {
        const normalizedPrereqs: any[] = [];
        for (const p of payload.prerequisites) {
            const prereqMovie = await findMovieById(p as any);
            if (!prereqMovie) {
                throw new ApiError(httpStatus.BAD_REQUEST, `Prerequisite movie "${p}" not found.`);
            }
            normalizedPrereqs.push(prereqMovie.id !== undefined ? prereqMovie.id : prereqMovie._id);
        }

        const candidateIdStrs = normalizedPrereqs.map((p) => p.toString());
        await validateNoCircularDependency(movieObjectIdStr, candidateIdStrs);
        if (movie.id !== undefined) {
            await validateNoCircularDependency(String(movie.id), candidateIdStrs);
        }
        payload.prerequisites = normalizedPrereqs;
    }

    const result = await MovieModel.findByIdAndUpdate(movie._id, payload, {
        new: true,
        runValidators: true,
    });

    const [formatted] = await formatMoviePrerequisites([result]);
    return formatted;
};

const getRewatchOrder = async (id: string) => {
    const targetMovie = await findMovieById(id);
    if (!targetMovie) {
        throw new ApiError(httpStatus.NOT_FOUND, "Target movie not found.");
    }

    const allMovies = await MovieModel.find({});
    const byId = new Map<string, IMovie>();
    for (const m of allMovies) {
        byId.set(m._id.toString(), m);
        if (m.id !== undefined) {
            byId.set(String(m.id), m);
        }
    }

    const result: IMovie[] = [];
    const visited = new Set<string>();
    const inStack = new Set<string>();
    const targetIdStr = targetMovie._id.toString();

    const visit = (currentIdStr: string) => {
        const currentMovie = byId.get(currentIdStr);
        if (!currentMovie) return;

        const primaryIdStr = (currentMovie as any)._id.toString();
        if (visited.has(primaryIdStr)) return;
        if (inStack.has(primaryIdStr)) {
            throw new ApiError(httpStatus.CONFLICT, "409 CIRCULAR_DEPENDENCY: Circular dependency detected in movie prerequisites.");
        }

        inStack.add(primaryIdStr);
        const prereqs = (currentMovie.prerequisites || []).map((p: any) => p.toString());
        for (const prereqId of prereqs) {
            visit(prereqId);
        }
        inStack.delete(primaryIdStr);

        if (primaryIdStr !== targetIdStr && !visited.has(primaryIdStr)) {
            visited.add(primaryIdStr);
            result.push(currentMovie);
        }
    };

    visit(targetIdStr);

    const watchedCount = result.filter((m) => m.watched).length;
    const unwatchedRuntime = result.filter((m) => !m.watched).reduce((sum, m) => sum + m.runtime, 0);

    return {
        targetMovie: {
            id: targetMovie.id,
            title: targetMovie.title,
            year: targetMovie.year,
            runtime: targetMovie.runtime,
            watched: targetMovie.watched,
        },
        order: result,
        watchedCount,
        totalPrerequisites: result.length,
        unwatchedRuntime,
    };
};

export const movieServices = {
    createMovie,
    getAllMovies,
    getMovieById,
    updateMovie,
    getRewatchOrder,
};
