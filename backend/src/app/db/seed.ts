import { MovieModel } from "../modules/movie/movie.model";
import { CinemaModel } from "../modules/cinema/cinema.model";

const initialMovies = [
    { id: 1, title: "Iron Man", year: 2008, runtime: 126, prerequisites: [], watched: true },
    { id: 2, title: "Captain America: The First Avenger", year: 2011, runtime: 124, prerequisites: [], watched: true },
    { id: 3, title: "The Avengers", year: 2012, runtime: 143, prerequisites: [1, 2], watched: true },
    { id: 4, title: "Captain America: Civil War", year: 2016, runtime: 147, prerequisites: [3], watched: false },
    { id: 5, title: "Thor: Ragnarok", year: 2017, runtime: 130, prerequisites: [], watched: false },
    { id: 6, title: "Avengers: Infinity War", year: 2018, runtime: 149, prerequisites: [4, 5], watched: false },
    { id: 7, title: "Avengers: Endgame", year: 2019, runtime: 181, prerequisites: [6], watched: false },
    { id: 8, title: "Avengers: Doomsday", year: 2026, runtime: 165, prerequisites: [7], watched: false },
];

const initialCinemas = [
    { id: 1, name: "Nova Cinemas — Downtown", bundles: [2, 5] },
    { id: 2, name: "The Grand Screen", bundles: [1, 3, 4] },
    { id: 3, name: "Orbit IMAX", bundles: [6, 9, 20] },
    { id: 4, name: "Starlight Multiplex", bundles: [4, 6] },
];

export const seedInitialData = async () => {
    try {
        const movieCount = await MovieModel.countDocuments();
        if (movieCount === 0) {
            await MovieModel.insertMany(initialMovies);
            console.log("✅ Seeded initial movies into MongoDB.");
        }

        const cinemaCount = await CinemaModel.countDocuments();
        if (cinemaCount === 0) {
            await CinemaModel.insertMany(initialCinemas);
            console.log("✅ Seeded initial cinemas into MongoDB.");
        }
    } catch (error) {
        console.error("⚠️ Seeding failed:", error);
    }
};
