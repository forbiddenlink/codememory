import Link from "next/link";
import { PartyPopper, ArrowLeft } from "lucide-react";

export function AllCaughtUp() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <main className="text-center bg-card rounded-lg border border-border shadow-card p-10 max-w-sm">
        <div className="w-14 h-14 bg-success-subtle rounded-lg flex items-center justify-center mx-auto mb-5">
          <PartyPopper className="w-7 h-7 text-success" />
        </div>
        <h1 className="text-xl font-semibold text-foreground mb-2">
          All Caught Up!
        </h1>
        <p className="text-secondary text-sm mb-6">
          No cards due for review right now.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-lg font-medium hover:bg-accent-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </main>
    </div>
  );
}
