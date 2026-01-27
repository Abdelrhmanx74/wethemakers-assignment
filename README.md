# WeTheMakers Assignment (Job Board)

A full-stack job board application with authentication, role-based access control, job posting/management, and job applications.

- Frontend: Next.js (App Router) + NextAuth + react query + nuqs
- Backend: NestJS + Prisma
- Database: PostgreSQL (Supabase)

---

## Setup Instructions

### Prerequisites

- Node.js
- pnpm (`npm i -g pnpm`)
- A PostgreSQL database (project is configured for Supabase)

> This repo is split into two apps: `backend/` (NestJS) and `frontend/` (Next.js).

### 1) Install dependencies

From the repository root:

```bash
cd backend && pnpm install
cd ../frontend && pnpm install
```

### 2) Configure environment variables

Both apps require environment variables.

#### Backend env

Create `backend/.env` (use `backend/.env.example` as a starting point) and set:

- `DATABASE_URL` (recommended: Supabase pooled connection string)
- `DIRECT_URL` (recommended: Supabase direct connection string; used by scripts/seeding)
- `JWT_SECRET`
- `FRONTEND_URL` to allow cors

#### Frontend env

Create `frontend/.env.local` (use `frontend/.env.example`) and set:

- NextAuth settings (e.g. `NEXTAUTH_URL`, `NEXTAUTH_SECRET`)
- API base URL pointing to the backend (if applicable in your setup)

### 3) Initialize the database schema

From `backend/`:

```bash
npx prisma db push
npx prisma generate
```

### 4) Seed sample jobs

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

### 6) Quick smoke checks

- Frontend builds:

```bash
cd frontend && pnpm build
```

- Backend starts (dev):

```bash
cd backend && pnpm start:dev
```

---

## Technologies Used

### Frontend

- Next.js (App Router) + TypeScript
- NextAuth (authentication)
- React Query, Axios
- Tailwind CSS, shadcn/ui components , lucide react
- React Markdown rendering

### Backend

- NestJS + TypeScript
- Prisma ORM
- JWT auth + role-based access control (guards/decorators)

### Database

- PostgreSQL (Supabase)

---

## Assumptions Made

- A Supabase Postgres instance is available and credentials are provided via env vars.
- `DIRECT_URL` is used for scripts like seeding (direct DB connections can be required depending on Supabase pooling).
- The backend runs on port **3001** to avoid clashing with the Next.js dev server on **3000**.
- Roles are enforced on the backend (admin vs jobseeker) and the UI exposes/admin routes accordingly.

---
