# CodeMemory

**Master web development through spaced repetition.**

CodeMemory is a modern learning application that uses the FSRS (Free Spaced Repetition Scheduler) algorithm to help you retain web development knowledge through flashcards and coding challenges.

## 🎯 Core Concept

"Where forgetting shows up as failing tests" - CodeMemory treats your memory like code. When you forget something, it shows up as a failing test that needs attention. The FSRS algorithm optimizes when you review each concept for maximum retention.

## ✨ Features

- 🧠 **FSRS Algorithm**: Scientific spaced repetition scheduling
- 📚 **Multi-Language Support**: JavaScript, React, CSS, Python, and more
- 💻 **Code Challenges**: Practice with real coding problems
- 🚀 **Guest Mode**: Try instantly without authentication (portfolio-friendly)
- 🔐 **Optional GitHub OAuth**: Sign in to sync progress across devices
- 📊 **Progress Tracking**: Track mastery across concepts
- 🎨 **Modern UI**: Built with Next.js 15, React 19, and Tailwind CSS

## 🌟 Portfolio Mode

**Perfect for demonstrations and portfolios!**

CodeMemory works immediately without any authentication:
- ✅ Visitors can try it instantly - no sign-up required
- ✅ Progress stored in browser localStorage (persists per-browser)
- ✅ Optional GitHub sign-in for syncing across devices
- ✅ Great for portfolio demonstrations and sharing

**Guest Mode vs Authenticated:**
- **Guest Mode**: Progress stored in browser, instant access, no setup needed
- **Authenticated Mode**: Progress synced to cloud, works across devices

## Prerequisites

- Node.js 18+
- SQLite database (built-in, no external setup needed)
- GitHub OAuth App credentials (optional, only for authenticated mode)

## Initial Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy the example file:

```bash
cp .env.example .env.local
```

For guest mode, you only need:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-here"
```

Generate NextAuth secret:
```bash
openssl rand -base64 32
```

### 3. (Optional) Set up GitHub OAuth for authenticated mode

- Go to [GitHub Developer Settings](https://github.com/settings/developers)
- Click "New OAuth App"
- Fill in the details:
  - Application name: "CodeMemory Local"
  - Homepage URL: `http://localhost:3000`
  - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
- Copy the Client ID and generate a Client Secret
- Add them to your `.env.local` file:
  ```env
  GITHUB_ID="your_github_oauth_app_client_id"
  GITHUB_SECRET="your_github_oauth_app_client_secret"
  ```
### 4. Set up the database

```bash
npm run db:push
npm run db:seed
```

### 5. Start the development server

```bash
npm run dev
```

### 6. Open your browser

