import { describe, it, expect, beforeEach } from 'vitest'
import {
  initializeGuestProgress,
  getGuestProgress,
  saveGuestProgress,
  getCardProgress,
  updateCardProgress,
  getDueCards,
  clearGuestData,
  addReviewToHistory,
  getReviewHistory,
  getStreakData,
  getGuestStats,
  GuestCardProgress,
} from './guest-store'
import type { FSRSCardData } from './fsrs-scheduler'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('guest-store', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  describe('initializeGuestProgress', () => {
    it('initializes progress for new flashcards', () => {
      const ids = ['card-1', 'card-2', 'card-3']
      initializeGuestProgress(ids)

      const progress = getGuestProgress()
      expect(progress).toHaveLength(3)
      expect(progress.map(p => p.flashcardId)).toEqual(ids)
    })

    it('does not duplicate existing progress', () => {
      initializeGuestProgress(['card-1'])
      initializeGuestProgress(['card-1', 'card-2'])

      const progress = getGuestProgress()
      expect(progress).toHaveLength(2)
    })

    it('sets new cards with correct initial state', () => {
      initializeGuestProgress(['card-1'])

      const card = getCardProgress('card-1')
      expect(card).not.toBeNull()
      expect(card!.state).toBe(0) // New
      expect(card!.reps).toBe(0)
      expect(card!.lapses).toBe(0)
    })
  })

  describe('getCardProgress / updateCardProgress', () => {
    it('returns null for non-existent card', () => {
      const progress = getCardProgress('non-existent')
      expect(progress).toBeNull()
    })

    it('updates card progress', () => {
      initializeGuestProgress(['card-1'])

      const cardData: FSRSCardData = {
        stability: 5.0,
        difficulty: 5.0,
        elapsedDays: 1,
        scheduledDays: 3,
        reps: 1,
        lapses: 0,
        state: 2,
        lastReview: new Date(),
      }
      const nextReview = new Date(Date.now() + 3 * 86400000)

      updateCardProgress('card-1', cardData, nextReview)

      const updated = getCardProgress('card-1')
      expect(updated).not.toBeNull()
      expect(updated!.reps).toBe(1)
      expect(updated!.stability).toBe(5.0)
    })
  })

  describe('getDueCards', () => {
    it('returns cards that are due', () => {
      const pastDue: GuestCardProgress = {
        flashcardId: 'past-due',
        due: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        stability: 0,
        difficulty: 0,
        elapsed_days: 0,
        scheduled_days: 0,
        reps: 0,
        lapses: 0,
        state: 0,
        last_review: null,
      }
      const futureDue: GuestCardProgress = {
        flashcardId: 'future-due',
        due: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        stability: 0,
        difficulty: 0,
        elapsed_days: 0,
        scheduled_days: 0,
        reps: 0,
        lapses: 0,
        state: 0,
        last_review: null,
      }

      saveGuestProgress([pastDue, futureDue])

      const dueCards = getDueCards()
      expect(dueCards).toHaveLength(1)
      expect(dueCards[0].flashcardId).toBe('past-due')
    })
  })

  describe('clearGuestData', () => {
    it('clears all guest data', () => {
      initializeGuestProgress(['card-1'])
      addReviewToHistory('card-1', 3)

      clearGuestData()

      expect(getGuestProgress()).toHaveLength(0)
      expect(getReviewHistory()).toHaveLength(0)
    })
  })

  describe('streak tracking', () => {
    it('starts with empty streak', () => {
      const streak = getStreakData()
      expect(streak.currentStreak).toBe(0)
      expect(streak.longestStreak).toBe(0)
    })

    it('starts streak on first review', () => {
      addReviewToHistory('card-1', 3)

      const streak = getStreakData()
      expect(streak.currentStreak).toBe(1)
      expect(streak.totalReviewDays).toBe(1)
    })

    it('does not double count same day reviews', () => {
      addReviewToHistory('card-1', 3)
      addReviewToHistory('card-2', 4)

      const streak = getStreakData()
      expect(streak.currentStreak).toBe(1)
      expect(streak.totalReviewDays).toBe(1)
    })
  })

  describe('getGuestStats', () => {
    it('returns correct stats', () => {
      const pastDue: GuestCardProgress = {
        flashcardId: 'past-due',
        due: new Date(Date.now() - 86400000).toISOString(),
        stability: 0,
        difficulty: 0,
        elapsed_days: 0,
        scheduled_days: 0,
        reps: 0,
        lapses: 0,
        state: 0,
        last_review: null,
      }
      const reviewedToday: GuestCardProgress = {
        flashcardId: 'reviewed',
        due: new Date(Date.now() + 86400000).toISOString(),
        stability: 5,
        difficulty: 5,
        elapsed_days: 0,
        scheduled_days: 1,
        reps: 1,
        lapses: 0,
        state: 2,
        last_review: new Date().toISOString(),
      }

      saveGuestProgress([pastDue, reviewedToday])

      const stats = getGuestStats()
      expect(stats.totalCards).toBe(2)
      expect(stats.dueCards).toBe(1)
      expect(stats.reviewedToday).toBe(1)
    })
  })
})
