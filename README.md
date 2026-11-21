# 🎬 Doomsday Ready — Full-Stack MCU Rewatch & Watch-Party Planner

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-5-lightgrey?style=flat-square&logo=express&logoColor=black)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8-green?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)

**Doomsday Ready** is a full-stack web application designed for MCU fans catching up before _Avengers: Doomsday_. It helps viewers determine the exact prerequisites and sequence to watch films in, tracks watched status, and solves cinema group bundle allocations for opening-night watch parties.

---

## 📑 Table of Contents

- [Core Features](#-core-features)
- [Data Model & Architecture (Bonus)](#-data-model--architecture-bonus)
- [Algorithmic Design](#-algorithmic-design)
- [AI Tool Usage Disclosure](#-ai-tool-usage-disclosure)
- [Design Decisions & Assumptions](#-design-decisions--assumptions)
- [API Reference](#-api-reference)
- [Frontend Views](#-frontend-views)
- [Quick Start with Docker Compose (Bonus)](#-quick-start-with-docker-compose-bonus)
- [Manual Local Development](#-manual-local-development)

---

## 🚀 Core Features

### 1. Movie Management & Rewatch Order

- Create and edit movies with unique titles, release years, runtimes (1–300 minutes), watched status, and prerequisite relations.
- **Strict Cycle Prevention**: Automatically prevents a movie from depending on itself directly or transitively, rejecting invalid states with `409 CIRCULAR_DEPENDENCY`.
- **Topological Rewatch Order**: Given a target movie, returns all required pre-movies in valid dependency order (excluding the target itself), alongside a watched count and total remaining unwatched runtime.

### 2. Cinema & Watch-Party Group Booking

- Configure cinema locations with 1 to 10 distinct bundle sizes (1 to 500 seats each).
- **Optimal Bundle Solver**: Computes the minimum number of bundles required to seat a group of 1–10,000 people with **zero empty seats**, or returns `"Not possible"` if no exact partition exists.

### 3. Responsive Web Interface

- **Movies Archive**: Add/edit movies, toggle watched status, and filter films.
- **Rewatch Plan**: Dynamic target selector, timeline visualizer, progress bar (`"X of Y WATCHED"`), and runtime estimator.
- **Booking Calculator**: Cinema selector, group size counter, and bundle breakdown visualizer.

---

## 📊 Data Model & Architecture (Bonus)

```mermaid
classDiagram
    direction LR

    class Movie {
        +ObjectId _id
        +Number id
        +String title (unique)
        +Number year (1900-2100)
        +Number runtime (1-300 min)
        +Array~ObjectId|Number~ prerequisites
        +Boolean watched
        +Date createdAt
        +Date updatedAt
    }

    class Cinema {
        +ObjectId _id
        +Number id
        +String name (unique)
        +Array~Number~ bundles (1-10 sizes, 1-500 seats)
        +Date createdAt
        +Date updatedAt
    }

    Movie "1" --> "0..*" Movie : prerequisites (Directed Acyclic Graph)
```

### Entity Schema Details

- **Movie Schema**:
    - `title`: String, required, trimmed, unique index.
    - `year`: Number, required, bounds: 1900–2100.
    - `runtime`: Number, required, bounds: 1–300 minutes.
    - `prerequisites`: Array of references to earlier `Movie` records.
    - `watched`: Boolean, default `false`.
- **Cinema Schema**:
    - `name`: String, required, trimmed, unique index.
    - `bundles`: Array of Numbers, required, length 1–10, item values 1–500.

---

## 🧠 Algorithmic Design

Per the assessment guidelines, all algorithmic solutions for Features 1 & 2 are implemented **from scratch without external solver libraries**:

### Feature 1: Cycle Detection & Topological Sort

1. **Circular Dependency Detection (`canReach`)**:
    - Modeled as a Directed Graph where an edge $U \to V$ denotes that movie $U$ requires prerequisite $V$.
    - When adding candidate prerequisites $C$ to movie $M$, we perform a depth-first search (DFS) to see if $M$ is reachable from any node in $C$. If reachable, adding the edge would form a directed cycle.
    - Any violation immediately throws an HTTP `409` conflict with code `CIRCULAR_DEPENDENCY`.

2. **Topological Order (`getRewatchOrder`)**:
    - Traverses the prerequisite subgraph using post-order DFS with recursion stack tracking (`inStack`) and memoized visited sets (`visited`).
    - Ensures prerequisite dependencies appear prior to the movies that require them.
    - Filters out the target movie itself and calculates watched metrics and remaining runtime in $O(V + E)$ time complexity.

### Feature 2: Fewest Seat Bundles (Dynamic Programming Coin-Change)

- Modeled as the **Unbounded Knapsack / Coin-Change Problem** where bundle sizes are coin denominations and group size is the target amount.
- An array `dp` of size `groupSize + 1` stores `{ count, picks }` for the minimal bundle count reaching exact sub-totals.
- Evaluates bundle sizes in descending order to prefer larger bundles on ties.
- Time Complexity: $O(\text{groupSize} \times N)$, where $N \le 10$. Operates in under 10ms for maximum group size (10,000).

---

## 🤖 AI Tool Usage Disclosure

In compliance with the assessment guidelines, AI assistance (Gemini / Antigravity) was utilized for:

- Initial project scaffolding and TypeScript configuration boilerplate.
- Dockerfile and Docker Compose environment variable parameterization.
- Verification and test boundary reviews against the requirements document.
- Formatting of API markdown documentation and Mermaid architecture diagrams.

_Note: All core algorithmic routines (graph cycle checking, topological post-order sort, and dynamic programming bundle calculations) were written directly according to custom logic without using third-party solvers or graph libraries._

---

## 💡 Design Decisions & Assumptions

1. **Dual ID Lookup (`ObjectId` & Numeric `id`)**:
    - The backend supports querying movies and cinemas by either MongoDB's native 24-character hexadecimal `_id` or integer `id` (e.g., `1`, `2`, `3`) to ensure seamless frontend and seed data compatibility.
2. **Flexible Payload Naming (`bundles` vs `bundleSizes`)**:
    - The specification refers to opening-night bundles as "Bundle sizes". The cinema validation and service accept either `bundles` or `bundleSizes` in JSON payloads.
3. **Empty List on Zero Prerequisites**:
    - Querying the rewatch order for a film with no prerequisites (e.g., _Thor: Ragnarok_) correctly returns an empty list `[]` with `watchedCount: 0` and `unwatchedRuntime: 0`.
4. **Target Film Omission**:
    - As specified in Section 2, the target movie itself is excluded from the rewatch sequence list.

---

## 📡 API Reference

Base URL: `http://localhost:5000/api`

### Movies API

| Method  | Endpoint                    | Description                                                 | Status Codes        |
| ------- | --------------------------- | ----------------------------------------------------------- | ------------------- |
| `POST`  | `/movies`                   | Create a new movie                                          | `201`, `400`, `409` |
| `GET`   | `/movies`                   | List all movies (optional `?searchTerm=` and `?watched=`)   | `200`               |
| `GET`   | `/movies/:id`               | Get movie details by ID                                     | `200`, `404`        |
| `PATCH` | `/movies/:id`               | Update movie (title, year, runtime, prerequisites, watched) | `200`, `400`, `409` |
| `GET`   | `/movies/:id/rewatch-order` | Calculate prerequisite sequence, watched count, and runtime | `200`, `404`        |

#### Example: Rewatch Order Response

`GET /api/movies/8/rewatch-order` (Avengers: Doomsday)

```json
{
    "success": true,
    "message": "Rewatch order retrieved successfully.",
    "data": {
        "targetMovie": {
            "id": 8,
            "title": "Avengers: Doomsday",
            "year": 2026,
            "runtime": 180,
            "watched": false
        },
        "order": [
            { "id": 1, "title": "Iron Man", "year": 2008, "runtime": 126, "watched": true },
            { "id": 2, "title": "Captain America: The First Avenger", "year": 2011, "runtime": 124, "watched": true },
            { "id": 3, "title": "The Avengers", "year": 2012, "runtime": 143, "watched": true },
            { "id": 4, "title": "Captain America: Civil War", "year": 2016, "runtime": 147, "watched": true },
            { "id": 5, "title": "Thor: Ragnarok", "year": 2017, "runtime": 130, "watched": false },
            { "id": 6, "title": "Avengers: Infinity War", "year": 2018, "runtime": 149, "watched": false },
            { "id": 7, "title": "Avengers: Endgame", "year": 2019, "runtime": 181, "watched": false }
        ],
        "watchedCount": 4,
        "totalPrerequisites": 7,
        "unwatchedRuntime": 460
    }
}
```

### Cinemas API

| Method | Endpoint                            | Description                                | Status Codes        |
| ------ | ----------------------------------- | ------------------------------------------ | ------------------- |
| `POST` | `/cinemas`                          | Create a cinema location with bundle sizes | `201`, `400`, `409` |
| `GET`  | `/cinemas`                          | List all cinemas                           | `200`               |
| `GET`  | `/cinemas/:id`                      | Get cinema details                         | `200`, `404`        |
| `GET`  | `/cinemas/:id/booking?groupSize=11` | Calculate fewest exact seat bundles        | `200`, `400`, `404` |

#### Example: Booking Quote Response

`GET /api/cinemas/1/booking?groupSize=11` (Bundles: `[2, 5]`)

```json
{
    "success": true,
    "message": "Booking quote calculated successfully.",
    "data": {
        "possible": true,
        "groupSize": 11,
        "totalBundles": 4,
        "formatted": "4 bundles: 5 × 1, 2 × 3",
        "breakdown": {
            "2": 3,
            "5": 1
        }
    }
}
```

---

## 💻 Frontend Views

| View                    | Route      | Description                                                                                                   |
| ----------------------- | ---------- | ------------------------------------------------------------------------------------------------------------- |
| **Movies Timeline**     | `/movies`  | Searchable grid of MCU titles, watched checkboxes, and add/edit modals with live cycle prevention feedback.   |
| **Rewatch Plan**        | `/plan`    | Target movie selector, visual timeline of prerequisite films, completion percentage bar, and hours remaining. |
| **Watch-Party Booking** | `/booking` | Cinema selection dropdown, group size stepper, and opening-night bundle allocation cards.                     |

---

## 🐳 Quick Start with Docker Compose (Bonus)

The easiest way to run the entire stack (Frontend, Backend API, MongoDB):

### 1. Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### 2. Configure Environment (Optional)

The project includes pre-configured defaults in `.env`. You can adjust ports or MongoDB settings if desired:

```env
FRONTEND_PORT=3000
BACKEND_PORT=5000
MONGODB_URL=mongodb://mongodb:27017/doomsday_ready
MONGO_VERSION=8
MONGO_PORT=27017
```

### 3. Launch the Stack

```bash
docker compose up --build
```

Or run in background:

```bash
docker compose up -d --build
```

### 4. Access Services

- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **MongoDB**: `localhost:27017`

To shut down:

```bash
docker compose down
```

---

## 🛠 Manual Local Development

If running without Docker:

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend starts on [http://localhost:5000](http://localhost:5000). _(Requires MongoDB running locally on port 27017)_.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend starts on [http://localhost:3000](http://localhost:3000).
