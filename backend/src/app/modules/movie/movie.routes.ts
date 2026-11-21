import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { movieControllers } from "./movie.controllers";
import { movieValidations } from "./movie.validation";

const router = Router();

// List movies
router.get("/", movieControllers.getAllMovies);

// Create movie
router.post("/", validateRequest(movieValidations.createMovieZodSchema), movieControllers.createMovie);

// Rewatch order for target movie
router.get("/:id/rewatch-order", movieControllers.getRewatchOrder);

// Get single movie by ID
router.get("/:id", movieControllers.getMovieById);

// Update movie, including watched and prerequisites
router.patch("/:id", validateRequest(movieValidations.updateMovieZodSchema), movieControllers.updateMovie);

export const movieRoutes = router;
