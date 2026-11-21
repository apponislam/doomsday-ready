import { Types } from "mongoose";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { IMovie } from "./movie.interface";
import { MovieModel } from "./movie.model";

/**
 * Validates that adding candidatePrereqs to movieId does not form a circular dependency.
 * Uses BFS upstream graph traversal to avoid loading the entire database into memory.
 */
const validateNoCircularDependency = async (movieId: string, candidatePrereqIds: (string | number)[]) => {
    // 1. Direct self-dependency
    for (const pid of candidatePrereqIds) {
        if (String(pid) === String(movieId)) {
            throw new ApiError(httpStatus.CONFLICT, "409 CIRCULAR_DEPENDENCY: A movie cannot depend on itself directly.");
        }
    }

    // 2. Transitive / indirect circular dependency check using targeted BFS
    const visited = new Set<string>();
    let queue: any[] = [...candidatePrereqIds];

    while (queue.length > 0) {
        const currentBatch = queue.splice(0, 50);
        const toLookup: any[] = [];

        for (const item of currentBatch) {
            const str = String(item);
            if (str === String(movieId)) {
                throw new ApiError(httpStatus.CONFLICT, "409 CIRCULAR_DEPENDENCY: Circular dependency detected in movie prerequisites.");
            }
            if (!visited.has(str)) {
                visited.add(str);
                toLookup.push(item);
            }
        }

        if (toLookup.length === 0) continue;

        const objectIds = toLookup.filter((id) => Types.ObjectId.isValid(String(id)));
        const numIds = toLookup.map((id) => Number(id)).filter((n) => !isNaN(n));

        const conditions: any[] = [];
        if (objectIds.length) conditions.push({ _id: { $in: objectIds } });
        if (numIds.length) conditions.push({ id: { $in: numIds } });

        if (conditions.length > 0) {
            const foundMovies = await MovieModel.find({ $or: conditions }, { _id: 1, id: 1, prerequisites: 1 });
            for (const m of foundMovies) {
                if (m._id.toString() === String(movieId) || (m.id !== undefined && String(m.id) === String(movieId))) {
                    throw new ApiError(httpStatus.CONFLICT, "409 CIRCULAR_DEPENDENCY: Circular dependency detected in movie prerequisites.");
                }
                if (Array.isArray(m.prerequisites)) {
                    for (const p of m.prerequisites) {
                        const pStr = String(p);
                        if (!visited.has(pStr)) {
                            queue.push(p);
                        }
                    }
                }
            }
        }
    }
};

/**
 * Normalizes prerequisites to clean numeric movie IDs and populates prerequisiteDetails
 * with title, year, and runtime so clients don't need to resolve references manually.
 */
