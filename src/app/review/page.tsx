"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { getDueCards, updateCardProgress, getCardProgress, addReviewToHistory } from "@/lib/guest-store";
import { FSRSScheduler } from "@/lib/fsrs-scheduler";
import { ArrowLeft, PartyPopper } from "lucide-react";

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

  useEffect(() => {
    fetchDueCards();
  }, [session]);

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
          handleReview(ratingMap[e.key]);
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showAnswer, submitting]);

  const fetchDueCards = async () => {
    try {
      if (!session) {
        // Guest mode
        setIsGuest(true);
        const dueProgress = getDueCards();
        
        if (dueProgress.length === 0) {
          router.push("/dashboard");
          return;
        }

        // Fetch full flashcard data for due cards
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
        // Authenticated mode
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
  };

  const handleReview = async (rating: number) => {
    if (submitting) return;
    
    setSubmitting(true);
    const currentCard = cards[currentIndex];

    try {
      if (isGuest) {
        // Guest mode: update localStorage
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
          
          // Track in history for analytics
          addReviewToHistory(
            currentCard.flashcard.id, 
            rating,
            currentCard.flashcard.concept.name
          );
        }
      } else {
        // Authenticated mode: call API
        const response = await fetch(
          `/api/cards/${currentCard.flashcard.id}/review`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ rating }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to review card");
        }
      }

      // Move to next card
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowAnswer(false);
      } else {
        // All cards reviewed
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error reviewing card:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-2xl shadow-xl p-12 max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <PartyPopper className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            All Caught Up!
          </h2>
          <p className="text-gray-600 mb-8">
            No cards due for review right now. Great work on staying consistent!
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const { flashcard } = currentCard;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link
              href="/dashboard"
              className="text-blue-600 hover:text-blue-700"
            >
              ← Back
            </Link>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Card {currentIndex + 1} / {cards.length}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {flashcard.concept.category}
            {flashcard.concept.language && ` • ${flashcard.concept.language}`}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {flashcard.concept.name}
          </h2>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6 min-h-[400px] flex flex-col justify-center">
          {/* Question */}
          <div className="mb-8">
            <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase">
              Question
            </div>
            <div className="text-xl text-gray-900 dark:text-white whitespace-pre-wrap">
              {flashcard.front}
            </div>
          </div>

          {/* Answer (shown after clicking) */}
          {showAnswer && (
            <>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase">
                  Answer
                </div>
                <div className="text-xl text-gray-900 dark:text-white whitespace-pre-wrap mb-4">
                  {flashcard.back}
                </div>
              </div>

              {flashcard.codeExample && (
                <div className="mt-4">
                  <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase">
                    Example
                  </div>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <code>{flashcard.codeExample}</code>
                  </pre>
                </div>
              )}
            </>
          )}
        </div>

        {/* Actions */}
        {!showAnswer ? (
          <div className="flex justify-center">
            <button
              onClick={() => setShowAnswer(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors text-lg"
            >
              Show Answer <span className="text-sm ml-2">(Space / Enter)</span>
            </button>
          </div>
        ) : (
          <div>
            <div className="text-center mb-4 text-gray-700 dark:text-gray-300">
              How well did you know this?
            </div>
            <div className="grid grid-cols-4 gap-3">
              <button
                onClick={() => handleReview(1)}
                disabled={submitting}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold px-4 py-3 rounded-lg transition-colors"
              >
                <div className="text-sm">Again</div>
                <div className="text-xs opacity-80">{"<1m (1)"}</div>
              </button>
              <button
                onClick={() => handleReview(2)}
                disabled={submitting}
                className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-semibold px-4 py-3 rounded-lg transition-colors"
              >
                <div className="text-sm">Hard</div>
                <div className="text-xs opacity-80">(2)</div>
              </button>
              <button
                onClick={() => handleReview(3)}
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold px-4 py-3 rounded-lg transition-colors"
              >
                <div className="text-sm">Good</div>
                <div className="text-xs opacity-80">(3)</div>
              </button>
              <button
                onClick={() => handleReview(4)}
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-4 py-3 rounded-lg transition-colors"
              >
                <div className="text-sm">Easy</div>
                <div className="text-xs opacity-80">(4)</div>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
