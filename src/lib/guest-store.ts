/**
 * Guest Store - localStorage-based storage for guest users
 * 
 * Portfolio Mode: Allows visitors to try the app without authentication.
 * Progress is stored in browser localStorage and persists per-browser.
 */

import type { FSRSCardData } from './fsrs-scheduler';

export interface GuestCardProgress {
  flashcardId: string;
  due: string;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  reps: number;
  lapses: number;
  state: number; // 0=New, 1=Learning, 2=Review, 3=Relearning
  last_review: string | null;
}

export interface GuestChallengeAttempt {
  challengeId: string;
  code: string;
  passed: boolean;
  timestamp: string;
}

export interface ReviewHistory {
  cardId: string;
  date: string; // YYYY-MM-DD
  rating: number;
  conceptId?: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastReviewDate: string; // YYYY-MM-DD
  totalReviewDays: number;
}

const GUEST_PROGRESS_KEY = 'codememory_guest_progress';
const GUEST_CHALLENGES_KEY = 'codememory_guest_challenges';
const GUEST_HISTORY_KEY = 'codememory_guest_history';
const GUEST_STREAK_KEY = 'codememory_guest_streak';

/**
 * Initialize progress for all flashcards on first visit
 */
export function initializeGuestProgress(flashcardIds: string[]): void {
  const existing = getGuestProgress();
  const existingIds = new Set(existing.map(p => p.flashcardId));
  
  const newProgress: GuestCardProgress[] = flashcardIds
    .filter(id => !existingIds.has(id))
    .map(id => ({
      flashcardId: id,
      due: new Date().toISOString(),
      stability: 0,
      difficulty: 0,
      elapsed_days: 0,
      scheduled_days: 0,
      reps: 0,
      lapses: 0,
      state: 0, // New
      last_review: null,
    }));

  if (newProgress.length > 0) {
    saveGuestProgress([...existing, ...newProgress]);
  }
}

/**
 * Get all guest progress from localStorage
 */
export function getGuestProgress(): GuestCardProgress[] {
  if (typeof window === 'undefined') return [];
  
  const data = localStorage.getItem(GUEST_PROGRESS_KEY);
  if (!data) return [];
  
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

/**
 * Save guest progress to localStorage
 */
export function saveGuestProgress(progress: GuestCardProgress[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GUEST_PROGRESS_KEY, JSON.stringify(progress));
}

/**
 * Get progress for a specific card
 */
export function getCardProgress(flashcardId: string): GuestCardProgress | null {
  const progress = getGuestProgress();
  return progress.find(p => p.flashcardId === flashcardId) || null;
}

/**
 * Update progress for a specific card after review
 */
export function updateCardProgress(flashcardId: string, cardData: FSRSCardData, nextReview: Date): void {
  const progress = getGuestProgress();
  const index = progress.findIndex(p => p.flashcardId === flashcardId);

  const updated: GuestCardProgress = {
    flashcardId,
    due: nextReview.toISOString(),
    stability: cardData.stability,
    difficulty: cardData.difficulty,
    elapsed_days: cardData.elapsedDays,
    scheduled_days: cardData.scheduledDays,
    reps: cardData.reps,
    lapses: cardData.lapses,
    state: cardData.state,
    last_review: new Date().toISOString(),
  };
  
  if (index >= 0) {
    progress[index] = updated;
  } else {
    progress.push(updated);
  }
  
  saveGuestProgress(progress);
}

/**
 * Get all due cards
 */
export function getDueCards(): GuestCardProgress[] {
  const progress = getGuestProgress();
  const now = new Date();
  return progress.filter(p => new Date(p.due) <= now);
}

/**
 * Get guest challenge attempts
 */
export function getGuestChallenges(): GuestChallengeAttempt[] {
  if (typeof window === 'undefined') return [];
  
  const data = localStorage.getItem(GUEST_CHALLENGES_KEY);
  if (!data) return [];
  
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

/**
 * Save challenge attempt
 */
export function saveChallengeAttempt(attempt: GuestChallengeAttempt): void {
  if (typeof window === 'undefined') return;
  
  const attempts = getGuestChallenges();
  attempts.push(attempt);
  localStorage.setItem(GUEST_CHALLENGES_KEY, JSON.stringify(attempts));
}

/**
 * Clear all guest data (for "Start Over" feature)
 */
export function clearGuestData(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(GUEST_PROGRESS_KEY);
  localStorage.removeItem(GUEST_CHALLENGES_KEY);
  localStorage.removeItem(GUEST_HISTORY_KEY);
  localStorage.removeItem(GUEST_STREAK_KEY);
}

/**
 * Add review to history and update streak
 */
export function addReviewToHistory(cardId: string, rating: number, conceptId?: string): void {
  if (typeof window === 'undefined') return;
  
  const today = new Date().toISOString().split('T')[0];
  
  // Add to history
  const history = getReviewHistory();
  history.push({ cardId, date: today, rating, conceptId });
  localStorage.setItem(GUEST_HISTORY_KEY, JSON.stringify(history));
  
  // Update streak
  updateStreak(today);
}

/**
 * Get review history
 */
export function getReviewHistory(): ReviewHistory[] {
  if (typeof window === 'undefined') return [];
  
  const data = localStorage.getItem(GUEST_HISTORY_KEY);
  if (!data) return [];
  
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

/**
 * Update streak data
 */
function updateStreak(today: string): void {
  if (typeof window === 'undefined') return;
  
  const streak = getStreakData();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  if (streak.lastReviewDate === today) {
    // Already reviewed today, no change to streak
    return;
  }
  
  if (streak.lastReviewDate === yesterdayStr) {
    // Continuing streak
    streak.currentStreak += 1;
    streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
  } else if (streak.lastReviewDate === '') {
    // First review ever
    streak.currentStreak = 1;
    streak.longestStreak = 1;
  } else {
    // Streak broken
    streak.currentStreak = 1;
  }
  
  streak.lastReviewDate = today;
  streak.totalReviewDays += 1;
  
  localStorage.setItem(GUEST_STREAK_KEY, JSON.stringify(streak));
}

/**
 * Get streak data
 */
export function getStreakData(): StreakData {
  if (typeof window === 'undefined') {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastReviewDate: '',
      totalReviewDays: 0
    };
  }
  
  const data = localStorage.getItem(GUEST_STREAK_KEY);
  if (!data) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastReviewDate: '',
      totalReviewDays: 0
    };
  }
  
  try {
    return JSON.parse(data);
  } catch {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastReviewDate: '',
      totalReviewDays: 0
    };
  }
}

/**
 * Get stats for dashboard
 */
export function getGuestStats() {
  const progress = getGuestProgress();
  const dueCards = getDueCards();
  
  return {
    totalCards: progress.length,
    dueCards: dueCards.length,
    reviewedToday: progress.filter(p => {
      if (!p.last_review) return false;
      const lastReview = new Date(p.last_review);
      const today = new Date();
      return lastReview.toDateString() === today.toDateString();
    }).length,
  };
}
