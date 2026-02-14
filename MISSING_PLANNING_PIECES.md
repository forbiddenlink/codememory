# CodeMemory: Implementation Updates & Missing Pieces

**Status: Core System Implemented ✅ | Guest Mode Added ✅**

## ✅ COMPLETED: Guest Mode + Optional Auth

### Major Architecture Change from Original Plan

**Original Plan:**
- Required GitHub OAuth authentication
- All progress stored in PostgreSQL
- Sign-in required before use

**Current Implementation:**
- ✅ Primary: Guest mode (localStorage, instant access, portfolio-friendly)
- ✅ Secondary: Optional GitHub OAuth (cross-device sync)
- ✅ SQLite database (easier dev setup)
- ✅ Dual-mode dashboard and review components

**Why This Change:**
- Portfolio apps need zero-friction demos
- Visitors can try immediately without GitHub account
- Shows full-stack OAuth skills while remaining accessible
- Common pattern: Excalidraw, StackBlitz, Figma all work this way

### Guest Mode Implementation

**Storage Layer (`/src/lib/guest-store.ts`):**
```typescript
// All FSRS state stored in localStorage
- GuestCardProgress: stability, difficulty, due dates per card
- GuestChallengeAttempt: code attempts and pass/fail status
- Initialized on first visit with all flashcard IDs
- Full FSRS algorithm runs client-side
```

**Component Architecture:**
- Landing: "Continue as Guest" (primary) + "Sign in with GitHub" (secondary)
- Dashboard: Detects session → shows GuestDashboard or AuthDashboard  
- Review: Uses localStorage (guest) or API calls (authenticated)
- Admin: Requires authentication for content management

## ✅ COMPLETED: Initial Content

Created 4 comprehensive concepts:
1. **JavaScript Promises** - 10 flashcards, 5 challenges
2. **React Hooks** - 10 flashcards, 5 challenges
3. **CSS Flexbox** - 10 flashcards, 5 challenges
4. **Python Async/Await** - 10 flashcards, 5 challenges

Total: 40 flashcards + 20 challenges with real web dev content

---

# Missing Planning Pieces Before Further Development

Based on the current implementation, here are pieces to address for continued development:

## 1. **Content Expansion Strategy**

### Pick ONE concept you're learning right now:
- JavaScript Promises?
- Python async/await?
- TypeScript generics?
- React hooks?
- Something else?

### For that concept, create:

#### **10 Flashcards** (5 card types × 2 examples each)
1. **Syntax Recall** (2 cards)
   - Front: "How do you create a Promise that resolves after 1 second?"
   - Back: `new Promise(resolve => setTimeout(resolve, 1000))`
   
2. **Concept Explanation** (2 cards)
   - Front: "Why use Promises over callbacks?"
   - Back: "Avoid callback hell, better error handling with .catch(), chainable with .then()"
   
3. **Code Prediction** (2 cards)
   - Front: "What does this output? `Promise.resolve(1).then(x => x + 1).then(console.log)`"
   - Back: "2"
   
4. **Bug Identification** (2 cards)
   - Front: "What's wrong? `async function f() { Promise.resolve(1) }; f().then(console.log)`"
   - Back: "Missing `await` - function returns a Promise, not the resolved value"
   
5. **Use Case** (2 cards)
   - Front: "When should you use Promise.all()?"
   - Back: "When you need to run multiple async operations in parallel and wait for all to complete"

#### **5 Challenges** (1 per stage)
1. **Stage 1 - Syntax Recall**: Fill in the blank
   ```javascript
   // Create a Promise that resolves with "Hello" after 500ms
   const greeting = new _____(resolve => {
     setTimeout(() => resolve(_____), 500);
   });
   ```

2. **Stage 2 - Code Completion**: Complete the function
   ```javascript
   // Fetch user data and return just the username
   async function getUsername(userId) {
     const response = await fetch(`/api/users/${userId}`);
     // TODO: Complete this function
   }
   ```

3. **Stage 3 - Debugging**: Fix the bug
   ```javascript
   // This should log "Done!" after both operations complete
   async function processBatch() {
     fetchData();  // BUG: not awaited
     processData(); // BUG: not awaited
     console.log("Done!");
   }
   ```

