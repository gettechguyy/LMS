# The Tech Guy LMS

A modern learning management platform built with **Next.js 15**, **Supabase** (PostgreSQL), custom **JWT authentication**, and a polished SaaS dashboard UI.

## Features

- Role-based dashboards: **Student**, **Instructor**, **Mentor**, **Admin**
- Course catalog, enrollments, live classes, assignments, projects
- Gamification (XP, badges, streaks, leaderboard)
- AI learning assistant with typed chat modes
- Mentor sessions and reviews
- Admin analytics, user management, system settings

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| UI | React 19, Tailwind CSS, shadcn/ui, Framer Motion |
| Charts | Recharts |
| Data | Supabase (Postgres) via `@supabase/supabase-js` |
| Auth | Custom JWT (access + refresh cookies), bcrypt passwords |
| State | TanStack Query, Zustand |

## Prerequisites

- Node.js 20+
- npm or pnpm
- A [Supabase](https://supabase.com) project (database only — auth is custom)

## Quick start

### 1. Clone and install

```bash
git clone <your-repo-url>
cd LMS
npm install
```

### 2. Environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_APP_URL` | App URL (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_APP_NAME` | Display name |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server only) |
| `JWT_ACCESS_SECRET` | Min 32 characters |
| `JWT_REFRESH_SECRET` | Min 32 characters |
| `JWT_ACCESS_EXPIRY` | e.g. `15m` |
| `JWT_REFRESH_EXPIRY` | e.g. `7d` |
| `SMTP_*` | Optional — email verification & password reset |

Generate JWT secrets:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run `supabase/migrations/001_initial_schema.sql`.
3. Run `supabase/seed.sql` for demo users and sample content.
4. Copy **Project URL**, **anon key**, and **service role key** into `.env`.

> **Note:** This app uses Supabase **only as Postgres**. Authentication is handled by the Next.js API (`/api/auth/*`) with JWT cookies, not Supabase Auth.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Seed database (optional CLI)

```bash
npm run db:seed
```

## Demo accounts

After seeding, typical test users (see `supabase/seed.sql` for passwords):

| Role | Email pattern |
|------|----------------|
| Admin | `admin@techguy.com` |
| Instructor | `instructor@techguy.com` |
| Mentor | `mentor@techguy.com` |
| Student | `student@techguy.com` |

## Project structure

```
src/
├── app/
│   ├── (auth)/          # Login, signup, password reset
│   ├── (dashboard)/     # Main app + role panels
│   │   ├── admin/       # Admin panel
│   │   ├── instructor/  # Instructor panel
│   │   └── mentor/      # Mentor panel
│   └── api/             # REST API routes
├── components/          # UI & layout
├── lib/
│   ├── auth/            # JWT, session, passwords
│   ├── repositories/    # Data access layer
│   └── data/            # Mock data for UI fallbacks
└── types/               # Shared TypeScript types
supabase/
├── migrations/          # SQL schema
└── seed.sql             # Demo data
docs/
└── DATABASE.md          # ER diagram & table reference
```

## API routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/dashboard` | Student dashboard stats |
| GET/POST | `/api/courses` | List / create courses |
| GET/PATCH | `/api/notifications` | Notifications / mark read |
| POST | `/api/enrollments` | Enroll in a course |
| POST | `/api/ai/chat` | AI assistant (mock responses by type) |
| GET | `/api/admin/users` | List users (admin) |
| GET | `/api/admin/analytics` | Platform analytics (admin) |

## Role panels

| Role | Base path | Pages |
|------|-----------|-------|
| Admin | `/admin` | Overview, users, courses, analytics, settings |
| Instructor | `/instructor` | Dashboard, courses, new course, analytics |
| Mentor | `/mentor` | Dashboard, sessions, students |

Middleware enforces role access on `/admin`, `/instructor`, and `/mentor` routes.

## Database documentation

See [docs/DATABASE.md](docs/DATABASE.md) for the full Mermaid ER diagram and table index.

## Deploy to Vercel

1. Push your repository to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Add all environment variables from `.env.example` in **Project Settings → Environment Variables**.
4. Set `NEXT_PUBLIC_APP_URL` to your production URL (e.g. `https://your-app.vercel.app`).
5. Deploy.

### Production checklist

- Use strong, unique `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client
- Configure SMTP for email flows
- Run migrations on your Supabase production database
- Enable HTTPS (automatic on Vercel)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run db:seed` | Seed database via `scripts/seed.ts` |

## License

Private — The Tech Guy Academy.
# LMS
