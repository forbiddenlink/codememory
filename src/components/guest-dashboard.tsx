"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { initializeGuestProgress, getGuestStats, getStreakData } from "@/lib/guest-store";
import { BookOpen, Code, TrendingUp, Play, ChevronDown, ChevronUp, Sparkles, Target, ArrowRight, BarChart3, Flame } from "lucide-react";

interface Concept {
  id: string;
  name: string;
  description: string;
  flashcardCount: number;
  challengeCount: number;
}

interface ConceptWithChallenges extends Concept {
  challenges?: Array<{
    id: string;
    title: string;
    stage: number;
    difficulty: string;
  }>;
  showChallenges?: boolean;
}

export default function GuestDashboard() {
  const [concepts, setConcepts] = useState<ConceptWithChallenges[]>([]);
  const [stats, setStats] = useState({ totalCards: 0, dueCards: 0, reviewedToday: 0 });
  const [streak, setStreak] = useState({ currentStreak: 0, longestStreak: 0, totalReviewDays: 0, lastReviewDate: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch concepts from public API
        const response = await fetch("/api/concepts");
        const data = await response.json();
        setConcepts(data.concepts || []);

        // Initialize guest progress for all flashcards
        const allFlashcardIds: string[] = [];
        for (const concept of data.concepts || []) {
          const flashcardsResponse = await fetch(`/api/concepts/${concept.id}/flashcards`);
          if (flashcardsResponse.ok) {
            const flashcardsData = await flashcardsResponse.json();
            allFlashcardIds.push(...flashcardsData.flashcards.map((f: { id: string }) => f.id));
          }
        }

        if (allFlashcardIds.length > 0) {
          initializeGuestProgress(allFlashcardIds);
        }

        // Get stats
        const guestStats = getGuestStats();
        setStats(guestStats);
        
        // Get streak data
        const streakData = getStreakData();
        setStreak(streakData);
      } catch (error) {
        console.error("Failed to load concepts:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  async function toggleChallenges(conceptId: string) {
    const concept = concepts.find((c) => c.id === conceptId);
    
    if (concept?.showChallenges) {
      // Hide challenges
      setConcepts(concepts.map((c) =>
        c.id === conceptId ? { ...c, showChallenges: false } : c
      ));
    } else {
      // Load and show challenges
      try {
        const response = await fetch(`/api/concepts/${conceptId}/challenges`);
        if (response.ok) {
          const data = await response.json();
          setConcepts(concepts.map((c) =>
            c.id === conceptId
              ? { ...c, challenges: data.challenges, showChallenges: true }
              : c
          ));
        }
      } catch (error) {
        console.error("Failed to load challenges:", error);
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <main className="w-full max-w-5xl mx-auto px-6 py-8">
          <h1 className="text-2xl font-semibold text-foreground mb-1">Dashboard</h1>
          <p className="text-secondary text-sm mb-6">Preparing your learning workspace...</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/review"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
            >
              <Play className="w-4 h-4" />
              Go to Review
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-subtle transition-colors"
            >
              Return Home
            </Link>
            <Link
              href="/stats"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-subtle transition-colors"
            >
              Analytics
            </Link>
          </div>
          <section className="mt-6 rounded-lg border border-border bg-card p-5 shadow-card">
            <h2 className="text-lg font-semibold text-foreground mb-2">Getting Started</h2>
            <p className="text-secondary text-sm">
              This dashboard helps you convert daily study effort into durable technical recall.
              Once your concepts load, you can start review sessions and track progress.
            </p>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Guest Mode Banner */}
      <div className="bg-accent text-white py-2.5 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Guest Mode — Progress saved in your browser</span>
          </div>
          <form action="/api/auth/signin">
            <button
              type="submit"
              className="bg-white/15 hover:bg-white/25 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
            >
              Sign in to sync
            </button>
          </form>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground mb-1">Dashboard</h1>
          <p className="text-secondary text-sm">Track your learning progress</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-card rounded-lg border border-border p-5 shadow-card hover:shadow-card-hover transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-warning-subtle text-warning">
                <TrendingUp className="w-[18px] h-[18px]" />
              </div>
              <span className="text-sm font-medium text-secondary">Due for Review</span>
            </div>
            <div className="text-2xl font-semibold text-foreground">{stats.dueCards}</div>
          </div>

          <div className="bg-card rounded-lg border border-border p-5 shadow-card hover:shadow-card-hover transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-accent-subtle text-accent">
                <BookOpen className="w-[18px] h-[18px]" />
              </div>
              <span className="text-sm font-medium text-secondary">Total Cards</span>
            </div>
            <div className="text-2xl font-semibold text-foreground">{stats.totalCards}</div>
          </div>

          <div className="bg-card rounded-lg border border-border p-5 shadow-card hover:shadow-card-hover transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-success-subtle text-success">
                <Target className="w-[18px] h-[18px]" />
              </div>
              <span className="text-sm font-medium text-secondary">Reviewed Today</span>
            </div>
            <div className="text-2xl font-semibold text-foreground">{stats.reviewedToday}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <Link
            href="/review"
            className="bg-accent text-white px-5 py-2.5 rounded-lg font-medium hover:bg-accent-hover transition-colors flex items-center gap-2 shadow-sm"
          >
            <Play className="w-4 h-4" />
            Start Review ({stats.dueCards} due)
          </Link>
          <Link
            href="/stats"
            className="bg-card text-foreground px-5 py-2.5 rounded-lg font-medium hover:bg-subtle transition-colors flex items-center gap-2 border border-border"
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </Link>
        </div>
        
        {/* Streak Badge */}
        {streak.currentStreak > 0 && (
          <div className="bg-warning-subtle border border-[var(--warning)] rounded-lg p-4 mb-6 flex items-center gap-4">
            <div className="w-10 h-10 bg-warning rounded-lg flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-lg font-semibold text-foreground">{streak.currentStreak} Day Streak!</div>
              <div className="text-sm text-secondary">Longest: {streak.longestStreak} days</div>
            </div>
          </div>
        )}

        {/* Concepts List */}
        <div className="bg-card rounded-lg border border-border shadow-card">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Learning Concepts</h2>
          </div>

          <div className="divide-y divide-border">
            {concepts.map((concept) => (
              <div key={concept.id} className="px-5 py-4">
                <Link href={`/concepts/${concept.id}`} className="block mb-2 group">
                  <h3 className="font-medium text-foreground mb-1 group-hover:text-accent transition-colors flex items-center gap-2">
                    {concept.name}
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-secondary text-sm mb-2 line-clamp-2">{concept.description}</p>
                  <div className="flex gap-4 text-sm text-tertiary">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" /> {concept.flashcardCount} flashcards
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5" /> {concept.challengeCount} challenges
                    </span>
                  </div>
                </Link>
                
                {concept.challengeCount > 0 && (
                  <button
                    onClick={() => toggleChallenges(concept.id)}
                    className="text-accent hover:text-accent-hover text-sm font-medium flex items-center gap-1.5 transition-colors mt-2"
                  >
                    {concept.showChallenges ? (
                      <><ChevronUp className="w-4 h-4" /> Hide Challenges</>
                    ) : (
                      <><ChevronDown className="w-4 h-4" /> Show Challenges</>
                    )}
                  </button>
                )}
                
                {concept.showChallenges && concept.challenges && (
                  <div className="mt-3 space-y-2">
                    {concept.challenges.map((challenge) => (
                      <Link
                        key={challenge.id}
                        href={`/challenges/${challenge.id}`}
                        className="block p-3 bg-subtle hover:bg-muted rounded-lg transition-colors border border-border group"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-foreground text-sm">{challenge.title}</div>
                            <div className="text-xs text-secondary">
                              Stage {challenge.stage} • {challenge.difficulty}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
