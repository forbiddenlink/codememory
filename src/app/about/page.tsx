import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About CodeMemory and Our Learning Approach",
  description:
    "Learn why CodeMemory combines spaced repetition, practical coding challenges, and feedback loops to help developers retain core concepts over time.",
  authors: [{ name: "CodeMemory Team" }],
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  const baseUrl = (process.env.NEXTAUTH_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About CodeMemory",
    url: `${baseUrl}/about`,
    description:
      "How CodeMemory combines spaced repetition and coding challenges to improve long-term developer recall.",
    author: {
      "@type": "Organization",
      name: "CodeMemory Team",
    },
    datePublished: "2026-02-16",
    dateModified: "2026-02-16",
  };

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-2xl rounded-lg bg-card border border-border p-8 shadow-card">
        <h1 className="mb-1 text-2xl font-semibold text-foreground">About CodeMemory</h1>
        <p className="mb-5 text-sm text-tertiary">
          Last updated <time dateTime="2026-02-16">February 16, 2026</time>
        </p>

        <div className="space-y-4 text-secondary text-sm leading-relaxed mb-6">
          <p>
            CodeMemory is a focused learning app for developers who want durable recall, not
            short-lived memorization. The core idea: concepts reappear when they&apos;re close to being
            forgotten, and practice happens in the format real work requires.
          </p>
          <p>
            We use FSRS-inspired spaced repetition so review timing adapts to each learner. Rate a
            card as hard and it returns sooner. Rate it easy, it appears later. This reduces wasted
            review and concentrates effort where your memory is weakest.
          </p>
          <p>
            Start in guest mode instantly with progress saved locally, or sign in for cross-device
            sync. Useful for interviews, upskilling, and portfolio demos.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
          <Link href="/dashboard" className="text-sm font-medium text-accent hover:text-accent-hover transition-colors">
            Dashboard
          </Link>
          <Link href="/privacy-policy" className="text-sm font-medium text-secondary hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <Link href="/contact" className="text-sm font-medium text-secondary hover:text-foreground transition-colors">
            Contact
          </Link>
        </div>
      </article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </main>
  );
}
