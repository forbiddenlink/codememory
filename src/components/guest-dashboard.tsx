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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Guest Mode Banner */}
      <div className="bg-indigo-600 text-white py-2 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4" />
            <span>Guest Mode - Progress saved in your browser</span>
          </div>
          <form action="/api/auth/signin">
            <button
              type="submit"
              className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm font-medium transition-colors"
            >
              Sign in to sync across devices
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Track your learning progress</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-md p-6 border border-orange-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center shadow-sm">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.dueCards}</div>
            <div className="text-sm font-medium text-gray-700">Due for Review</div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-6 border border-blue-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-sm">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalCards}</div>
            <div className="text-sm font-medium text-gray-700">Total Cards</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md p-6 border border-green-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shadow-sm">
                <Target className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.reviewedToday}</div>
            <div className="text-sm font-medium text-gray-700">Reviewed Today</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Link
            href="/review"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <Play className="w-5 h-5" />
            Start Review ({stats.dueCards} due)
          </Link>
          
          {streak.currentStreak > 0 && (
            <Link
              href="/stats"
              className="bg-white text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-md border border-gray-200"
            >
              <BarChart3 className="w-5 h-5" />
              View Analytics
            </Link>
          )}
        </div>
        
        {/* Streak Badge */}
        {streak.currentStreak > 0 && (
          <div className="bg-gradient-to-r from-orange-100 to-red-100 border border-orange-300 rounded-xl p-4 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{streak.currentStreak} Day Streak! 🎉</div>
                <div className="text-sm text-gray-700">Keep it up! Longest: {streak.longestStreak} days</div>
              </div>
            </div>
          </div>
        )}

        {/* Concepts List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Learning Concepts</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {concepts.map((concept) => (
              <div key={concept.id} className="p-6">
                <Link href={`/concepts/${concept.id}`} className="block mb-3 group">
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                    {concept.name}
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">{concept.description}</p>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" /> {concept.flashcardCount} flashcards
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Code className="w-4 h-4" /> {concept.challengeCount} challenges
                    </span>
                  </div>
                </Link>
                
                {concept.challengeCount > 0 && (
                  <button
                    onClick={() => toggleChallenges(concept.id)}
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1.5 transition-colors"
                  >
                    {concept.showChallenges ? (
                      <><ChevronUp className="w-4 h-4" /> Hide Challenges</>
                    ) : (
                      <><ChevronDown className="w-4 h-4" /> Show Challenges</>
                    )}
                  </button>
                )}
                
                {concept.showChallenges && concept.challenges && (
                  <div className="mt-4 space-y-2">
                    {concept.challenges.map((challenge) => (
                      <Link
                        key={challenge.id}
                        href={`/challenges/${challenge.id}`}
                        className="block p-3 bg-gray-50 hover:bg-indigo-50 rounded-lg transition-colors border border-gray-200 hover:border-indigo-300 group"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">{challenge.title}</div>
                            <div className="text-sm text-gray-600">
                              Stage {challenge.stage} • {challenge.difficulty}
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
