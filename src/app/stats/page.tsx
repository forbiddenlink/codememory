"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getReviewHistory,
  getStreakData,
  getGuestStats
} from "@/lib/guest-store";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { format, subDays, eachDayOfInterval } from "date-fns";
import {
  ArrowLeft,
  Flame,
  Calendar,
  Award,
  BarChart3
} from "lucide-react";

interface DailyReviews {
  date: string;
  count: number;
  displayDate: string;
}

interface RatingDistribution {
  rating: string;
  count: number;
  percentage: number;
  [key: string]: string | number;
}

interface ReviewHistoryItem {
  cardId: string;
  date: string;
  rating: number;
  conceptId?: string;
}

interface CardStateData {
  name: string;
  count: number;
  color: string;
  [key: string]: string | number;
}

interface CardProgressItem {
  state: number;
}

export default function StatsPage() {
  const [history, setHistory] = useState<ReviewHistoryItem[]>([]);
  const [streak, setStreak] = useState({ currentStreak: 0, longestStreak: 0, totalReviewDays: 0, lastReviewDate: '' });
  // stats is set but used indirectly through guestStats
  const [, setStats] = useState({ totalCards: 0, dueCards: 0, reviewedToday: 0 });
  const [dailyData, setDailyData] = useState<DailyReviews[]>([]);
  const [ratingData, setRatingData] = useState<RatingDistribution[]>([]);
  const [stateData, setStateData] = useState<CardStateData[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  function loadAnalytics() {
    const reviewHistory = getReviewHistory();
    const streakData = getStreakData();
    const guestStats = getGuestStats();
    
    setHistory(reviewHistory);
    setStreak(streakData);
    setStats(guestStats);

    // Calculate daily reviews for last 30 days
    const last30Days = eachDayOfInterval({
      start: subDays(new Date(), 29),
      end: new Date()
    });

    const dailyReviews = last30Days.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const count = reviewHistory.filter(r => r.date === dateStr).length;
      return {
        date: dateStr,
        count,
        displayDate: format(date, 'MMM d')
      };
    });
    setDailyData(dailyReviews);

    // Calculate rating distribution
    const ratings = [1, 2, 3, 4];
    const total = reviewHistory.length || 1;
    const distribution = ratings.map(rating => {
      const count = reviewHistory.filter(r => r.rating === rating).length;
      return {
        rating: rating === 1 ? 'Again' : rating === 2 ? 'Hard' : rating === 3 ? 'Good' : 'Easy',
        count,
        percentage: Math.round((count / total) * 100)
      };
    });
    setRatingData(distribution);

    // Calculate card state distribution
    const allProgress = getAllCardProgress();
    const states = [
      { name: 'New', count: allProgress.filter(p => p.state === 0).length, color: '#3b82f6' },
      { name: 'Learning', count: allProgress.filter(p => p.state === 1).length, color: '#f59e0b' },
      { name: 'Review', count: allProgress.filter(p => p.state === 2).length, color: '#10b981' },
      { name: 'Relearning', count: allProgress.filter(p => p.state === 3).length, color: '#ef4444' }
    ];
    setStateData(states);
  }

  function getAllCardProgress(): CardProgressItem[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem('codememory_guest_progress');
    if (!data) return [];
    try {
      return JSON.parse(data) as CardProgressItem[];
    } catch {
      return [];
    }
  }

  const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <Link
          href="/dashboard"
          className="text-indigo-600 hover:text-indigo-700 mb-6 flex items-center gap-2 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Analytics</h1>
          <p className="text-gray-600">Track your progress and study patterns</p>
        </div>

        {/* Streak & Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-md p-6 border border-orange-200">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center shadow-sm">
                <Flame className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{streak.currentStreak}</div>
            <div className="text-sm font-medium text-gray-700">Day Streak</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-md p-6 border border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center shadow-sm">
                <Award className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{streak.longestStreak}</div>
            <div className="text-sm font-medium text-gray-700">Longest Streak</div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-sm">
                <Calendar className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{streak.totalReviewDays}</div>
            <div className="text-sm font-medium text-gray-700">Total Days</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md p-6 border border-green-200">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shadow-sm">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{history.length}</div>
            <div className="text-sm font-medium text-gray-700">Total Reviews</div>
          </div>
        </div>

        {/* Daily Activity Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Review Activity (Last 30 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="displayDate" 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Rating Distribution */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Rating Distribution</h2>
            {ratingData.length > 0 && ratingData.some(r => r.count > 0) ? (
              <>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={ratingData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(props) => {
                        const { rating, percentage } = props as unknown as RatingDistribution;
                        return percentage > 0 ? `${rating} ${percentage}%` : '';
                      }}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {ratingData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {ratingData.map((item, index) => (
                    <div key={item.rating} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index] }}
                        />
                        <span className="text-gray-700">{item.rating}</span>
                      </div>
                      <span className="font-medium text-gray-900">{item.count} ({item.percentage}%)</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 py-12">
                No reviews yet. Start reviewing to see your statistics!
              </div>
            )}
          </div>

          {/* Card State Distribution */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Card States</h2>
            {stateData.length > 0 && stateData.some(s => s.count > 0) ? (
              <>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={stateData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(props) => {
                        const { name, count } = props as unknown as CardStateData;
                        return count > 0 ? `${name}: ${count}` : '';
                      }}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {stateData.map((item, index) => (
                        <Cell key={`cell-${index}`} fill={item.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {stateData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-gray-700">{item.name}</span>
                      </div>
                      <span className="font-medium text-gray-900">{item.count}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 py-12">
                No cards initialized yet.
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Reviews</h2>
          {history.length > 0 ? (
            <div className="space-y-2">
              {history.slice(-10).reverse().map((review, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      review.rating === 1 ? 'bg-red-500' :
                      review.rating === 2 ? 'bg-orange-500' :
                      review.rating === 3 ? 'bg-green-500' : 'bg-blue-500'
                    }`} />
                    <span className="text-sm text-gray-700">
                      {review.conceptId || 'Card reviewed'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">{review.date}</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      review.rating === 1 ? 'bg-red-100 text-red-800' :
                      review.rating === 2 ? 'bg-orange-100 text-orange-800' :
                      review.rating === 3 ? 'bg-green-100 text-green-800' : 
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {review.rating === 1 ? 'Again' : 
                       review.rating === 2 ? 'Hard' : 
                       review.rating === 3 ? 'Good' : 'Easy'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              No review history yet. Complete some reviews to track your progress!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