const formatMoviePrerequisites = async (movies: any[]) => {
    const objectIdPrereqs = new Set<string>();
    const numPrereqs = new Set<number>();

    for (const m of movies) {
        if (Array.isArray(m.prerequisites)) {
            for (const p of m.prerequisites) {
                const str = String(p);
                if (Types.ObjectId.isValid(str)) {
                    objectIdPrereqs.add(str);
                }
                const n = Number(p);
                if (!isNaN(n)) {
                    numPrereqs.add(n);
                }
            }
        }
    }

    const conditions: any[] = [];
    if (objectIdPrereqs.size > 0) {
        conditions.push({ _id: { $in: Array.from(objectIdPrereqs) } });
    }
    if (numPrereqs.size > 0) {
        conditions.push({ id: { $in: Array.from(numPrereqs) } });
    }

    const movieMap = new Map<string, { id: number; title: string; year: number; runtime?: number }>();
    if (conditions.length > 0) {
        const matching = await MovieModel.find(
            { $or: conditions },
            { id: 1, _id: 1, title: 1, year: 1, runtime: 1 }
        );
        for (const f of matching) {
            const item = {
                id: f.id ?? 0,
                title: f.title,
                year: f.year,
                runtime: f.runtime,
            };
            if (f._id) movieMap.set(f._id.toString(), item);
            if (f.id !== undefined) movieMap.set(String(f.id), item);
        }
    }

    return movies.map((m) => {
        const obj = typeof m.toObject === "function" ? m.toObject() : { ...m };
        const rawPrereqs = Array.isArray(obj.prerequisites) ? obj.prerequisites : [];

        const normalizedIds: number[] = [];
        const details: { id: number; title: string; year: number; runtime?: number }[] = [];

        for (const p of rawPrereqs) {
            const str = String(p);
            const matched = movieMap.get(str);
            if (matched) {
                normalizedIds.push(matched.id);
                if (!details.some((d) => d.id === matched.id)) {
                    details.push(matched);
                }
            } else {
                const num = Number(p);
                const finalId = !isNaN(num) ? num : p;
                normalizedIds.push(finalId);
                details.push({
                    id: finalId,
                    title: `Film ${finalId}`,
                    year: 0,
                });
            }
        }

        obj.prerequisites = normalizedIds;
        obj.prerequisiteDetails = details;
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
        filter.title = { $regex: String(query.searchTerm).trim(), $options: "i" };
    }
    if (query.watched !== undefined && query.watched !== "") {
        filter.watched = query.watched === "true" || query.watched === true;
    }

    const isAll = query.all === "true" || query.all === true || query.limit === "0";

    // Fast count using index
    const total = await MovieModel.countDocuments(filter);

    // MongoDB aggregation calculates stats across full collection without loading into memory
    const [statsAgg] = await MovieModel.aggregate([
        {
            $group: {
                _id: null,
                totalMovies: { $sum: 1 },
                watchedCount: {
                    $sum: { $cond: [{ $eq: ["$watched", true] }, 1, 0] },
                },
                totalRuntimeMinutes: { $sum: { $ifNull: ["$runtime", 0] } },
            },
        },
    ]);

    const totalMovies = statsAgg?.totalMovies ?? total;
    const watchedCount = statsAgg?.watchedCount ?? 0;
    const totalRuntimeMinutes = statsAgg?.totalRuntimeMinutes ?? 0;
    const totalRuntimeHours = Math.floor(totalRuntimeMinutes / 60);
    const remainingMinutes = totalRuntimeMinutes % 60;

    let data: any[];
    let page = 1;
    let limit = isAll ? Math.min(total, 50000) : 10;

    if (isAll) {
        data = await MovieModel.find(filter).sort({ year: 1, id: 1 }).limit(limit);
    } else {
        page = Math.max(1, parseInt(String(query.page || 1), 10));
        limit = Math.min(100, Math.max(1, parseInt(String(query.limit || 10), 10)));
        const skip = (page - 1) * limit;
        data = await MovieModel.find(filter).sort({ year: 1, id: 1 }).skip(skip).limit(limit);
    }

    const formattedData = await formatMoviePrerequisites(data);

    return {
        data: formattedData,
        meta: {
            page: isAll ? 1 : page,
            limit: isAll ? total : limit,
            total,
            totalPage: isAll ? 1 : Math.ceil(total / limit) || 1,
        },
        stats: {
            totalMovies,
            watchedCount,
            totalRuntimeMinutes,
            totalRuntimeHours,
            formattedRuntime: `${totalRuntimeHours}H ${remainingMinutes}M`,
        },
    };
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

    // BFS to fetch ONLY the prerequisite tree of targetMovie, not the whole collection
    const targetIdStr = targetMovie._id.toString();
    const targetNumId = targetMovie.id;

    const byId = new Map<string, IMovie>();
    byId.set(targetIdStr, targetMovie);
    if (targetNumId !== undefined) byId.set(String(targetNumId), targetMovie);

    let queue: any[] = [...(targetMovie.prerequisites || [])];
    const visitedQueue = new Set<string>();

    while (queue.length > 0) {
        const batch = queue.splice(0, 50);
        const toLookup: any[] = [];

        for (const item of batch) {
            const str = String(item);
            if (!visitedQueue.has(str)) {
                visitedQueue.add(str);
                toLookup.push(item);
            }
        }

        if (toLookup.length === 0) continue;

        const objectIds = toLookup.filter((i) => Types.ObjectId.isValid(String(i)));
        const numIds = toLookup.map((i) => Number(i)).filter((n) => !isNaN(n));

        const conditions: any[] = [];
        if (objectIds.length) conditions.push({ _id: { $in: objectIds } });
        if (numIds.length) conditions.push({ id: { $in: numIds } });

        if (conditions.length > 0) {
            const foundMovies = await MovieModel.find({ $or: conditions });
            for (const m of foundMovies) {
                const sId = m._id.toString();
                byId.set(sId, m);
                if (m.id !== undefined) byId.set(String(m.id), m);

                if (Array.isArray(m.prerequisites)) {
                    for (const p of m.prerequisites) {
                        const pStr = String(p);
                        if (!visitedQueue.has(pStr)) {
                            queue.push(p);
                        }
                    }
                }
            }
        }
    }

    const result: IMovie[] = [];
    const visited = new Set<string>();
    const inStack = new Set<string>();

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
