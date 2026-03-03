import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <main className="text-center bg-card rounded-lg border border-border shadow-card p-10 max-w-sm">
        <div className="text-5xl font-semibold text-tertiary mb-4">404</div>
        <h1 className="text-xl font-semibold text-foreground mb-2">
          Page not found
        </h1>
        <p className="text-secondary text-sm mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex bg-accent text-white px-5 py-2.5 rounded-lg font-medium hover:bg-accent-hover transition-colors"
        >
          Back to Dashboard
        </Link>
      </main>
    </div>
  );
}
