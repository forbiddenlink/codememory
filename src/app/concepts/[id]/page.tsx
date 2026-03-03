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
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <Link
          href="/dashboard"
          className="text-accent hover:text-accent-hover mb-6 flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="bg-card rounded-lg border border-border shadow-card p-6 mb-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              {concept.name}
            </h1>
            <p className="text-secondary text-sm mb-4">{concept.description}</p>
            <div className="flex gap-2">
              <span className="px-2.5 py-1 bg-accent-subtle text-accent rounded-full text-xs font-medium">
                {concept.category}
              </span>
              {concept.language && (
                <span className="px-2.5 py-1 bg-subtle text-secondary rounded-full text-xs font-medium">
                  {concept.language}
                </span>
              )}
              <span className="px-2.5 py-1 bg-subtle text-secondary rounded-full text-xs font-medium">
                Difficulty: {concept.difficulty}/5
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-accent-subtle rounded-lg p-5 border border-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center">
                  <BookOpen className="w-[18px] h-[18px] text-white" />
                </div>
                <span className="text-sm text-secondary font-medium">Flashcards</span>
              </div>
              <div className="text-2xl font-semibold text-foreground">
                {concept.flashcards.length}
              </div>
            </div>
            <div className="bg-subtle rounded-lg p-5 border border-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 bg-secondary rounded-lg flex items-center justify-center">
                  <Code className="w-[18px] h-[18px] text-white" />
                </div>
                <span className="text-sm text-secondary font-medium">Challenges</span>
              </div>
              <div className="text-2xl font-semibold text-foreground">
                {concept.challenges.length}
              </div>
            </div>
          </div>
        </div>

        {/* Flashcards by Type */}
        <div className="bg-card rounded-lg border border-border shadow-card mb-6">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Flashcards</h2>
          </div>
          <div className="p-5">
            {Object.entries(flashcardsByType).map(([type, cards]) => (
              <div key={type} className="mb-6 last:mb-0">
                <h3 className="text-sm font-semibold text-secondary mb-3 capitalize">
                  {type.replace("_", " ")} ({cards.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {cards.map((card) => (
                    <div
                      key={card.id}
                      className="border border-border rounded-lg p-4 hover:shadow-card-hover transition-shadow"
                    >
                      <div className="text-xs text-tertiary font-medium mb-1.5 uppercase tracking-wide">
                        Front
                      </div>
                      <div className="text-foreground text-sm mb-3">{card.front}</div>
                      {card.codeExample && (
                        <pre className="bg-[var(--bg-code)] text-[var(--text-code)] p-3 rounded-lg text-sm overflow-x-auto">
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
        <div className="bg-card rounded-lg border border-border shadow-card">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Coding Challenges</h2>
          </div>
          <div className="divide-y divide-border">
            {concept.challenges.map((challenge) => (
              <Link
                key={challenge.id}
                href={`/challenges/${challenge.id}`}
                className="block px-5 py-4 hover:bg-subtle transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-foreground">
                        {challenge.title}
                      </h3>
                      <span className="px-2 py-0.5 bg-accent-subtle text-accent rounded text-xs font-medium">
                        Stage {challenge.stage}
                      </span>
                      <span className="px-2 py-0.5 bg-subtle text-secondary rounded text-xs font-medium capitalize">
                        {challenge.difficulty}
                      </span>
                    </div>
                    <p className="text-secondary text-sm">{challenge.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-accent ml-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
