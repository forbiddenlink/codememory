// Type definitions for CodeMemory application

import { Card as FSRSCard } from "ts-fsrs";

// ============================================================================
// Database Model Types (matching Prisma schema)
// ============================================================================

export interface User {
  id: string;
  githubId: string;
  email: string;
  username: string;
  name?: string;
  image?: string;
  createdAt: Date;
  lastActive: Date;
}

export interface Concept {
  id: string;
  name: string;
  category: string;
  description: string;
  difficulty: number; // 1-5
  language?: string;
  createdAt: Date;
}

export interface Flashcard {
  id: string;
  conceptId: string;
  type: FlashcardType;
  front: string;
  back: string;
  codeExample?: string;
  createdAt: Date;
}

export interface UserCardProgress {
  id: string;
  userId: string;
  flashcardId: string;
  stability: number;
  difficulty: number;
  elapsedDays: number;
  scheduledDays: number;
  reps: number;
  lapses: number;
  state: CardState;
  lastReview?: Date;
  nextReview: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Challenge {
  id: string;
  conceptId: string;
  title: string;
  description: string;
  language: string;
  stage: ChallengeStage;
  difficulty: ChallengeDifficulty;
  starterCode: string;
  solutionTemplate?: string;
  testCases: TestCase[];
  hints: string[];
  timeLimit: number;
  memoryLimit: number;
  createdAt: Date;
}

export interface ChallengeAttempt {
  id: string;
  userId: string;
  challengeId: string;
  code: string;
  status: AttemptStatus;
  executionTime: number;
  testResults: TestResult[];
  aiFeedback?: string;
  createdAt: Date;
}

export interface UserConceptMastery {
  id: string;
  userId: string;
  conceptId: string;
  masteryLevel: number; // 0-100
  retentionRate: number; // 0-100
  totalReviews: number;
  lastReviewed?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Enums and Constants
// ============================================================================

export type FlashcardType = "syntax" | "concept" | "prediction" | "bug" | "use_case";

export enum CardState {
  New = 0,
  Learning = 1,
  Review = 2,
  Relearning = 3,
}

export type ChallengeStage = 1 | 2 | 3 | 4 | 5;
// 1: Syntax Recall (fill blanks)
// 2: Code Completion (complete partial code)
// 3: Debugging (fix bugs)
// 4: Optimization (improve code)
// 5: Full Implementation (build from scratch)

export type ChallengeDifficulty = "beginner" | "intermediate" | "advanced";

export type AttemptStatus = "passed" | "failed" | "timeout" | "error";

// ============================================================================
// Test Case Types
// ============================================================================

export interface TestCase {
  input: string;
  expected: string;
  description: string;
}

export interface TestResult {
  test: string;
  passed: boolean;
  expected: string;
  actual: string;
  error?: string;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface DueCardsResponse {
  cards: (UserCardProgress & {
    flashcard: Flashcard & {
      concept: Concept;
    };
  })[];
}

export interface ReviewResponse {
  success: boolean;
  nextReview: Date;
  card: UserCardProgress;
}

export interface ChallengeExecutionResponse {
  status: AttemptStatus;
  executionTime: number;
  testResults: TestResult[];
  diagnosis?: string;
}

// ============================================================================
// Piston API Types
// ============================================================================

export interface PistonExecuteRequest {
  language: string;
  version: string;
  files: Array<{
    name: string;
    content: string;
  }>;
  stdin?: string;
  args?: string[];
  compile_timeout?: number;
  run_timeout?: number;
  compile_memory_limit?: number;
  run_memory_limit?: number;
}

export interface PistonExecuteResponse {
  run: {
    stdout: string;
    stderr: string;
    code: number;
    signal: string | null;
    output: string;
  };
  compile?: {
    stdout: string;
    stderr: string;
    code: number;
    signal: string | null;
    output: string;
  };
}

export interface PistonLanguage {
  language: string;
  version: string;
  aliases: string[];
}

// ============================================================================
// FSRS Types (re-export from ts-fsrs with custom extensions)
// ============================================================================

export type { FSRSCard };

export interface FSRSReviewOutcome {
  card: FSRSCard;
  nextReview: Date;
  scheduledDays: number;
}

// ============================================================================
// UI Component Props
// ============================================================================

export interface FlashcardProps {
  card: Flashcard & { concept: Concept };
  onRate: (rating: number) => void;
  showAnswer: boolean;
  onShowAnswer: () => void;
}

export interface ChallengeEditorProps {
  challenge: Challenge;
  onSubmit: (code: string) => Promise<void>;
  onTest: (code: string) => Promise<TestResult[]>;
}

export interface ConceptCardProps {
  concept: Concept;
  mastery?: UserConceptMastery;
  onClick?: () => void;
}

// ============================================================================
// Form Types
// ============================================================================

export interface CreateConceptForm {
  name: string;
  category: string;
  description: string;
  difficulty: number;
  language?: string;
}

export interface CreateFlashcardForm {
  conceptId: string;
  type: FlashcardType;
  front: string;
  back: string;
  codeExample?: string;
}

export interface CreateChallengeForm {
  conceptId: string;
  title: string;
  description: string;
  language: string;
  stage: ChallengeStage;
  difficulty: ChallengeDifficulty;
  starterCode: string;
  solutionTemplate?: string;
  testCases: TestCase[];
  hints: string[];
}

// ============================================================================
// Analytics Types
// ============================================================================

export interface UserStats {
  totalCards: number;
  dueToday: number;
  reviewedToday: number;
  currentStreak: number;
  longestStreak: number;
  averageRetention: number;
  conceptsMastered: number;
  challengesCompleted: number;
}

export interface ConceptProgress {
  concept: Concept;
  mastery: UserConceptMastery;
  cardCount: number;
  dueCount: number;
  averageStability: number;
}

// ============================================================================
// Event Types
// ============================================================================

export type EventType =
  | "card_reviewed"
  | "challenge_attempted"
  | "challenge_completed"
  | "concept_mastered"
  | "streak_milestone"
  | "repo_analyzed";

export interface Event {
  id: string;
  userId: string;
  eventType: EventType;
  eventData: Record<string, unknown>;
  createdAt: Date;
}
