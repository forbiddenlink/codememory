# CodeMemory Architecture

**Status: Implemented ✅**  
**Last Updated**: January 2026

## Overview

CodeMemory is a spaced repetition learning system for web development with **dual-mode architecture**: guest mode for instant demos and authenticated mode for persistent cloud storage.

## Design Philosophy

### Portfolio-First Approach
- **Zero friction**: Visitors can try the app immediately without authentication
- **Progressive enhancement**: Optional sign-in adds cross-device sync
- **Skill demonstration**: Shows full-stack capabilities (OAuth, localStorage, FSRS algorithm)
- **Common pattern**: Follows Excalidraw, StackBlitz, Figma model

### Technical Decisions

**Why SQLite?**
- Zero configuration for local development
- Perfect for portfolio projects and demos
- Easy upgrade path to PostgreSQL
- Reduces deployment complexity
- Single file database simplifies backup

**Why Guest Mode + Optional OAuth?**
- Removes authentication barrier for demos
- localStorage provides adequate storage for learning progress
- Shows authentication implementation skills
- Users get value immediately, can upgrade later
- Better conversion funnel: try → see value → sign in

**Why FSRS Algorithm?**
- Free, open-source spaced repetition algorithm
- More sophisticated than traditional SM-2 (used by Anki)
- Actively maintained and research-backed
- TypeScript implementation available (ts-fsrs)
- No vendor lock-in

## Architecture Layers

### 1. Storage Layer

**Guest Mode** (`/src/lib/guest-store.ts`)
```typescript
Storage: browser localStorage
Data: 
  - GuestCardProgress: FSRS state per flashcard
  - GuestChallengeAttempt: code attempts and results
Persistence: Per-browser until cleared
Privacy: No server communication
```

**Authenticated Mode** (Prisma + Database)
```typescript
Storage: SQLite (dev) / PostgreSQL (prod)
Data: Full database schema with relationships
Persistence: Cloud-based, cross-device
Sync: API calls to Next.js routes
```

### 2. Component Layer

**Dual-Mode Components:**
- `/src/app/page.tsx` - Landing with guest + auth CTAs
- `/src/app/dashboard/page.tsx` - Detects session, renders appropriate dashboard
- `/src/app/review/page.tsx` - Uses localStorage or API based on session
- `/src/components/guest-dashboard.tsx` - Client component for guests

**Auth-Required Components:**
- `/src/app/admin/*` - Content management interface
- Requires GitHub OAuth session

### 3. API Layer

**Public Endpoints** (work for guests):
- `GET /api/admin/concepts` - List all concepts
- `GET /api/concepts/[id]/flashcards` - Get flashcards for concept
- `GET /api/flashcards/[id]` - Get single flashcard

**Authenticated Endpoints**:
- `GET /api/cards/due` - Get user's due cards
- `POST /api/cards/[id]/review` - Submit card review
- `POST /api/admin/concepts` - Create new concept

### 4. Scheduling Layer

**FSRS Scheduler** (`/src/lib/fsrs-scheduler.ts`)
```typescript
Input: Current card state + rating (1-4)
Output: 
  - Updated FSRS parameters (stability, difficulty)
  - Next review date
  - Preview of all possible outcomes

Used by:
  - Guest mode: Client-side calculations
  - Auth mode: Server-side API calls
```

## Data Flow

### Guest User Flow
```
1. Visit landing page
2. Click "Continue as Guest"
3. Dashboard loads → initializes localStorage with all flashcard IDs
4. Review cards → FSRS runs client-side → updates localStorage
5. Progress persists in browser
```

### Authenticated User Flow
```
1. Visit landing page
2. Click "Sign in with GitHub"
3. OAuth flow → creates/fetches User record
4. Dashboard loads → fetches due cards from database
5. Review cards → API calls to server → FSRS runs server-side → updates database
6. Progress syncs across devices
```

## Database Schema

### Core Models
- **User**: GitHub OAuth users
- **Concept**: Learning topics (JavaScript Promises, React Hooks, etc.)
- **Flashcard**: Individual cards with front/back/code
- **UserCardProgress**: FSRS state per user-card pair
- **Challenge**: Coding problems with test cases
- **ChallengeAttempt**: User solutions and results

### FSRS State Storage
```typescript
UserCardProgress {
  due: DateTime           // Next review date
  stability: Float        // Memory strength
  difficulty: Float       // Card difficulty for user
  elapsed_days: Int       // Days since last review
  scheduled_days: Int     // Interval length
  reps: Int              // Total reviews
  lapses: Int            // Times forgotten
  state: Int             // 0=New, 1=Learning, 2=Review, 3=Relearning
  last_review: DateTime  // Last review timestamp
}
```

Guest mode stores identical structure in localStorage as JSON.

## File Structure