4. **Stage 4 - Optimization**: Improve this code
   ```javascript
   // Make these requests run in parallel instead of sequential
   async function loadDashboard() {
     const user = await fetchUser();
     const posts = await fetchPosts();
     const comments = await fetchComments();
     return { user, posts, comments };
   }
   ```

5. **Stage 5 - Full Implementation**: Build from scratch
   ```javascript
   // Implement a retry function that tries an async operation up to 3 times
   async function retry(fn, maxAttempts = 3) {
     // Your implementation here
   }
   // Test: retry(() => fetchData())
   ```

#### **Deterministic Tests for Each Challenge**
- Input/expected output pairs
- Edge cases
- Common wrong answers mapped to misconceptions

### **This is your proof artifact** - Create this before writing any app code.

---

## 2. **Content Creation Template**

You need a standard format so every future concept follows the same structure.

### Template Structure:
```markdown
# Concept: [Name]
**Language**: [JavaScript/Python/etc.]
**Category**: [Async/Data Structures/etc.]
**Difficulty**: [Beginner/Intermediate/Advanced]
**Prerequisites**: [List of concept IDs that should be mastered first]

## Learning Objectives
1. Understand...
2. Be able to...
3. Recognize when to use...

## Flashcards (10 total)

### Syntax Recall (2 cards)
#### Card 1
- **Front**: "..."
- **Back**: "..."
- **Code Example**: ```...```

[Repeat for all 10 cards]

## Challenges (5 total)

### Stage 1: Syntax Recall
- **Title**: "..."
- **Prompt**: "..."
- **Starter Code**: ```...```
- **Tests**: 
  ```json
  [
    { "input": "...", "expected": "...", "description": "..." },
    { "input": "...", "expected": "...", "description": "..." }
  ]
  ```
- **Common Mistakes**:
  - Wrong output X → Misconception: "User forgot to..."
  - Error Y → Misconception: "User is confusing..."

[Repeat for all 5 challenges]

## Misconception Mappings
- **"Promise {<pending>}"** → "Forgot to await the Promise"
- **"Cannot read property of undefined"** → "Promise chain broke, missing error handling"
- etc.
```

---

## 3. **Tech Stack Setup Checklist**

### Prerequisites
- [ ] Node.js 18+ installed
- [ ] PostgreSQL installed (or Neon/Supabase account)
- [ ] GitHub account (for OAuth)
- [ ] Code editor (VS Code recommended)

### Step-by-Step Setup
```bash
# 1. Create Next.js project
npx create-next-app@latest codememory --typescript --tailwind --app --src-dir
cd codememory

# 2. Install core dependencies
npm install @prisma/client prisma
npm install next-auth
npm install @monaco-editor/react
npm install mermaid
npm install axios # for Piston API calls
npm install ts-fsrs # FSRS implementation
npm install zustand # state management (optional but recommended)

# 3. Install dev dependencies
npm install -D @types/node @types/react

# 4. Initialize Prisma
npx prisma init

# 5. Set up environment variables
cp .env.example .env.local
# Add:
# DATABASE_URL="postgresql://..."
# NEXTAUTH_SECRET="generate with: openssl rand -base64 32"
# NEXTAUTH_URL="http://localhost:3000"
# GITHUB_ID="from GitHub OAuth app"
# GITHUB_SECRET="from GitHub OAuth app"
```

### GitHub OAuth Setup
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create new OAuth app
3. Homepage URL: `http://localhost:3000`
4. Callback URL: `http://localhost:3000/api/auth/callback/github`
5. Copy Client ID and Secret to `.env.local`

---

## 4. **Core Data Flow Design**

