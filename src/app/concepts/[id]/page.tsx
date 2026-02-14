import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, BookOpen, Code, ArrowRight } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ConceptPage({ params }: PageProps) {
  const { id } = await params;

  const concept = await prisma.concept.findUnique({
    where: { id },
    include: {
      flashcards: {
        orderBy: { createdAt: "asc" },
      },
      challenges: {
        orderBy: { stage: "asc" },
      },
    },
  });

  if (!concept) {
    notFound();
  }

  // Group flashcards by type
  const flashcardsByType = concept.flashcards.reduce((acc, card) => {
    if (!acc[card.type]) {
      acc[card.type] = [];
    }
    acc[card.type].push(card);
    return acc;
  }, {} as Record<string, typeof concept.flashcards>);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <Link
          href="/dashboard"
          className="text-indigo-600 hover:text-indigo-700 mb-6 flex items-center gap-2 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                {concept.name}
              </h1>
              <p className="text-lg text-gray-600 mb-4">{concept.description}</p>
              <div className="flex gap-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {concept.category}
                </span>
                {concept.language && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    {concept.language}
                  </span>
                )}
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                  Difficulty: {concept.difficulty}/5
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-6 border border-indigo-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div className="text-sm text-indigo-700 font-medium">Flashcards</div>
              </div>
              <div className="text-3xl font-bold text-indigo-900">
                {concept.flashcards.length}
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <div className="text-sm text-purple-700 font-medium">Challenges</div>
              </div>
              <div className="text-3xl font-bold text-purple-900">
                {concept.challenges.length}
              </div>
            </div>
          </div>
        </div>

        {/* Flashcards by Type */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Flashcards</h2>
          </div>
          <div className="p-6">
            {Object.entries(flashcardsByType).map(([type, cards]) => (
              <div key={type} className="mb-8 last:mb-0">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 capitalize">
                  {type.replace("_", " ")} ({cards.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cards.map((card) => (
                    <div
                      key={card.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-md transition-all"
                    >
                      <div className="text-sm text-gray-600 font-medium mb-2">
                        Front:
                      </div>
                      <div className="text-gray-900 mb-3">{card.front}</div>
                      {card.codeExample && (
                        <pre className="bg-gray-900 text-gray-100 p-3 rounded text-sm overflow-x-auto">
                          <code>{card.codeExample}</code>
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Challenges */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Coding Challenges</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {concept.challenges.map((challenge) => (
              <Link
                key={challenge.id}
                href={`/challenges/${challenge.id}`}
                className="block p-6 hover:bg-indigo-50 transition-colors border-b border-gray-200 last:border-0 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {challenge.title}
                      </h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                        Stage {challenge.stage}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium capitalize">
                        {challenge.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-600">{challenge.description}</p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-indigo-600 ml-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
