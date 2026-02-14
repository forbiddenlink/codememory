import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import GuestDashboard from "@/components/guest-dashboard";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  // Guest mode - no authentication required
  if (!session?.user?.email) {
    return <GuestDashboard />;
  }

  // Get user from database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return <GuestDashboard />;
  }

  // Get cards due for review
  const dueCards = await prisma.userCardProgress.count({
    where: {
      userId: user.id,
      nextReview: {
        lte: new Date(),
      },
    },
  });

  // Get overall stats
  const totalCards = await prisma.userCardProgress.count({
    where: { userId: user.id },
  });

  const concepts = await prisma.userConceptMastery.findMany({
    where: { userId: user.id },
    include: {
      concept: true,
    },
    orderBy: {
      lastReviewed: "desc",
    },
    take: 5,
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              CodeMemory
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {session.user.name || session.user.email}
              </span>
              <a
                href="/api/auth/signout"
                className="text-sm text-red-600 hover:text-red-700"
              >
                Sign out
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Ready to strengthen your memory?
          </p>
        </div>

        {/* Due Cards Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                📚 {dueCards} cards due for review
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Total cards: {totalCards}
              </p>
            </div>
            {dueCards > 0 && (
              <Link
                href="/review"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Start Review
              </Link>
            )}
          </div>
          {dueCards === 0 && (
            <p className="text-gray-500 dark:text-gray-400">
              Great job! No cards due right now. Check back later or explore challenges.
            </p>
          )}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              Coming Soon
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Current Streak
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {totalCards}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Cards
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-3xl mb-2">🎮</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              Coming Soon
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Challenges
            </div>
          </div>
        </div>

        {/* Concepts in Progress */}
        {concepts.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              📖 Concepts in Progress
            </h3>
            <div className="space-y-3">
              {concepts.map((userMastery) => (
                <div
                  key={userMastery.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded"
                >
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {userMastery.concept.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {userMastery.concept.category}
                      {userMastery.concept.language && ` • ${userMastery.concept.language}`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">
                      {Math.round(userMastery.masteryLevel)}%
                    </div>
                    <div className="text-xs text-gray-500">mastery</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {concepts.length === 0 && totalCards === 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              🌱 Getting Started
            </h3>
            <p className="text-yellow-700 dark:text-yellow-300">
              Your learning journey is about to begin! The database needs to be seeded with initial content.
              Run: <code className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">npm run db:seed</code>
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