```
codememory/
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Initial content (4 concepts, 40 cards, 20 challenges)
│
├── src/
│   ├── app/
│   │   ├── page.tsx           # Landing (guest + auth options)
│   │   ├── dashboard/         # Main dashboard (dual-mode)
│   │   ├── review/            # Card review (dual-mode)
│   │   ├── admin/             # Content management (auth required)
│   │   └── api/
│   │       ├── auth/          # NextAuth routes
│   │       ├── cards/         # Review endpoints
│   │       ├── admin/         # Admin endpoints
│   │       ├── concepts/      # Concept data
│   │       └── flashcards/    # Flashcard data
│   │
│   ├── components/
│   │   ├── providers/
│   │   │   └── auth-provider.tsx
│   │   └── guest-dashboard.tsx
│   │
│   ├── lib/
│   │   ├── auth.ts            # NextAuth config
│   │   ├── db.ts              # Prisma client
│   │   ├── fsrs-scheduler.ts  # FSRS wrapper
│   │   └── guest-store.ts     # localStorage wrapper
│   │
│   └── types/
│       └── index.ts           # TypeScript types
│
├── .env.local                 # Environment variables
└── README.md                  # Setup guide
```

## Tech Stack

### Core
- **Next.js 15**: App Router, Server Components, Server Actions
- **React 19**: Latest React features
- **TypeScript 5**: Type safety across the stack
- **Tailwind CSS 3**: Utility-first styling

### Database & ORM
- **Prisma 6**: Type-safe database client
- **SQLite**: Local development (zero config)
- **PostgreSQL**: Production (optional upgrade)

### Authentication
- **NextAuth.js 4**: GitHub OAuth provider
- **Session-based**: JWT sessions, httpOnly cookies

### Spaced Repetition
- **ts-fsrs 4.5**: FSRS v4 algorithm implementation
- **Client & Server**: Same algorithm, different execution context

### Future: Code Execution
- **Monaco Editor 4.6**: VS Code editor component
- **Piston API**: Multi-language code execution service

## Security Considerations

### Guest Mode
- ✅ No authentication required
- ✅ Data stays in browser (privacy)
- ✅ No server-side storage
- ⚠️ Data lost if localStorage cleared
- ⚠️ No cross-device sync

### Authenticated Mode
- ✅ OAuth via GitHub (no password storage)
- ✅ Session-based auth with httpOnly cookies
- ✅ CSRF protection via NextAuth
- ✅ SQL injection protection via Prisma
- ⚠️ Requires GitHub OAuth app setup

## Performance

### Guest Mode
- **Fast**: No API calls for reviews
- **Offline-capable**: Works without network
- **localStorage limits**: ~5-10MB typical
- **Scales to**: ~1000 cards comfortably

### Authenticated Mode
- **API latency**: Round-trip for each review
- **Database queries**: Optimized with Prisma
- **Server-side FSRS**: Consistent across devices
- **Scales to**: Unlimited cards

## Deployment

### Development
```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

### Production (Vercel)
```bash
# Set environment variables:
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://yourapp.com
NEXTAUTH_SECRET=generated-secret
GITHUB_ID=oauth-client-id (optional)
GITHUB_SECRET=oauth-secret (optional)

# Deploy
vercel deploy --prod
```

### Production (Docker)
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npx prisma generate
RUN npm run build
CMD ["npm", "start"]
```

## Monitoring & Analytics

### Current: None
App is fully functional without analytics.

### Future Considerations
- Vercel Analytics (privacy-friendly)
- Error tracking (Sentry)
- Usage metrics for portfolio showcase
- A/B testing guest vs auth conversion

## Scalability Path

### Phase 1: Current (Portfolio/Demo)
- SQLite database
- Guest mode primary
- Single server instance
- ~100 concurrent users

### Phase 2: Personal Use
- PostgreSQL database
- Both modes equally weighted
- Vercel serverless
- ~1000 users

### Phase 3: Public Launch
- PostgreSQL with connection pooling
- Multiple regions
- Redis for session caching
- Rate limiting per user
- ~10,000+ users

## Testing Strategy

### Current: Manual Testing
- Test guest flow end-to-end
- Test authenticated flow end-to-end
- Test localStorage persistence
- Test FSRS calculations

### Future: Automated Testing
- Unit tests: FSRS scheduler, guest-store
- Integration tests: API routes
- E2E tests: Playwright for critical flows
- Visual regression: Chromatic for UI

## Maintenance

### Dependencies
- Keep Next.js, React, Prisma updated
- Monitor ts-fsrs for algorithm updates
- Security updates via Dependabot

### Content
- Add new concepts via admin interface
- Community contributions (future)
- AI-generated content (future)

### Database
- Regular backups (PostgreSQL only)
- Migration testing before production
- Schema versioning via Prisma

## Future Enhancements

### Code Execution
- Monaco Editor integration
- Piston API for running code
- Test case validation
- Syntax highlighting

### Social Features
- Share card decks
- Leaderboards
- Study together mode
- Community-created content

### Advanced Features
- Spaced practice for challenges
- GitHub repo integration
- Learning path recommendations
- AI-powered hints

### Mobile
- Progressive Web App (PWA)
- Offline mode
- Push notifications for reviews
- Mobile-optimized UI

## Lessons Learned

### What Worked Well
✅ Guest mode removes adoption friction  
✅ SQLite simplifies development setup  
✅ FSRS algorithm handles scheduling perfectly  
✅ Next.js 15 App Router is fast and elegant  
✅ Prisma makes database work pleasant  

### What Could Improve
⚠️ localStorage size limits for large decks  
⚠️ No guest → authenticated migration path  
⚠️ Code execution requires external API  
⚠️ Admin UI could be more polished  

### Key Insights
- Portfolio projects need instant demos
- Optional auth > required auth for demos
- SQLite is underrated for solo projects
- Good defaults matter more than configurability
- Ship fast, iterate based on feedback
