# WeTheMakers Assignment (Job Board)

A full-stack job board application with authentication, role-based access control, job posting/management, and job applications.

- Frontend: Next.js (App Router) + NextAuth + React Query + nuqs
- Backend: NestJS + Prisma
- Mobile: Expo (React Native) + Expo Router + Zustand
- Database: PostgreSQL (Supabase)

---

## Project Structure

```
wethemakers-assignment/
├── backend/          # NestJS API server
├── frontend/         # Next.js web application
└── mobile/           # Expo React Native mobile app
```

---

## Setup Instructions

### Prerequisites

- Node.js
- pnpm (`npm i -g pnpm`)
- A PostgreSQL database (project is configured for Supabase)
- For mobile development: Expo CLI, Android Studio / Xcode (optional for emulators)

> This repo is split into three apps: `backend/` (NestJS), `frontend/` (Next.js), and `mobile/` (Expo).

### 1) Install dependencies

From the repository root:

```bash
cd backend && pnpm install
cd ../frontend && pnpm install
cd ../mobile && pnpm install
```

### 2) Configure environment variables

All apps require environment variables.

#### Backend env

Create `backend/.env` (use `backend/.env.example` as a starting point) and set:

- `DATABASE_URL` (recommended: Supabase pooled connection string)
- `DIRECT_URL` (recommended: Supabase direct connection string; used by scripts/seeding)
- `JWT_SECRET`
- `FRONTEND_URL` to allow cors

#### Frontend env

Create `frontend/.env.local` (use `frontend/.env.example`)

#### Mobile env

Create `mobile/.env` (use `mobile/.env.example`)

### 3) Initialize the database schema

From `backend/`:

```bash
npx prisma db push
npx prisma generate
```

### 4) Seed sample jobs (if you want to)

From `backend/`:

```bash
pnpm run seed
```

This seeds jobs from `backend/jobs-data.json`.

### 5) Run the apps

#### Start backend

From `backend/`:

```bash
pnpm start:dev
```

By default the backend runs on **http://localhost:3001**.

#### Start frontend

From `frontend/`:

```bash
pnpm dev
```

Frontend runs on **http://localhost:3000**.

#### Start mobile app

From `mobile/`:

```bash
pnpm start
```

This starts the Expo dev server.

---

## Technologies Used

### Frontend (Web)

- Next.js (App Router) + TypeScript
- NextAuth (authentication)
- React Query, Axios
- Tailwind CSS, shadcn/ui components, Lucide React
- React Markdown rendering

### Backend

- NestJS + TypeScript
- Prisma ORM
- JWT auth + role-based access control (guards/decorators)

### Mobile

- Expo SDK 54 + React Native
- Expo Router (file-based routing)
- React Native Reanimated + Gesture Handler
- React Query + Axios
- Zustand (state management)
- Tailwind CSS (via uniwind)
- React Hook Form + Zod (form validation)
- Expo SecureStore (secure token storage on native)

#### Mobile App Structure

```
mobile/
├── app/                    # File-based routing (Expo Router)
│   ├── (auth)/             # Authentication screens (login, signup)
│   ├── (tabs)/             # Main tab navigation (jobseeker)
│   │   ├── index.tsx       # Dashboard
│   │   ├── jobs.tsx        # Browse jobs
│   │   ├── applications.tsx # My applications
│   │   └── profile.tsx     # User profile
│   ├── (admin)/            # Admin tab navigation
│   │   ├── index.tsx       # Admin dashboard
│   │   ├── jobs.tsx        # Manage jobs
│   │   ├── applications.tsx # Review applications
│   │   ├── users.tsx       # Manage users
│   │   └── profile.tsx     # Admin profile
│   └── job/                # Job detail screens
├── components/             # Reusable shared UI components
├── context/                # React contexts (auth, theme)
├── hooks/                  # Custom shared hooks
├── lib/                    # Utilities (API client, forms, toast)
├── stores/                 # Zustand stores
└── assets/                 # Images and fonts
```

### Database

- PostgreSQL (Supabase)

---

## Assumptions Made

- A Supabase Postgres instance is available and credentials are provided via env vars.
- `DIRECT_URL` is used for scripts like seeding (direct DB connections can be required depending on Supabase pooling).
- Roles are enforced on the backend (admin vs jobseeker) and the UI exposes/admin routes accordingly.
- The mobile app uses the same backend API as the web frontend.
- JWT tokens are stored securely using Expo SecureStore on native platforms and localStorage on web.

---
