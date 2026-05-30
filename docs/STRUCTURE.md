# Project Structure — The Tech Guy LMS

```
LMS/
├── docs/
│   └── DATABASE.md              # ER diagram & table reference
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql   # Full schema + RLS
│   │   └── 002_preserve_lms_table_casing.sql
│   └── seed.sql                     # Demo data
├── src/
│   ├── actions/                     # Server Actions
│   │   ├── auth.ts
│   │   └── onboarding.ts
│   ├── app/
│   │   ├── (auth)/                  # Public auth pages
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   ├── forgot-password/
│   │   │   ├── reset-password/
│   │   │   └── verify-email/
│   │   ├── (dashboard)/             # Protected app shell
│   │   │   ├── dashboard/
│   │   │   ├── courses/
│   │   │   ├── live-classes/
│   │   │   ├── assignments/
│   │   │   ├── projects/
│   │   │   ├── career/
│   │   │   ├── community/
│   │   │   ├── achievements/
│   │   │   ├── messages/
│   │   │   ├── resources/
│   │   │   ├── settings/
│   │   │   ├── ai/
│   │   │   ├── admin/               # Admin panel
│   │   │   ├── instructor/          # Instructor panel
│   │   │   └── mentor/              # Mentor panel
│   │   ├── onboarding/              # 8-step wizard
│   │   ├── api/                     # API Routes
│   │   │   ├── auth/refresh/
│   │   │   ├── courses/
│   │   │   ├── dashboard/
│   │   │   ├── enrollments/
│   │   │   ├── notifications/
│   │   │   ├── ai/chat/
│   │   │   └── admin/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                 # Landing page
│   ├── components/
│   │   ├── auth/
│   │   ├── courses/
│   │   ├── dashboard/
│   │   ├── layout/                  # Sidebar, Navbar, Shell
│   │   ├── onboarding/
│   │   ├── panels/                  # Admin/Instructor/Mentor
│   │   ├── shared/
│   │   └── ui/                      # shadcn/ui
│   ├── hooks/
│   │   └── use-toast.ts
│   ├── lib/
│   │   ├── auth/                    # JWT, password, session
│   │   ├── data/                    # Mock data for dev
│   │   ├── repositories/            # Data access layer
│   │   ├── supabase/                # Supabase client
│   │   ├── validators/              # Zod schemas
│   │   ├── errors.ts
│   │   ├── rate-limit.ts
│   │   └── utils.ts
│   ├── providers/
│   │   ├── query-provider.tsx
│   │   └── theme-provider.tsx
│   ├── stores/
│   │   ├── sidebar-store.ts
│   │   └── ui-store.ts
│   ├── types/
│   │   └── index.ts
│   └── middleware.ts
├── .env.example
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── vercel.json
└── README.md
```

## Architecture Layers

| Layer | Location | Purpose |
|-------|----------|---------|
| **Presentation** | `src/app/`, `src/components/` | Pages & UI components |
| **Server Actions** | `src/actions/` | Form mutations & auth flows |
| **API Routes** | `src/app/api/` | REST endpoints, rate limiting |
| **Validation** | `src/lib/validators/` | Zod input schemas |
| **Repository** | `src/lib/repositories/` | Database queries via Supabase |
| **Auth** | `src/lib/auth/` | JWT, sessions, password hashing |
| **Database** | `supabase/migrations/` | Schema, RLS, indexes, triggers |
