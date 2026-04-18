# EventHub

EventHub is a modern, full-stack application built to manage and discover events. It features a robust Node.js backend using Express and TypeScript, paired with a dynamic React frontend powered by Vite, Tailwind CSS, and Framer Motion.

## 🚀 Features
- **Backend:** Node.js, Express, TypeScript, Prisma, JSON Web Tokens (JWT).
- **Frontend:** React, Vite, TypeScript, Tailwind CSS, Framer Motion.
- **Strict Typing:** End-to-end TypeScript configurations.
- **Fast Build Times:** Vite optimizations for quick module reloads.
- **Modern UI:** Tailwind CSS combined with Framer Motion for responsive and animated components.

## 📁 Folder Structure

### Backend
The root directory houses the Express + TypeScript backend.
- `src/`
  - `controllers/`: Handles incoming requests and orchestrates responses.
  - `services/`: Encapsulates core business logic.
  - `repositories/`: Manages database operations and queries (e.g., via Prisma).
  - `models/`: Defines schema designs and data representations.
  - `interfaces/`: TypeScript interfaces and type definitions.
  - `middlewares/`: Custom functions for route protection, error handling, etc.
  - `routes/`: API endpoint definitions tying routes to controllers.
  - `utils/`: Reusable helper functions and constants.

### Frontend
Located in the `frontend/` directory, this houses the React + Vite single-page application.
- `frontend/src/`
  - `components/`: Reusable React UI components.
  - `pages/`: Top-level route components for the app structured by page.
  - `hooks/`: Custom React hooks for shared state or side-effects.
  - `utils/`: Frontend-specific utility functions.
  - `services/`: API abstractions or fetching logic (e.g., Axios/Fetch wrappers).
  - `context/`: React Context providers for global state management.

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- npm / pnpm / yarn
- PostgreSQL (or your chosen database for Prisma)

### 1. Clone the repository
```bash
git clone <repository-url>
cd EventHub
```

### 2. Backend Setup
From the project root:
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables:
   Copy `.env.example` to `.env` and configure your credentials (`DATABASE_URL`, `JWT_SECRET`).
3. Start the development server:
   ```bash
   npm run dev
   ```
The backend server will run at `http://localhost:5000`.

### 3. Frontend Setup
Open a new terminal and navigate to the frontend directory:
1. Move to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Copy `.env.example` to `.env.local` and ensure `VITE_API_URL` defaults to `http://localhost:5000`.
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
The frontend will typically be served at `http://localhost:5173`.

## 📜 License
This project is licensed under the MIT License.
