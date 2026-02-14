import { FSRS, Card, Rating, createEmptyCard, State } from "ts-fsrs";

export interface FSRSCardData {
  stability: number;
  difficulty: number;
  elapsedDays: number;
  scheduledDays: number;
  reps: number;
  lapses: number;
  state: number;
  lastReview: Date | null;
}

export class FSRSScheduler {
  private fsrs: FSRS;

  constructor() {
    // Initialize with default parameters
    // TODO: Support per-user parameters from UserFSRSParams table
    this.fsrs = new FSRS({});
  }

  /**
   * Convert database card data to ts-fsrs Card format
   */
  private toFSRSCard(data: FSRSCardData): Card {
    return {
      stability: data.stability,
      difficulty: data.difficulty,
      elapsed_days: data.elapsedDays,
      scheduled_days: data.scheduledDays,
      reps: data.reps,
      lapses: data.lapses,
      state: data.state as State,
      last_review: data.lastReview ?? undefined,
      due: new Date(), // Will be recalculated
    };
  }

  /**
   * Create a new card (for first review)
   */
  createNewCard(): Card {
    return createEmptyCard();
  }

  /**
   * Review a card and get next scheduled date
   * @param cardData Current card state from database
   * @param rating User's rating (Again=1, Hard=2, Good=3, Easy=4)
   * @param reviewDate Date of review (defaults to now)
   * @returns Updated card data and next review date
   */
  reviewCard(
    cardData: FSRSCardData | null,
    rating: Rating,
    reviewDate: Date = new Date()
  ): FSRSCardData & { nextReview: Date } {
    // If no card data, this is a new card
    const card = cardData ? this.toFSRSCard(cardData) : this.createNewCard();

    // Schedule with the given rating
    const recordLog = this.fsrs.next(card, reviewDate, rating as unknown as number);

    // Convert back to database format
    return {
      stability: recordLog.card.stability,
      difficulty: recordLog.card.difficulty,
      elapsedDays: recordLog.card.elapsed_days,
      scheduledDays: recordLog.card.scheduled_days,
      reps: recordLog.card.reps,
      lapses: recordLog.card.lapses,
      state: recordLog.card.state,
      lastReview: reviewDate,
      nextReview: recordLog.card.due,
    };
  }

  /**
   * Get all possible outcomes for a card review (for preview)
   * @param cardData Current card state
   * @param reviewDate Date of review
   * @returns Object with outcomes for each rating
   */
  previewOutcomes(
    cardData: FSRSCardData | null,
    reviewDate: Date = new Date()
  ): Partial<Record<Rating, { nextReview: Date; scheduledDays: number }>> {
    const card = cardData ? this.toFSRSCard(cardData) : this.createNewCard();
    const recordLog = this.fsrs.repeat(card, reviewDate);

    return {
      [Rating.Again]: {
        nextReview: recordLog[Rating.Again].card.due,
        scheduledDays: recordLog[Rating.Again].card.scheduled_days,
      },
      [Rating.Hard]: {
        nextReview: recordLog[Rating.Hard].card.due,
        scheduledDays: recordLog[Rating.Hard].card.scheduled_days,
      },
      [Rating.Good]: {
        nextReview: recordLog[Rating.Good].card.due,
        scheduledDays: recordLog[Rating.Good].card.scheduled_days,
      },
      [Rating.Easy]: {
        nextReview: recordLog[Rating.Easy].card.due,
        scheduledDays: recordLog[Rating.Easy].card.scheduled_days,
      },
    };
  }
}

// Export Rating enum for use in other modules
export { Rating };
