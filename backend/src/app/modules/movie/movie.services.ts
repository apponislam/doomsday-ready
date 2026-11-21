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
const validateNoCircularDependency = async (movieId: string, candidatePrereqIds: string[]) => {
    // 1. Direct self-dependency
    for (const pid of candidatePrereqIds) {
        if (pid === movieId) {
            throw new ApiError(httpStatus.CONFLICT, "409 CIRCULAR_DEPENDENCY: A movie cannot depend on itself directly.");
        }
    }

    // 2. Transitive / indirect circular dependency
    const allMovies = await MovieModel.find({});
    const graph = new Map<string, string[]>();

    for (const m of allMovies) {
        const idStr = m._id.toString();
        const prereqs = (m.prerequisites || []).map((p: any) => p.toString());
        graph.set(idStr, prereqs);
    }

    for (const candidateId of candidatePrereqIds) {
        // If candidateId can already reach movieId, then making movieId depend on candidateId forms a cycle!
        if (canReach(candidateId, movieId, graph, new Set())) {
            throw new ApiError(httpStatus.CONFLICT, "409 CIRCULAR_DEPENDENCY: Circular dependency detected in movie prerequisites.");
        }
    }
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

    // Convert any numeric or string prerequisite references to string IDs
    const normalizedPrereqs: any[] = [];
    if (payload.prerequisites && payload.prerequisites.length > 0) {
        for (const p of payload.prerequisites) {
            const prereqMovie = await findMovieById(p as any);
            if (!prereqMovie) {
                throw new ApiError(httpStatus.BAD_REQUEST, `Prerequisite movie "${p}" not found.`);
            }
            normalizedPrereqs.push(prereqMovie._id);
        }
    }
    payload.prerequisites = normalizedPrereqs;

    const result = await MovieModel.create(payload);
    return result;
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
    return data;
};

const getMovieById = async (id: string) => {
    const movie = await findMovieById(id);
    if (!movie) {
        throw new ApiError(httpStatus.NOT_FOUND, "Movie not found.");
    }
    return movie;
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
            normalizedPrereqs.push(prereqMovie._id);
        }

        const candidateIdStrs = normalizedPrereqs.map((p) => p.toString());
        await validateNoCircularDependency(movieObjectIdStr, candidateIdStrs);
        payload.prerequisites = normalizedPrereqs;
    }

    const result = await MovieModel.findByIdAndUpdate(movie._id, payload, {
        new: true,
        runValidators: true,
    });

    return result;
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
    const targetIdStr = targetMovie._id.toString();

    const visit = (currentIdStr: string) => {
        const currentMovie = byId.get(currentIdStr);
        if (!currentMovie) return;

        const prereqs = (currentMovie.prerequisites || []).map((p: any) => p.toString());
        for (const prereqId of prereqs) {
            visit(prereqId);
        }

        const primaryIdStr = (currentMovie as any)._id.toString();
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
