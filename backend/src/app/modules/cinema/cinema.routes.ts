import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { cinemaControllers } from "./cinema.controllers";
import { cinemaValidations } from "./cinema.validation";

const router = Router();

// List cinemas
router.get("/", cinemaControllers.getAllCinemas);

// Create cinema
router.post("/", validateRequest(cinemaValidations.createCinemaZodSchema), cinemaControllers.createCinema);

// Booking quote for cinema
router.get("/:id/booking", cinemaControllers.getBookingQuote);

// Get cinema details
router.get("/:id", cinemaControllers.getCinemaById);

export const cinemaRoutes = router;
