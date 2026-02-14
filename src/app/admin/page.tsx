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

  if (!user) {
    redirect("/");
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Content Admin
            </h1>
            <Link
              href="/dashboard"
              className="text-blue-600 hover:text-blue-700"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-blue-600">
              {conceptCount}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Concepts</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-green-600">
              {flashcardCount}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Flashcards</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-purple-600">
              {challengeCount}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Challenges</div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Create New Content
          </h2>
          <div className="flex gap-4">
            <Link
              href="/admin/concepts/new"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              + New Concept
            </Link>
            <Link
              href="/admin/flashcards/new"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              + New Flashcard
            </Link>
            <Link
              href="/admin/challenges/new"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              + New Challenge
            </Link>
          </div>
        </div>

        {/* Concepts List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              All Concepts
            </h2>
          </div>
          {concepts.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No concepts yet. Create your first concept to get started!
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {concepts.map((concept) => (
                <div
                  key={concept.id}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {concept.name}
                        </h3>
                        <span className="text-sm px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                          {concept.category}
                        </span>
                        {concept.language && (
                          <span className="text-sm px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded">
                            {concept.language}
                          </span>
                        )}
                        <span className="text-sm text-gray-500">
                          Difficulty: {concept.difficulty}/5
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {concept.description}
                      </p>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>
                          📚 {concept._count.flashcards} flashcards
                        </span>
                        <span>
                          🎯 {concept._count.challenges} challenges
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/concepts/${concept.id}/edit`}
                        className="text-blue-600 hover:text-blue-700 px-4 py-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/admin/flashcards/new?conceptId=${concept.id}`}
                        className="text-green-600 hover:text-green-700 px-4 py-2 rounded hover:bg-green-50 dark:hover:bg-green-900"
                      >
                        + Flashcard
                      </Link>
                      <Link
                        href={`/admin/challenges/new?conceptId=${concept.id}`}
                        className="text-purple-600 hover:text-purple-700 px-4 py-2 rounded hover:bg-purple-50 dark:hover:bg-purple-900"
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
          <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-3">
              🚀 Quick Start Guide
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-yellow-700 dark:text-yellow-300">
              <li>
                <strong>Create a Concept</strong> - Choose something you're
                learning right now
              </li>
              <li>
                <strong>Add 10 Flashcards</strong> - 2 of each type (syntax,
                concept, prediction, bug, use_case)
              </li>
              <li>
                <strong>Add 5 Challenges</strong> - One for each stage (1-5
                difficulty)
              </li>
              <li>
                <strong>Initialize Progress</strong> - Visit the concept in your
                dashboard to create card progress entries
              </li>
              <li>
                <strong>Start Learning</strong> - Review cards and complete
                challenges!
              </li>
            </ol>
          </div>
        )}
      </main>
    </div>
  );
}
