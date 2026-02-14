interface FlashcardDisplayProps {
  front: string;
  back: string;
  codeExample: string | null;
  showAnswer: boolean;
}

export function FlashcardDisplay({
  front,
  back,
  codeExample,
  showAnswer,
}: FlashcardDisplayProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6 min-h-[400px] flex flex-col justify-center">
      {/* Question */}
      <div className="mb-8">
        <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase">
          Question
        </div>
        <div className="text-xl text-gray-900 dark:text-white whitespace-pre-wrap">
          {front}
        </div>
      </div>

      {/* Answer (shown after clicking) */}
      {showAnswer && (
        <>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase">
              Answer
            </div>
            <div className="text-xl text-gray-900 dark:text-white whitespace-pre-wrap mb-4">
              {back}
            </div>
          </div>

          {codeExample && (
            <div className="mt-4">
              <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase">
                Example
              </div>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>{codeExample}</code>
              </pre>
            </div>
          )}
        </>
      )}
    </div>
  );
}
