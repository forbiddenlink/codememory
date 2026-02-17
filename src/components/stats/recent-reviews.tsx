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
  1: { dot: "bg-error", badge: "bg-error-subtle text-error", label: "Again" },
  2: { dot: "bg-warning", badge: "bg-warning-subtle text-warning", label: "Hard" },
  3: { dot: "bg-success", badge: "bg-success-subtle text-success", label: "Good" },
  4: { dot: "bg-accent", badge: "bg-accent-subtle text-accent", label: "Easy" },
} as const;

export function RecentReviews({ history }: RecentReviewsProps) {
  return (
    <div className="bg-card rounded-lg border border-border shadow-card p-5">
      <h2 className="text-base font-semibold text-foreground mb-4">Recent Reviews</h2>
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
                  className="flex items-center justify-between p-2.5 bg-subtle rounded-lg"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                    <span className="text-sm text-secondary">
                      {review.conceptId || "Card reviewed"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-tertiary">{review.date}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${style.badge}`}>
                      {style.label}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        <div className="text-center text-secondary text-sm py-10">
          No review history yet.
        </div>
      )}
    </div>
  );
}
