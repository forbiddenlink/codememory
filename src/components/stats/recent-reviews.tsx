interface ReviewHistoryItem {
  cardId: string;
  date: string;
  rating: number;
  conceptId?: string;
}

interface RecentReviewsProps {
  history: ReviewHistoryItem[];
}

const ratingStyles = {
  1: { dot: "bg-red-500", badge: "bg-red-100 text-red-800", label: "Again" },
  2: { dot: "bg-orange-500", badge: "bg-orange-100 text-orange-800", label: "Hard" },
  3: { dot: "bg-green-500", badge: "bg-green-100 text-green-800", label: "Good" },
  4: { dot: "bg-blue-500", badge: "bg-blue-100 text-blue-800", label: "Easy" },
} as const;

export function RecentReviews({ history }: RecentReviewsProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Reviews</h2>
      {history.length > 0 ? (
        <div className="space-y-2">
          {history
            .slice(-10)
            .reverse()
            .map((review, index) => {
              const style = ratingStyles[review.rating as keyof typeof ratingStyles];
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                    <span className="text-sm text-gray-700">
                      {review.conceptId || "Card reviewed"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">{review.date}</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${style.badge}`}>
                      {style.label}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-12">
          No review history yet. Complete some reviews to track your progress!
        </div>
      )}
    </div>
  );
}