Navigate to [http://localhost:3000](http://localhost:3000)

- Click "Continue as Guest" to try it instantly
- Or "Sign in with GitHub" to sync progress across devices

## 📁 Project Structure

```
codememory/
├── prisma/
│   ├── schema.prisma      # Database schema (SQLite)
│   └── seed.ts            # Seed data with real web dev content
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   │   ├── auth/      # NextAuth endpoints
│   │   │   ├── cards/     # Flashcard review endpoints
│   │   │   ├── admin/     # Admin endpoints
│   │   │   ├── concepts/  # Concept data endpoints
│   │   │   └── flashcards/ # Flashcard data endpoints
│   │   ├── dashboard/     # Main dashboard (supports guest + auth)
│   │   ├── review/        # Flashcard review (supports guest + auth)
│   │   ├── admin/         # Admin interface (auth required)
│   │   └── page.tsx       # Landing page (guest + auth options)
│   ├── components/
│   │   ├── providers/     # React context providers
│   │   └── guest-dashboard.tsx  # Guest mode dashboard
│   ├── lib/
│   │   ├── auth.ts        # NextAuth configuration
│   │   ├── db.ts          # Prisma client
│   │   ├── fsrs-scheduler.ts  # FSRS algorithm wrapper
│   │   └── guest-store.ts # localStorage-based guest storage
│   └── types/             # TypeScript types
├── .env.local             # Environment variables (create from .env.example)
└── package.json
```

## 🧪 Development

### Database Commands

```bash
# Push schema changes to database
npm run db:push

# Open Prisma Studio (database GUI)
npm run db:studio

# Seed the database
npm run db:seed

# Reset database (caution: deletes all data)
npx prisma migrate reset
```

### Guest Mode Architecture

Guest mode uses browser localStorage to provide a fully functional experience without authentication:

- **Storage**: `guest-store.ts` handles all localStorage operations
- **Progress Tracking**: FSRS state (stability, difficulty, due dates) stored per-card
- **Persistence**: Data persists in the user's browser until they clear localStorage
- **Privacy**: No server communication for guest users, all data stays local

**Key Files:**
- `/src/lib/guest-store.ts` - localStorage wrapper with FSRS state management
- `/src/components/guest-dashboard.tsx` - Client-side dashboard for guests
- `/src/app/review/page.tsx` - Unified review page (detects guest vs auth)

## 🎓 Learning Content

Current concepts include:
- **JavaScript Promises**: async/await, error handling, Promise.all
- **React Hooks**: useState, useEffect, custom hooks
- **CSS Flexbox**: layouts, alignment, responsive design
- **Python Async/Await**: coroutines, asyncio, concurrent programming

Each concept includes:
- 10 flashcards (5 types: syntax, concept, prediction, bug, use_case)
- 5 coding challenges (stages 1-5, increasing difficulty)

**Adding More Concepts:**
Use the admin interface (requires GitHub auth) to add new concepts, flashcards, and challenges.

## 🚢 Deployment

**For Portfolio/Demo Deployment:**

Since guest mode works without authentication, you can deploy to any static hosting:
- Vercel (recommended for Next.js)
- Netlify
- Railway
- Fly.io

**Environment Variables for Production:**
- Set `NEXTAUTH_URL` to your production URL
- GitHub OAuth credentials are optional (guest mode works without them)
- SQLite database will be created automatically

**Note**: For production use with multiple users, consider:
- Upgrading to PostgreSQL for better scalability
- Adding rate limiting for API routes
- Implementing data export for guest users before they clear browser data

## 🎯 Design Decisions

**Why Guest Mode?**
- Portfolio apps need instant gratification - no sign-up friction
- Demonstrates full-stack skills without requiring OAuth setup
- Users can try before committing to authentication
- localStorage provides adequate storage for learning progress

**Why SQLite?**
- Zero configuration for local development
- Perfect for portfolio projects and demos
- Easy to upgrade to PostgreSQL later if needed
- Reduces deployment complexity

**Why Optional OAuth?**
- Shows authentication skills for portfolio
- Provides personal cloud sync for the developer's own use
- Optional feature doesn't block main functionality
- Common pattern in successful portfolio apps

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

[Your chosen license]

## 🙏 Acknowledgments

- [FSRS](https://github.com/open-spaced-repetition/fsrs.js) - Free Spaced Repetition Scheduler
- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Tailwind CSS](https://tailwindcss.com/) - Styling

**Flashcard Types:**
1. `syntax` - Code syntax recall
2. `concept` - Conceptual understanding
3. `prediction` - Predict code output
4. `bug` - Identify/fix bugs
5. `use_case` - When to use patterns

**Challenge Stages:**
1. Syntax Recall - Fill in blanks
2. Code Completion - Complete partial code
3. Debugging - Fix broken code
4. Optimization - Improve existing code
5. Full Implementation - Build from scratch

## Project Structure

```
codememory/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/          # NextAuth routes
│   │   │   └── cards/         # Flashcard API
│   │   ├── dashboard/         # Main dashboard
│   │   ├── review/            # Review interface
│   │   └── layout.tsx
│   ├── components/
│   │   └── providers/         # React context providers
│   └── lib/
│       ├── auth.ts            # NextAuth config
│       ├── db.ts              # Prisma client
│       └── fsrs-scheduler.ts  # Spaced repetition
├── .env.local                 # Environment variables
├── package.json
└── tsconfig.json
```

## Development Workflow

### Adding New Concepts

1. Create concept in database
2. Add 10 flashcards (2 of each type)
3. Add 5 challenges (1 per stage)
4. Test the learning flow yourself
5. Adjust difficulty based on feedback

### Database Commands

```bash
# View database in GUI
npm run db:studio

# Create new migration
npm run db:migrate

# Generate Prisma client (after schema changes)
npm run db:generate

# Push schema without migration (dev only)
npm run db:push
```

### Code Execution (Piston API)

Challenges use the public Piston API for code execution. No additional setup required.

**Supported languages:** JavaScript, Python, TypeScript, Go, Rust, Java, C++, and 40+ more.

## Next Steps

1. **Create your first concept** - Pick something you're learning right now
2. **Build 10 flashcards** - Following the 5 types pattern
3. **Add 5 challenges** - One for each difficulty stage
4. **Test it yourself** - Use the app for 1 week
5. **Iterate** - Fix what's annoying, improve what's working

## Roadmap (Gates)

### Gate 1: Core Loop Works ✅ (Current)
- Authentication
- Flashcard review with FSRS
- Basic dashboard
- Database schema

### Gate 2: Full Review Experience (Next)
- Code challenges with Monaco Editor
- Piston API integration
- Test execution and diagnosis
- Progress tracking

### Gate 3: Knowledge Graph
- Concept prerequisites visualization
- Skill tree with Mermaid.js
- Learning path recommendations

### Gate 4: GitHub Integration
- Repository analysis
- Concept detection
- Personalized suggestions

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL + Prisma
- **Auth**: NextAuth.js + GitHub OAuth
- **SRS Algorithm**: ts-fsrs (FSRS v4)
- **Code Editor**: Monaco Editor
- **Code Execution**: Piston API
- **Styling**: Tailwind CSS
- **State Management**: Zustand

## License

Private project for personal use.
