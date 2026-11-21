import express from "express";
import { movieRoutes } from "../modules/movie/movie.routes";
import { cinemaRoutes } from "../modules/cinema/cinema.routes";

const router = express.Router();

const moduleRoutes = [
    {
        path: "/movies",
        route: movieRoutes,
    },
    {
        path: "/cinemas",
        route: cinemaRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
