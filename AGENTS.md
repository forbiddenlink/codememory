# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Build & Development Commands

```bash
# Install dependencies
pnpm install

# Development server
pnpm dev

# Production build
pnpm build

# Lint
pnpm lint

# Type check
pnpm typecheck

# Tests
pnpm test          # Watch mode
pnpm test:run      # Single run
pnpm test:coverage # With coverage

# Database
pnpm db:push       # Push schema changes (dev)
pnpm db:migrate    # Create migration
pnpm db:generate   # Regenerate Prisma client after schema changes
pnpm db:seed       # Seed initial content (4 concepts, 40 flashcards, 20 challenges)
pnpm db:studio     # GUI database browser
```

Run a single test file: `pnpm vitest run src/lib/fsrs-scheduler.test.ts`

## Architecture

CodeMemory is a spaced repetition learning app for web development. It uses the FSRS algorithm (ts-fsrs) to schedule flashcard reviews.

### Dual-Mode Architecture

The app has two distinct user paths that share the same pages:

- **Guest mode**: No authentication. All state lives in browser localStorage via `src/lib/guest-store.ts`. FSRS calculations run client-side.
- **Authenticated mode**: GitHub OAuth via NextAuth.js. State persisted in SQLite via Prisma. FSRS calculations run server-side in API routes.

Pages detect which mode to use by checking `getServerSession()` (server components) or `useSession()` (client components). If no session exists, the guest path is used.

### Key Data Flow

1. **Guest review flow**: `guest-store.ts` → client-side `FSRSScheduler` → localStorage
2. **Auth review flow**: `POST /api/cards/[id]/review` → server-side `FSRSScheduler` → Prisma → SQLite

### Core Modules

- `src/lib/fsrs-scheduler.ts` — Wrapper around ts-fsrs. Converts between database format and FSRS Card format. Used by both guest (client) and auth (server) paths.
- `src/lib/guest-store.ts` — localStorage CRUD for guest users. Stores card progress, challenge attempts, review history, and streak data.
- `src/lib/auth.ts` — NextAuth.js configuration with GitHub OAuth and Prisma adapter.
- `src/lib/db.ts` — Singleton Prisma client with global caching for development hot reload.

### Database

SQLite in development (`prisma/schema.prisma`, `provider = "sqlite"`). The schema includes models for concepts, flashcards, challenges, user progress (FSRS state), concept mastery, GitHub repo analysis, and events.

After any schema change: run `pnpm db:generate` then `pnpm db:push` (dev) or `pnpm db:migrate` (production).

### API Routes

Public (no auth required):
- `GET /api/concepts` — List all concepts with flashcard/challenge counts
- `GET /api/concepts/[id]/flashcards` — Flashcards for a concept
- `GET /api/concepts/[id]/challenges` — Challenges for a concept
- `GET /api/flashcards/[id]` — Single flashcard with concept info
- `GET /api/challenges/[id]` — Single challenge with parsed test cases and hints
- `POST /api/execute` — Code execution via Piston API (rate limited)

Auth required:
- `GET /api/cards/due` — User's due cards
- `POST /api/cards/[id]/review` — Submit review rating, updates FSRS state and concept mastery

Admin required (isAdmin check):
- `GET/POST /api/admin/concepts` — CRUD for concepts

### Middleware

`src/middleware.ts` generates a CSP nonce per request and sets `Content-Security-Policy` headers. The nonce is passed via `x-nonce` request header.

## Design System

All UI uses CSS custom properties defined in `src/app/globals.css` with automatic dark mode via `prefers-color-scheme`. Use Tailwind classes mapped to these variables:

- Backgrounds: `bg-background`, `bg-card`, `bg-subtle`, `bg-muted`
- Text: `text-foreground`, `text-secondary`, `text-tertiary`
- Accent: `bg-accent`, `text-accent`, `bg-accent-subtle`, `hover:bg-accent-hover`
- Semantic: `text-success`, `text-error`, `text-warning` and their `-subtle` variants
- Borders: `border-border`
- Shadows: `shadow-card`, `shadow-card-hover`
- Code blocks: `bg-[var(--bg-code)]`, `text-[var(--text-code)]`

**Do NOT use hardcoded Tailwind colors** (e.g. `bg-gray-50`, `text-blue-600`). Always use the design system tokens so dark mode works consistently.

## Testing

Tests use Vitest + jsdom + @testing-library/react. Config in `vitest.config.ts`. Setup file at `src/test/setup.ts` mocks Next.js router and next-auth.

Test files live alongside source files with `.test.ts` suffix. Current test coverage:
- `src/lib/fsrs-scheduler.test.ts` — FSRS card creation, review, and preview outcomes
- `src/lib/guest-store.test.ts` — localStorage operations, streak tracking, stats

## Tech Stack

- Next.js 15 (App Router), React 19, TypeScript 5
- Prisma 6 + SQLite
- NextAuth.js 4 (GitHub OAuth)
- ts-fsrs 4.5 (FSRS v4 spaced repetition)
- Tailwind CSS 3 with CSS variable design system
- Zustand (state management)
- Monaco Editor (code challenges)
- Recharts (analytics charts)
- Vitest + Testing Library (tests)

## Environment Variables

Required:
- `DATABASE_URL` — SQLite connection string (`file:./dev.db`)
- `NEXTAUTH_URL` — App URL (`http://localhost:3000`)
- `NEXTAUTH_SECRET` — Generate with `openssl rand -base64 32`

Optional (for authenticated mode):
- `GITHUB_ID` — GitHub OAuth client ID
- `GITHUB_SECRET` — GitHub OAuth client secret
