import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user || !user.isAdmin) {
    redirect("/dashboard");
  }

  // Get content statistics
  const conceptCount = await prisma.concept.count();
  const flashcardCount = await prisma.flashcard.count();
  const challengeCount = await prisma.challenge.count();

  const concepts = await prisma.concept.findMany({
    include: {
      _count: {
        select: {
          flashcards: true,
          challenges: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex justify-between h-14 items-center">
            <h1 className="text-lg font-semibold text-foreground">
              Content Admin
            </h1>
            <Link
              href="/dashboard"
              className="text-sm text-accent hover:text-accent-hover transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-card rounded-lg border border-border shadow-card p-5">
            <div className="text-2xl font-semibold text-accent">
              {conceptCount}
            </div>
            <div className="text-sm text-secondary">Concepts</div>
          </div>
          <div className="bg-card rounded-lg border border-border shadow-card p-5">
            <div className="text-2xl font-semibold text-success">
              {flashcardCount}
            </div>
            <div className="text-sm text-secondary">Flashcards</div>
          </div>
          <div className="bg-card rounded-lg border border-border shadow-card p-5">
            <div className="text-2xl font-semibold text-foreground">
              {challengeCount}
            </div>
            <div className="text-sm text-secondary">Challenges</div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-card rounded-lg border border-border shadow-card p-5 mb-6">
          <h2 className="text-base font-semibold text-foreground mb-4">
            Create New Content
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/concepts/new"
              className="bg-accent hover:bg-accent-hover text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm"
            >
              + New Concept
            </Link>
            <Link
              href="/admin/flashcards/new"
              className="bg-card text-foreground font-medium px-5 py-2.5 rounded-lg border border-border hover:bg-subtle transition-colors text-sm"
            >
              + New Flashcard
            </Link>
            <Link
              href="/admin/challenges/new"
              className="bg-card text-foreground font-medium px-5 py-2.5 rounded-lg border border-border hover:bg-subtle transition-colors text-sm"
            >
              + New Challenge
            </Link>
          </div>
        </div>

        {/* Concepts List */}
        <div className="bg-card rounded-lg border border-border shadow-card">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">
              All Concepts
            </h2>
          </div>
          {concepts.length === 0 ? (
            <div className="p-8 text-center text-secondary text-sm">
              No concepts yet. Create your first concept to get started!
            </div>
          ) : (
            <div className="divide-y divide-border">
              {concepts.map((concept) => (
                <div
                  key={concept.id}
                  className="px-5 py-4 hover:bg-subtle transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-foreground">
                          {concept.name}
                        </h3>
                        <span className="text-xs px-2 py-0.5 bg-accent-subtle text-accent rounded font-medium">
                          {concept.category}
                        </span>
                        {concept.language && (
                          <span className="text-xs px-2 py-0.5 bg-subtle text-secondary rounded font-medium">
                            {concept.language}
                          </span>
                        )}
                        <span className="text-xs text-tertiary">
                          Difficulty: {concept.difficulty}/5
                        </span>
                      </div>
                      <p className="text-secondary text-sm mb-2">
                        {concept.description}
                      </p>
                      <div className="flex gap-4 text-xs text-tertiary">
                        <span>{concept._count.flashcards} flashcards</span>
                        <span>{concept._count.challenges} challenges</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Link
                        href={`/admin/concepts/${concept.id}/edit`}
                        className="text-accent hover:text-accent-hover px-3 py-1.5 rounded-lg hover:bg-accent-subtle text-sm transition-colors"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/admin/flashcards/new?conceptId=${concept.id}`}
                        className="text-secondary hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-subtle text-sm transition-colors"
                      >
                        + Flashcard
                      </Link>
                      <Link
                        href={`/admin/challenges/new?conceptId=${concept.id}`}
                        className="text-secondary hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-subtle text-sm transition-colors"
                      >
                        + Challenge
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Start Guide */}
        {conceptCount === 0 && (
          <div className="mt-6 bg-warning-subtle border border-[var(--warning)] rounded-lg p-5">
            <h3 className="text-base font-semibold text-foreground mb-2">
              Quick Start Guide
            </h3>
            <ol className="list-decimal list-inside space-y-1.5 text-secondary text-sm">
              <li><strong>Create a Concept</strong> — Choose something you&apos;re learning</li>
              <li><strong>Add 10 Flashcards</strong> — 2 of each type (syntax, concept, prediction, bug, use_case)</li>
              <li><strong>Add 5 Challenges</strong> — One for each stage (1-5)</li>
              <li><strong>Initialize Progress</strong> — Visit the concept in the dashboard</li>
              <li><strong>Start Learning</strong> — Review cards and complete challenges</li>
            </ol>
          </div>
        )}
      </main>
    </div>
  );
}