### User Journey Flow
```
1. User logs in (GitHub OAuth)
   ↓
2. Dashboard shows: "X cards due for review today"
   ↓
3. Click "Start Review"
   ↓
4. Show flashcard front
   ↓
5. User clicks "Show Answer"
   ↓
6. Show flashcard back + code example
   ↓
7. User rates difficulty (Again/Hard/Good/Easy)
   ↓
8. FSRS calculates next review date
   ↓
9. Save to database
   ↓
10. Show next card OR "Review complete!"
   ↓
11. Option: "Practice with a challenge"
   ↓
12. Monaco Editor with starter code
   ↓
13. User writes/runs code
   ↓
14. Execute via Piston API
   ↓
15. Show test results (pass/fail)
   ↓
16. If fail: Show diagnosed issue (deterministic)
   ↓
17. Update mastery level
   ↓
18. Back to dashboard
```

### API Endpoints Needed
```
/api/auth/[...nextauth]     - NextAuth
/api/cards/due               - Get cards due for review
/api/cards/[id]/review       - Submit card review + rating
/api/challenges/[id]         - Get challenge details
/api/challenges/[id]/submit  - Submit solution + run tests
/api/execute                 - Proxy to Piston API
/api/concepts                - Get concepts for skill tree
/api/analytics               - Get user progress stats
```

---

## 5. **Piston API Integration Details**

### How Piston Works
```typescript
// Execute code via Piston
const executePiston = async (language: string, code: string) => {
  const response = await fetch('https://emkc.org/api/v2/piston/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      language: language,
      version: '*', // use latest
      files: [{
        name: 'main',
        content: code
      }],
      stdin: '',
      args: [],
      compile_timeout: 10000,
      run_timeout: 3000,
      compile_memory_limit: -1,
      run_memory_limit: -1
    })
  });
  
  return response.json();
  // Returns: { run: { stdout, stderr, code, signal, output } }
};

// Supported languages
const SUPPORTED_LANGUAGES = {
  javascript: 'javascript',
  python: 'python',
  typescript: 'typescript',
  go: 'go',
  rust: 'rust',
  java: 'java',
  cpp: 'cpp',
  // ... 40+ more
};
```

### Test Execution Pattern
```typescript
interface Test {
  input: string;
  expected: string;
  description: string;
}

const runTests = async (userCode: string, tests: Test[], language: string) => {
  const results = [];
  
  for (const test of tests) {
    // Wrap user code with test harness
    const fullCode = `
      ${userCode}
      
      // Test harness
      console.log(JSON.stringify(testFunction(${test.input})));
    `;
    
    const result = await executePiston(language, fullCode);
    const output = result.run.stdout.trim();
    
    results.push({
      test: test.description,
      passed: output === test.expected,
      expected: test.expected,
      actual: output,
      error: result.run.stderr
    });
  }
  
  return results;
};
```

---

## 6. **Prisma Schema (Concrete)**

