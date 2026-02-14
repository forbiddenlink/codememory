import Link from "next/link";

interface ReviewNavProps {
  currentIndex: number;
  totalCards: number;
}

export function ReviewNav({ currentIndex, totalCards }: ReviewNavProps) {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link
            href="/dashboard"
            className="text-blue-600 hover:text-blue-700"
          >
            ← Back
          </Link>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Card {currentIndex + 1} / {totalCards}
          </div>
        </div>
      </div>
    </nav>
  );
}
