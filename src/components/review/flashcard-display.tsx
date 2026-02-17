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
    <div className="bg-card rounded-lg border border-border shadow-card p-6 mb-5 min-h-[320px] flex flex-col justify-center">
      {/* Question */}
      <div className="mb-6">
        <div className="text-xs font-medium text-tertiary mb-2 uppercase tracking-wide">
          Question
        </div>
        <div className="text-lg text-foreground whitespace-pre-wrap">
          {front}
        </div>
      </div>

      {/* Answer (shown after clicking) */}
      {showAnswer && (
        <>
          <div className="border-t border-border pt-5">
            <div className="text-xs font-medium text-tertiary mb-2 uppercase tracking-wide">
              Answer
            </div>
            <div className="text-lg text-foreground whitespace-pre-wrap mb-4">
              {back}
            </div>
          </div>

          {codeExample && (
            <div className="mt-4">
              <div className="text-xs font-medium text-tertiary mb-2 uppercase tracking-wide">
                Example
              </div>
              <pre className="bg-[var(--bg-code)] text-[var(--text-code)] p-4 rounded-lg overflow-x-auto text-sm">
                <code>{codeExample}</code>
              </pre>
            </div>
          )}
        </>
      )}
    </div>
  );
}