Create this in `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  githubId      String    @unique
  email         String    @unique
  username      String
  createdAt     DateTime  @default(now())
  lastActive    DateTime  @updatedAt
  
  cardProgress  UserCardProgress[]
  attempts      ChallengeAttempt[]
  mastery       UserConceptMastery[]
  repos         GitHubRepo[]
  fsrsParams    UserFSRSParams?
}

model Concept {
  id            String    @id @default(cuid())
  name          String
  category      String
  description   String
  difficulty    Int
  createdAt     DateTime  @default(now())
  
  flashcards    Flashcard[]
  challenges    Challenge[]
  prerequisites ConceptPrerequisite[] @relation("ConceptToPrerequisite")
  dependents    ConceptPrerequisite[] @relation("PrerequisiteToConcept")
  mastery       UserConceptMastery[]
  repoDetections RepoDetectedConcept[]
}

model ConceptPrerequisite {
  conceptId       String
  prerequisiteId  String
  concept         Concept @relation("ConceptToPrerequisite", fields: [conceptId], references: [id])
  prerequisite    Concept @relation("PrerequisiteToConcept", fields: [prerequisiteId], references: [id])
  
  @@id([conceptId, prerequisiteId])
}

model Flashcard {
  id          String   @id @default(cuid())
  conceptId   String
  type        String   // 'syntax', 'concept', 'bug', 'use_case', 'prediction'
  front       String
  back        String
  codeExample String?
  createdAt   DateTime @default(now())
  
  concept     Concept @relation(fields: [conceptId], references: [id])
  progress    UserCardProgress[]
}

model UserCardProgress {
  id             String   @id @default(cuid())
  userId         String
  flashcardId    String
  stability      Float
  difficulty     Float
  elapsedDays    Int
  scheduledDays  Int
  reps           Int
  lapses         Int
  state          String   // 'new', 'learning', 'review', 'relearning'
  lastReview     DateTime?
  nextReview     DateTime
  createdAt      DateTime @default(now())
  
  user           User @relation(fields: [userId], references: [id])
  flashcard      Flashcard @relation(fields: [flashcardId], references: [id])
  
  @@unique([userId, flashcardId])
  @@index([userId, nextReview])
}

model UserFSRSParams {
  userId    String   @id
  wParams   Float[]  // 17 weight parameters
  updatedAt DateTime @updatedAt
  
  user      User @relation(fields: [userId], references: [id])
}

model Challenge {
  id               String   @id @default(cuid())
  conceptId        String
  title            String
  description      String
  language         String
  stage            Int
  difficulty       String
  starterCode      String
  solutionTemplate String?
  testCases        Json     // Array of test cases
  hints            String[]
  timeLimit        Int
  memoryLimit      Int
  createdAt        DateTime @default(now())
  
  concept          Concept @relation(fields: [conceptId], references: [id])
  attempts         ChallengeAttempt[]
  
  @@index([language, conceptId])
}

model ChallengeAttempt {
  id            String   @id @default(cuid())
  userId        String
  challengeId   String
  code          String
  status        String   // 'passed', 'failed', 'timeout'
  executionTime Int
  testResults   Json
  aiFeedback    String?
  createdAt     DateTime @default(now())
  
  user          User @relation(fields: [userId], references: [id])
  challenge     Challenge @relation(fields: [challengeId], references: [id])
  
  @@index([userId, challengeId, createdAt])
}

model UserConceptMastery {
  id            String   @id @default(cuid())
  userId        String
  conceptId     String
  masteryLevel  Float
  retentionRate Float
  totalReviews  Int
  lastReviewed  DateTime?
  createdAt     DateTime @default(now())
  
  user          User @relation(fields: [userId], references: [id])
  concept       Concept @relation(fields: [conceptId], references: [id])
  
  @@unique([userId, conceptId])
}

model GitHubRepo {
  id           String   @id @default(cuid())
  userId       String
  repoName     String
  optedIn      Boolean  @default(false)
  analysisDate DateTime?
  createdAt    DateTime @default(now())
  
  user         User @relation(fields: [userId], references: [id])
  detections   RepoDetectedConcept[]
}

model RepoDetectedConcept {
  repoId      String
  conceptId   String
  confidence  Float
  detectedAt  DateTime @default(now())
  
  repo        GitHubRepo @relation(fields: [repoId], references: [id])
  concept     Concept @relation(fields: [conceptId], references: [id])
  
  @@id([repoId, conceptId])
}

model Event {
  id        String   @id @default(cuid())
  userId    String
  eventType String
  eventData Json
  createdAt DateTime @default(now())
  
  @@index([userId, eventType, createdAt])
}
```

---

## 7. **UI/UX Wireframes (Text Description)**

### Dashboard Screen
```
┌─────────────────────────────────────────┐
│ CodeMemory                    [Profile] │
├─────────────────────────────────────────┤
│                                         │
│  📚 15 cards due for review today       │
│  [Start Review]                         │
│                                         │
│  🎯 Current Streak: 7 days              │
│  📊 Overall Retention: 87%              │
│                                         │
│  📖 Concepts in Progress:               │
│  ├─ JavaScript Promises (85% mastery)   │
│  ├─ Python Async (45% mastery)          │
│  └─ TypeScript Generics (20% mastery)   │
│                                         │
│  🎮 Available Challenges: 12            │
│  [Browse Challenges]                    │
│                                         │
│  🌳 [View Skill Tree]                   │
│                                         │
└─────────────────────────────────────────┘
```

