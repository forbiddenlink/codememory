import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy for CodeMemory",
  description:
    "Read how CodeMemory handles guest-mode storage, authenticated account data, operational logs, retention, and your privacy rights.",
  authors: [{ name: "CodeMemory Team" }],
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  const baseUrl = (process.env.NEXTAUTH_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "CodeMemory Privacy Policy",
    url: `${baseUrl}/privacy-policy`,
    description: "Privacy terms for guest and authenticated CodeMemory usage.",
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
        <h1 className="mb-1 text-2xl font-semibold text-foreground">Privacy Policy</h1>
        <p className="mb-5 text-sm text-tertiary">
          Effective date: <time dateTime="2026-02-16">February 16, 2026</time>
        </p>

        <div className="space-y-4 text-secondary text-sm leading-relaxed mb-6">
          <div>
            <h2 className="mb-1 text-base font-semibold text-foreground">1. Data We Store</h2>
            <p>
              In guest mode, your review progress is stored locally in your browser. In authenticated
              mode, account-linked progress is stored in the application database for cross-device sync.
            </p>
          </div>

          <div>
            <h2 className="mb-1 text-base font-semibold text-foreground">2. How We Use Data</h2>
            <p>
              Data is used to provide the product experience: scheduling due cards, tracking review
              outcomes, and generating progress analytics. We do not sell personal information.
            </p>
          </div>

          <div>
            <h2 className="mb-1 text-base font-semibold text-foreground">3. Authentication and Providers</h2>
            <p>
              If you choose to sign in, third-party authentication providers may share profile details
              required for account creation. You can continue to use guest mode if you do not want
              account-based sync.
            </p>
          </div>

          <div>
            <h2 className="mb-1 text-base font-semibold text-foreground">4. Retention and Control</h2>
            <p>
              Guest-mode data remains in your browser until cleared. Account data is retained while your
              profile is active. You can request correction or deletion by contacting support.
            </p>
          </div>

          <div>
            <h2 className="mb-1 text-base font-semibold text-foreground">5. Contact</h2>
            <p>
              Privacy requests or questions can be sent to{" "}
              <a className="text-accent hover:text-accent-hover font-medium transition-colors" href="mailto:support@codememory.app">
                support@codememory.app
              </a>
              .
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
          <Link href="/about" className="text-sm font-medium text-accent hover:text-accent-hover transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-sm font-medium text-secondary hover:text-foreground transition-colors">
            Contact
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
