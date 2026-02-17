import Link from "next/link";

interface ReviewNavProps {
  currentIndex: number;
  totalCards: number;
}

export function ReviewNav({ currentIndex, totalCards }: ReviewNavProps) {
  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between h-14 items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-accent hover:text-accent-hover transition-colors"
            >
              ← Back
            </Link>
            <Link
              href="/stats"
              className="text-sm font-medium text-secondary hover:text-foreground transition-colors"
            >
              Analytics
            </Link>
          </div>
          <div className="text-sm text-secondary">
            {currentIndex + 1} / {totalCards}
          </div>
        </div>
      </div>
    </nav>
  );
}
