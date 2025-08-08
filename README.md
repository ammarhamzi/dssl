Digital Substation Logbook (DSSL)

### What this is
A web application for recording, reviewing, and tracking substation operations and maintenance activities. It provides structured forms, approval workflows, role-based dashboards, and offline-ready access for field and control-room teams.

### Core capabilities
- Role-based access and redirects (SuperAdmin, Admin, Manager, User)
- Structured form submissions with statuses (pending/approved/rejected) and review notes
- Dashboards, logs, and basic reporting components
- Notifications and offline-capable PWA (manifest + service worker)
- Multilingual UI (English, Spanish) and dark mode
- Optional database layer and CLI support for migrations and setup

### Architecture overview
- Frontend: Vue 3 + TypeScript, Pinia, Vue Router, Tailwind/Shadcn-style components, i18n
- API client: ofetch wrapper with caching, request deduplication, retries, CSRF and token-refresh hooks (`src/services/api.ts`)
- Auth: Pinia store with route guards and role-based redirects; mock login by default, SSO-ready plan in `auth.md` (`src/stores/auth.ts`, `src/router`)
- Data/DB (optional): Knex with migrations/seeds and a simple repository pattern (`src/lib/db`, `migrations/`, `seeds/`)
- CLI: Interactive helper for project setup and migration management (`cli/`)

### Key directories
- `src/pages` and `src/router`: routes and guards (per-route `requiresAuth`/`roles`)
- `src/stores/auth`: authentication and impersonation helpers
- `src/services/`: API client and feature services (e.g., form submissions)
- `src/lib/db`: optional database integration (Knex + repository)
- `migrations/`, `seeds/`: schema and seed data
- `cli/`: project/DB utilities

This document intentionally omits installation and run steps.