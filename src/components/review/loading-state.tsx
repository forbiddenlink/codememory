import Link from "next/link";

export function LoadingState() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <main className="w-full max-w-xl rounded-lg bg-card border border-border p-6 shadow-card">
        <h1 className="text-xl font-semibold text-foreground mb-1">Review Session</h1>
        <p className="text-secondary text-sm mb-5">
          Loading your due cards...
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
          >
            Back to Dashboard
          </Link>
          <Link
            href="/"
            className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-subtle transition-colors"
          >
            Home
          </Link>
        </div>
      </main>
    </div>
  );
}
