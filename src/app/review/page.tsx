"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getDueCards, updateCardProgress, getCardProgress, addReviewToHistory } from "@/lib/guest-store";
import { FSRSScheduler } from "@/lib/fsrs-scheduler";
import {
  LoadingState,
  AllCaughtUp,
  ReviewNav,
  FlashcardDisplay,
  RatingButtons,
} from "@/components/review";

interface Flashcard {
  id: string;
  type: string;
  front: string;
  back: string;
  codeExample: string | null;
  concept: {
    name: string;
    category: string;
    language: string | null;
  };
}

interface CardProgress {
  id: string;
  flashcard: Flashcard;
  nextReview: string;
  reps: number;
  state: number;
}

export default function ReviewPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [cards, setCards] = useState<CardProgress[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  const fetchDueCards = useCallback(async () => {
    try {
      if (!session) {
        setIsGuest(true);
        const dueProgress = getDueCards();

        if (dueProgress.length === 0) {
          router.push("/dashboard");
          return;
        }

        const flashcardPromises = dueProgress.map(async (p) => {
          const response = await fetch(`/api/flashcards/${p.flashcardId}`);
          if (response.ok) {
            const data = await response.json();
            return {
              id: p.flashcardId,
              flashcard: data.flashcard,
              nextReview: p.due,
              reps: p.reps,
              state: p.state,
            };
          }
          return null;
        });

        const flashcardsData = (await Promise.all(flashcardPromises)).filter(Boolean) as CardProgress[];
        setCards(flashcardsData);
      } else {
        const response = await fetch("/api/cards/due");
        if (response.ok) {
          const data = await response.json();
          setCards(data.cards);
        }
      }
    } catch (error) {
      console.error("Error fetching cards:", error);
    } finally {
      setLoading(false);
    }
  }, [router, session]);

  const handleReview = useCallback(async (rating: number) => {
    if (submitting) return;

    setSubmitting(true);
    const currentCard = cards[currentIndex];
    if (!currentCard) {
      setSubmitting(false);
      return;
    }

    try {
      if (isGuest) {
        const scheduler = new FSRSScheduler();
        const guestProgress = getCardProgress(currentCard.flashcard.id);

        if (guestProgress) {
          const cardData = {
            stability: guestProgress.stability,
            difficulty: guestProgress.difficulty,
            elapsedDays: guestProgress.elapsed_days,
            scheduledDays: guestProgress.scheduled_days,
            reps: guestProgress.reps,
            lapses: guestProgress.lapses,
            state: guestProgress.state,
            lastReview: guestProgress.last_review ? new Date(guestProgress.last_review) : null,
          };

          const result = scheduler.reviewCard(cardData, rating as 1 | 2 | 3 | 4);
          updateCardProgress(currentCard.flashcard.id, result, result.nextReview);

          addReviewToHistory(
            currentCard.flashcard.id,
            rating,
            currentCard.flashcard.concept.name
          );
        }
      } else {
        const response = await fetch(
          `/api/cards/${currentCard.flashcard.id}/review`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rating }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to review card");
        }
      }

      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowAnswer(false);
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error reviewing card:", error);
    } finally {
      setSubmitting(false);
    }
  }, [cards, currentIndex, isGuest, router, submitting]);

  useEffect(() => {
    void fetchDueCards();
  }, [fetchDueCards]);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyPress(e: KeyboardEvent) {
      if (submitting) return;

      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (!showAnswer) {
          setShowAnswer(true);
        }
      } else if (showAnswer) {
        const ratingMap: Record<string, number> = {
          "1": 1,
          "2": 2,
          "3": 3,
          "4": 4,
        };

        if (ratingMap[e.key]) {
          e.preventDefault();
          void handleReview(ratingMap[e.key]);
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleReview, showAnswer, submitting]);

  if (loading) {
    return <LoadingState />;
  }

  if (cards.length === 0) {
    return <AllCaughtUp />;
  }

  const currentCard = cards[currentIndex];
  const { flashcard } = currentCard;

  return (
    <div className="min-h-screen bg-background">
      <ReviewNav currentIndex={currentIndex} totalCards={cards.length} />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        <h1 className="sr-only">Review Session</h1>
        <div className="mb-4">
          <div className="text-xs text-tertiary mb-1">
            {flashcard.concept.category}
            {flashcard.concept.language && ` • ${flashcard.concept.language}`}
          </div>
          <h2 className="text-lg font-semibold text-foreground">
            {flashcard.concept.name}
          </h2>
        </div>

        <FlashcardDisplay
          front={flashcard.front}
          back={flashcard.back}
          codeExample={flashcard.codeExample}
          showAnswer={showAnswer}
        />

        {!showAnswer ? (
          <div className="flex justify-center">
            <button
              onClick={() => setShowAnswer(true)}
              className="bg-accent hover:bg-accent-hover text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
            >
              Show Answer <span className="text-xs ml-2 opacity-75">(Space)</span>
            </button>
          </div>
        ) : (
          <RatingButtons onRate={handleReview} disabled={submitting} />
        )}
      </main>
    </div>
  );
}
