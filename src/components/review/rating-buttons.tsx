interface RatingButtonsProps {
  onRate: (rating: number) => void;
  disabled: boolean;
}

const RATINGS = [
  { value: 1, label: "Again", key: "1", className: "bg-error hover:bg-error/90" },
  { value: 2, label: "Hard", key: "2", className: "bg-warning hover:bg-warning/90" },
  { value: 3, label: "Good", key: "3", className: "bg-success hover:bg-success/90" },
  { value: 4, label: "Easy", key: "4", className: "bg-accent hover:bg-accent-hover" },
] as const;

export function RatingButtons({ onRate, disabled }: RatingButtonsProps) {
  return (
    <div>
      <div className="text-center mb-3 text-sm text-secondary">
        How well did you know this?
      </div>
      <div className="grid grid-cols-4 gap-2">
        {RATINGS.map((rating) => (
          <button
            key={rating.value}
            onClick={() => onRate(rating.value)}
            disabled={disabled}
            className={`${rating.className} disabled:opacity-50 text-white font-medium px-3 py-2.5 rounded-lg transition-colors`}
          >
            <div className="text-sm">{rating.label}</div>
            <div className="text-xs opacity-75">{rating.key}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
