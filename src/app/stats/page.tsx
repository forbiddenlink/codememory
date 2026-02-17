"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { getReviewHistory, getStreakData, getGuestStats } from "@/lib/guest-store";
import { format, subDays, eachDayOfInterval } from "date-fns";
import { ArrowLeft, Flame, Calendar, Award, BarChart3 } from "lucide-react";
import {
  MetricCard,
  DailyActivityChart,
  PieChartCard,
  RecentReviews,
} from "@/components/stats";

interface DailyReviews {
  date: string;
  count: number;
  displayDate: string;
}

interface ReviewHistoryItem {
  cardId: string;
  date: string;
  rating: number;
  conceptId?: string;
}

interface ChartDataItem {
  name: string;
  count: number;
  color: string;
  percentage?: number;
  [key: string]: string | number | undefined;
}

const RATING_COLORS = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6"];
const STATE_COLORS = {
  New: "#3b82f6",
  Learning: "#f59e0b",
  Review: "#10b981",
  Relearning: "#ef4444",
};

export default function StatsPage() {
  const [history, setHistory] = useState<ReviewHistoryItem[]>([]);
  const [streak, setStreak] = useState({
    currentStreak: 0,
    longestStreak: 0,
    totalReviewDays: 0,
    lastReviewDate: "",
  });
  const [dailyData, setDailyData] = useState<DailyReviews[]>([]);
  const [ratingData, setRatingData] = useState<ChartDataItem[]>([]);
  const [stateData, setStateData] = useState<ChartDataItem[]>([]);

  const getAllCardProgress = useCallback((): { state: number }[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem("codememory_guest_progress");
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }, []);

  const loadAnalytics = useCallback(() => {
    const reviewHistory = getReviewHistory();
    const streakData = getStreakData();
    getGuestStats(); // Load stats (side effect for initialization)

    setHistory(reviewHistory);
    setStreak(streakData);

    // Calculate daily reviews for last 30 days
    const last30Days = eachDayOfInterval({
      start: subDays(new Date(), 29),
      end: new Date(),
    });

    const dailyReviews = last30Days.map((date) => {
      const dateStr = format(date, "yyyy-MM-dd");
      const count = reviewHistory.filter((r) => r.date === dateStr).length;
      return {
        date: dateStr,
        count,
        displayDate: format(date, "MMM d"),
      };
    });
    setDailyData(dailyReviews);

    // Calculate rating distribution
    const ratingLabels = ["Again", "Hard", "Good", "Easy"];
    const total = reviewHistory.length || 1;
    const distribution = [1, 2, 3, 4].map((rating, index) => {
      const count = reviewHistory.filter((r) => r.rating === rating).length;
      return {
        name: ratingLabels[index],
        count,
        color: RATING_COLORS[index],
        percentage: Math.round((count / total) * 100),
      };
    });
    setRatingData(distribution);

    // Calculate card state distribution
    const allProgress = getAllCardProgress();
    const states: ChartDataItem[] = [
      { name: "New", count: allProgress.filter((p) => p.state === 0).length, color: STATE_COLORS.New },
      { name: "Learning", count: allProgress.filter((p) => p.state === 1).length, color: STATE_COLORS.Learning },
      { name: "Review", count: allProgress.filter((p) => p.state === 2).length, color: STATE_COLORS.Review },
      { name: "Relearning", count: allProgress.filter((p) => p.state === 3).length, color: STATE_COLORS.Relearning },
    ];
    setStateData(states);
  }, [getAllCardProgress]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-5 flex flex-wrap items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-accent hover:text-accent-hover flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
          <Link
            href="/review"
            className="text-sm font-medium text-secondary hover:text-foreground transition-colors"
          >
            Review
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground mb-1">Analytics</h1>
          <p className="text-secondary text-sm">Track your progress and study patterns</p>
        </div>

        {/* Streak & Key Metrics */}
        <div className="grid md:grid-cols-4 gap-5 mb-8">
          <MetricCard icon={Flame} value={streak.currentStreak} label="Day Streak" color="warning" />
          <MetricCard icon={Award} value={streak.longestStreak} label="Longest Streak" color="accent" />
          <MetricCard icon={Calendar} value={streak.totalReviewDays} label="Total Days" color="accent" />
          <MetricCard icon={BarChart3} value={history.length} label="Total Reviews" color="success" />
        </div>

        {/* Daily Activity Chart */}
        <DailyActivityChart data={dailyData} />

        {/* Distribution Charts */}
        <div className="grid md:grid-cols-2 gap-5 mb-6">
          <PieChartCard
            title="Rating Distribution"
            data={ratingData}
            emptyMessage="No reviews yet. Start reviewing to see your statistics!"
            labelFormatter={(item) => `${item.name} ${item.percentage}%`}
          />
          <PieChartCard
            title="Card States"
            data={stateData}
            emptyMessage="No cards initialized yet."
            labelFormatter={(item) => `${item.name}: ${item.count}`}
          />
        </div>

        {/* Recent Activity */}
        <RecentReviews history={history} />
      </main>
    </div>
  );
}
