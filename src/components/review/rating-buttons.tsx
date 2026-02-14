interface RatingButtonsProps {
  onRate: (rating: number) => void;
  disabled: boolean;
}

const RATINGS = [
  { value: 1, label: "Again", sublabel: "<1m (1)", color: "bg-red-600 hover:bg-red-700" },
  { value: 2, label: "Hard", sublabel: "(2)", color: "bg-orange-600 hover:bg-orange-700" },
  { value: 3, label: "Good", sublabel: "(3)", color: "bg-green-600 hover:bg-green-700" },
  { value: 4, label: "Easy", sublabel: "(4)", color: "bg-blue-600 hover:bg-blue-700" },
] as const;

export function RatingButtons({ onRate, disabled }: RatingButtonsProps) {
  return (
    <div>
      <div className="text-center mb-4 text-gray-700 dark:text-gray-300">
        How well did you know this?
      </div>
      <div className="grid grid-cols-4 gap-3">
        {RATINGS.map((rating) => (
          <button
            key={rating.value}
            onClick={() => onRate(rating.value)}
            disabled={disabled}
            className={`${rating.color} disabled:opacity-50 text-white font-semibold px-4 py-3 rounded-lg transition-colors`}
          >
            <div className="text-sm">{rating.label}</div>
            <div className="text-xs opacity-80">{rating.sublabel}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
