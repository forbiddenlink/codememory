import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact the CodeMemory Team",
  description:
    "Contact CodeMemory for support, bug reports, curriculum feedback, security disclosures, or collaboration requests about developer learning programs.",
  authors: [{ name: "CodeMemory Team" }],
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  const baseUrl = (process.env.NEXTAUTH_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact CodeMemory",
    url: `${baseUrl}/contact`,
    description: "Support and contact options for CodeMemory users and partners.",
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
        <h1 className="mb-1 text-2xl font-semibold text-foreground">Contact</h1>
        <p className="mb-5 text-sm text-tertiary">
          Last updated <time dateTime="2026-02-16">February 16, 2026</time>
        </p>

        <p className="mb-4 text-secondary text-sm leading-relaxed">
          If you run into an issue while reviewing cards, loading content, or tracking progress,
          send a message and include as much context as possible. Useful details include the page
          where the issue occurred, the browser/device you used, and a short description of the
          expected behavior versus what actually happened.
        </p>
        <p className="mb-4 text-secondary text-sm leading-relaxed">
          We also welcome feedback on learning quality. If a flashcard is unclear, a challenge is
          misleading, or a concept pack needs expansion, tell us what you were trying to learn and
          what would have made the experience clearer.
        </p>
        <p className="mb-4 text-secondary text-sm leading-relaxed">
          For partnership or educational use, include your organization context and timeline. For
          security-related reports, use the same contact channel and mark the subject line clearly
          so it is routed with priority.
        </p>
        <p className="mb-6 text-secondary text-sm leading-relaxed">
          Email:{" "}
          <a className="text-accent hover:text-accent-hover font-medium transition-colors" href="mailto:support@codememory.app">
            support@codememory.app
          </a>
        </p>

        <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
          <Link href="/about" className="text-sm font-medium text-accent hover:text-accent-hover transition-colors">
            About
          </Link>
          <Link href="/privacy-policy" className="text-sm font-medium text-secondary hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <Link href="/dashboard" className="text-sm font-medium text-secondary hover:text-foreground transition-colors">
            Dashboard
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
