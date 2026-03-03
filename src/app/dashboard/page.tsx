import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import GuestDashboard from "@/components/guest-dashboard";

export const metadata: Metadata = {
  title: "Your Learning Dashboard and Daily Reviews",
  description:
    "View due cards, track concept mastery, and jump into review sessions from your personalized CodeMemory learning dashboard.",
  alternates: {
    canonical: "/dashboard",
  },
};

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
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex justify-between h-14 items-center">
            <h1 className="text-lg font-semibold text-foreground">
              CodeMemory
            </h1>
            <div className="flex items-center gap-4">
              <Link href="/review" className="text-sm text-accent hover:text-accent-hover transition-colors">
                Review
              </Link>
              <Link href="/stats" className="text-sm text-accent hover:text-accent-hover transition-colors">
                Analytics
              </Link>
              <span className="text-sm text-secondary">
                {session.user.name || session.user.email}
              </span>
              <form action="/api/auth/signout">
                <button
                  type="submit"
                  className="text-sm text-error hover:opacity-80 transition-opacity"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-1">
            Welcome back!
          </h2>
          <p className="text-secondary text-sm">
            Ready to strengthen your memory?
          </p>
        </div>

        {/* Due Cards Section */}
        <div className="bg-card rounded-lg border border-border shadow-card p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-foreground">
                {dueCards} cards due for review
              </h3>
              <p className="text-sm text-secondary mt-1">
                Total cards: {totalCards}
              </p>
            </div>
            {dueCards > 0 && (
              <Link
                href="/review"
                className="bg-accent hover:bg-accent-hover text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
              >
                Start Review
              </Link>
            )}
          </div>
          {dueCards === 0 && (
            <p className="text-secondary text-sm">
              Great job! No cards due right now. Check back later or explore challenges.
            </p>
          )}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-card rounded-lg border border-border shadow-card p-5">
            <span className="text-sm font-medium text-secondary">Current Streak</span>
            <div className="text-2xl font-semibold text-foreground mt-1">Coming Soon</div>
          </div>
          <div className="bg-card rounded-lg border border-border shadow-card p-5">
            <span className="text-sm font-medium text-secondary">Total Cards</span>
            <div className="text-2xl font-semibold text-foreground mt-1">{totalCards}</div>
          </div>
          <div className="bg-card rounded-lg border border-border shadow-card p-5">
            <span className="text-sm font-medium text-secondary">Challenges</span>
            <div className="text-2xl font-semibold text-foreground mt-1">Coming Soon</div>
          </div>
        </div>

        {/* Concepts in Progress */}
        {concepts.length > 0 && (
          <div className="bg-card rounded-lg border border-border shadow-card p-5">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Concepts in Progress
            </h3>
            <div className="space-y-2">
              {concepts.map((userMastery) => (
                <div
                  key={userMastery.id}
                  className="flex items-center justify-between p-3 bg-subtle rounded-lg"
                >
                  <div>
                    <div className="font-medium text-foreground">
                      {userMastery.concept.name}
                    </div>
                    <div className="text-sm text-secondary">
                      {userMastery.concept.category}
                      {userMastery.concept.language && ` • ${userMastery.concept.language}`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-accent">
                      {Math.round(userMastery.masteryLevel)}%
                    </div>
                    <div className="text-xs text-tertiary">mastery</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {concepts.length === 0 && totalCards === 0 && (
          <div className="bg-warning-subtle border border-[var(--warning)] rounded-lg p-5">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Getting Started
            </h3>
            <p className="text-secondary text-sm">
              Your learning journey is about to begin! The database needs to be seeded with initial content.
              Run: <code className="bg-muted px-2 py-0.5 rounded text-sm">npm run db:seed</code>
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
