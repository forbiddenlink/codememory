import { describe, it, expect, beforeEach } from 'vitest'
import { FSRSScheduler, FSRSCardData, Rating } from './fsrs-scheduler'

describe('FSRSScheduler', () => {
  let scheduler: FSRSScheduler

  beforeEach(() => {
    scheduler = new FSRSScheduler()
  })

  describe('createNewCard', () => {
    it('creates a new card with default values', () => {
      const card = scheduler.createNewCard()

      expect(card).toBeDefined()
      expect(card.stability).toBe(0)
      expect(card.difficulty).toBe(0)
      expect(card.reps).toBe(0)
      expect(card.lapses).toBe(0)
    })
  })

  describe('reviewCard', () => {
    it('reviews a new card with Good rating', () => {
      const result = scheduler.reviewCard(null, Rating.Good)

      expect(result).toBeDefined()
      expect(result.reps).toBe(1)
      expect(result.lastReview).toBeInstanceOf(Date)
      expect(result.nextReview).toBeInstanceOf(Date)
      expect(result.nextReview.getTime()).toBeGreaterThan(Date.now())
    })

    it('reviews a new card with Again rating', () => {
      const result = scheduler.reviewCard(null, Rating.Again)

      expect(result.reps).toBe(1)
      expect(result.lapses).toBe(0) // First review, no lapses yet
    })

    it('schedules cards further out for Easy rating', () => {
      const goodResult = scheduler.reviewCard(null, Rating.Good)
      const easyResult = scheduler.reviewCard(null, Rating.Easy)

      // Easy should schedule further than Good
      expect(easyResult.scheduledDays).toBeGreaterThanOrEqual(goodResult.scheduledDays)
    })

    it('handles existing card data', () => {
      const existingCard: FSRSCardData = {
        stability: 5.0,
        difficulty: 5.0,
        elapsedDays: 1,
        scheduledDays: 1,
        reps: 3,
        lapses: 1,
        state: 2, // Review state
        lastReview: new Date(Date.now() - 86400000), // 1 day ago
      }

      const result = scheduler.reviewCard(existingCard, Rating.Good)

      expect(result.reps).toBe(4) // Incremented
      expect(result.stability).toBeGreaterThan(0)
    })
  })

  describe('previewOutcomes', () => {
    it('returns outcomes for all ratings', () => {
      const outcomes = scheduler.previewOutcomes(null)

      expect(outcomes[Rating.Again]).toBeDefined()
      expect(outcomes[Rating.Hard]).toBeDefined()
      expect(outcomes[Rating.Good]).toBeDefined()
      expect(outcomes[Rating.Easy]).toBeDefined()
    })

    it('shows increasing intervals for higher ratings', () => {
      const outcomes = scheduler.previewOutcomes(null)

      const againDays = outcomes[Rating.Again]!.scheduledDays
      const goodDays = outcomes[Rating.Good]!.scheduledDays
      const easyDays = outcomes[Rating.Easy]!.scheduledDays

      // Easy should be >= Good, Good should be >= Again
      expect(easyDays).toBeGreaterThanOrEqual(goodDays)
      expect(goodDays).toBeGreaterThanOrEqual(againDays)
    })

    it('works with existing card data', () => {
      const existingCard: FSRSCardData = {
        stability: 10.0,
        difficulty: 5.0,
        elapsedDays: 5,
        scheduledDays: 5,
        reps: 5,
        lapses: 0,
        state: 2,
        lastReview: new Date(Date.now() - 5 * 86400000),
      }

      const outcomes = scheduler.previewOutcomes(existingCard)

      expect(outcomes[Rating.Good]).toBeDefined()
      expect(outcomes[Rating.Good]!.nextReview).toBeInstanceOf(Date)
    })
  })
})