### Flashcard Review Screen
```
┌─────────────────────────────────────────┐
│ ← Back                        Card 3/15 │
├─────────────────────────────────────────┤
│                                         │
│  Concept: JavaScript Promises           │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │                                   │  │
│  │  How do you handle errors in a    │  │
│  │  Promise chain?                   │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  [Show Answer]                          │
│                                         │
└─────────────────────────────────────────┘

After clicking "Show Answer":

┌─────────────────────────────────────────┐
│ ← Back                        Card 3/15 │
├─────────────────────────────────────────┤
│  Question: How do you handle errors...  │
│                                         │
│  Answer:                                │
│  ┌───────────────────────────────────┐  │
│  │ Use .catch() at the end of the    │  │
│  │ chain, or try/catch with          │  │
│  │ async/await                       │  │
│  │                                   │  │
│  │ ```javascript                     │  │
│  │ promise                           │  │
│  │   .then(...)                      │  │
│  │   .catch(err => console.log(err)) │  │
│  │ ```                               │  │
│  └───────────────────────────────────┘  │
│                                         │
│  How well did you know this?            │
│  [Again] [Hard] [Good] [Easy]           │
│                                         │
└─────────────────────────────────────────┘
```

### Challenge Screen
```
┌─────────────────────────────────────────┐
│ ← Back to Challenges                    │
├─────────────────────────────────────────┤
│  Challenge: Fix the Promise Bug         │
│  Concept: JavaScript Promises           │
│  Difficulty: Stage 3 - Debugging        │
│                                         │
│  Description:                           │
│  This function should log "Done!" after │
│  both operations complete, but it logs  │
│  immediately. Fix the bug.              │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  ┌─ Monaco Editor ──────────────────┐   │
│  │ async function processBatch() {  │   │
│  │   fetchData();                   │   │
│  │   processData();                 │   │
│  │   console.log("Done!");          │   │
│  │ }                                │   │
│  └──────────────────────────────────┘   │
│                                         │
│  [Run Tests] [Get Hint] [Reset Code]   │
│                                         │
├─────────────────────────────────────────┤
│  Test Results:                          │
│  ❌ Test 1: Should log "Done!" last     │
│     Expected: data processed            │
│     Got: "Done!" before data            │
│                                         │
│  💡 Diagnosis:                          │
│  You're not awaiting the async calls.   │
│  The function continues before they     │
│  complete.                              │
│                                         │
└─────────────────────────────────────────┘
```

---

## 8. **Daily Usage Workflow (For Validation)**

### Your Ideal Daily Routine with CodeMemory

**Morning (5-10 minutes)**:
1. Open CodeMemory
2. See "8 cards due today"
3. Review all 8 cards
4. Rate each based on how well you remembered
5. System schedules next review for each

**During Work (As Needed)**:
1. Encounter a concept you're fuzzy on (e.g., "How does Promise.race work?")
2. Quick search in CodeMemory
3. Review relevant flashcards
4. Do a quick challenge if you have time

**Evening/Learning Time (30-60 minutes)**:
1. Pick a new concept you want to learn
2. Go through flashcards for that concept
3. Complete 2-3 challenges for practice
4. System tracks your mastery level

**Week Later**:
1. System shows you the same concepts spaced out
2. Retention check: Can you still solve those challenges?
3. System adapts: If you struggle, shows more frequently

### Validation Questions:
- Does this flow feel natural to you?
- What would you change?
- What's missing?

---

## 9. **Success Criteria for Gate 1 (Your Personal Test)**

Before you consider Gate 1 "done", you should be able to:

### Functional Tests
- [ ] Log in with GitHub
- [ ] See cards due for review
- [ ] Complete a flashcard review session
- [ ] Rate cards (Again/Hard/Good/Easy)
- [ ] See correct next review dates (FSRS working)
- [ ] Open a challenge
- [ ] Write code in Monaco Editor
- [ ] Execute code (any supported language)
- [ ] See test pass/fail results
- [ ] See basic diagnosis for failures
- [ ] View progress dashboard
- [ ] Add a new concept pack (via direct DB insert for now)

### Learning Tests (The Real Validation)
- [ ] Use CodeMemory for 2 weeks yourself
- [ ] Can you remember concepts after 7 days? (>70% success)
- [ ] Can you remember concepts after 14 days? (>60% success)
- [ ] Does it feel faster/better than your current method?
- [ ] Would you keep using it?

