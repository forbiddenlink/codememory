"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <main className="text-center bg-card rounded-lg border border-border shadow-card p-10 max-w-sm">
        <div className="w-14 h-14 bg-error-subtle rounded-lg flex items-center justify-center mx-auto mb-5">
          <span className="text-2xl">⚠️</span>
        </div>
        <h1 className="text-xl font-semibold text-foreground mb-2">
          Something went wrong
        </h1>
        <p className="text-secondary text-sm mb-6">
          An unexpected error occurred. Try again or return to the dashboard.
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={reset}
            className="bg-accent text-white px-5 py-2.5 rounded-lg font-medium hover:bg-accent-hover transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/dashboard"
            className="text-sm text-accent hover:text-accent-hover transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