**If you answer "no" to any learning test, the product isn't working yet.**

---

## 10. **Quick Start Checklist (Do These in Order)**

### Week 1: Content + Design
- [ ] Choose your first concept (what are you learning RIGHT NOW?)
- [ ] Create 10 flashcards for that concept
- [ ] Create 5 challenges with tests
- [ ] Document common misconceptions
- [ ] Sketch UI flow on paper/Figma

### Week 2: Foundation
- [ ] Set up Next.js project
- [ ] Set up Prisma + PostgreSQL
- [ ] Set up NextAuth with GitHub
- [ ] Create database schema
- [ ] Seed database with your first concept pack

### Week 3: Core Loop - Part 1 (Review)
- [ ] Build flashcard review UI
- [ ] Implement FSRS scheduling
- [ ] Build rating interface
- [ ] Test review flow manually

### Week 4: Core Loop - Part 2 (Practice)
- [ ] Integrate Monaco Editor
- [ ] Build Piston API integration
- [ ] Create test runner
- [ ] Build results display
- [ ] Test challenge flow manually

### Week 5: Polish + Self-Test
- [ ] Build dashboard
- [ ] Add progress tracking
- [ ] Deploy to Vercel
- [ ] Use it yourself for concept you're learning

### Week 6+: Iterate Based on Your Usage
- [ ] Fix what's annoying you
- [ ] Add concepts as you need them
- [ ] Improve what's not working
- [ ] Decide if you want to add more features (Gate 2)

---

## Decision Points

### Before You Start, Decide:

1. **What's your FIRST concept?**
   - Pick something you're actively learning this week
   - Not something you already know well
   - Not something you don't need yet

2. **What language(s) for Gate 1?**
   - Start with 1-2 languages you use most
   - Don't try to support everything day 1
   - Add more as YOU need them

3. **Where will you deploy?**
   - Vercel (recommended for Next.js)
   - Netlify
   - Your own VPS

4. **Database choice?**
   - Neon (serverless Postgres, free tier)
   - Supabase (Postgres + auth + storage)
   - Local Postgres (development only)
   - Railway/Render

5. **How much time can you commit?**
   - 2-3 hours/day → 6-8 weeks to Gate 1
   - 1 hour/day → 10-12 weeks to Gate 1
   - Few hours/week → 3-4 months to Gate 1

---

## One More Thing: The "Promises Pack" Template

Since you mentioned Promises, here's a starter template you can fill in:

**Create this file**: `/content/javascript-promises.md`

```markdown
# JavaScript Promises

## Flashcards

### 1. Syntax Recall
**Q**: How do you create a Promise that resolves with value 42?
**A**: `new Promise(resolve => resolve(42))` or `Promise.resolve(42)`

### 2. Syntax Recall
**Q**: How do you create a Promise that rejects with an error?
**A**: `new Promise((resolve, reject) => reject(new Error('Failed')))` or `Promise.reject(new Error('Failed'))`

### 3. Concept Explanation
**Q**: What are the three states of a Promise?
**A**: Pending, Fulfilled (resolved), Rejected

### 4. Concept Explanation
**Q**: Why can't you cancel a Promise once it's created?
**A**: Promises are eager, not lazy. They execute immediately when created. Use AbortController for cancellable operations.

[... continue for all 10 cards]

## Challenges

### Challenge 1: Create a delay function
**Starter Code**:
```javascript
// Create a function that returns a Promise that resolves after ms milliseconds
function delay(ms) {
  // Your code here
}

// Test
delay(1000).then(() => console.log("Done!"));
```

**Tests**:
- Should resolve after specified time
- Should not resolve early
- Should handle 0ms

[... continue for all 5 challenges]
```

Fill this out BEFORE you write any app code. This is your first real artifact.

---

## What's Next?

You now have everything you need to start. The question is:

**What will you do first?**

1. Create your first concept pack? (Recommended)
2. Set up the tech stack?
3. Design the UI?
4. Something else?

Tell me what you want to tackle first, and I'll help you execute.
