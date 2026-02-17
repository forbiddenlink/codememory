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
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Privacy Policy</h1>
        <p className="mb-6 text-sm text-gray-600">
          By <span className="font-medium">CodeMemory Team</span> • Effective date:{" "}
          <time dateTime="2026-02-16">February 16, 2026</time>
        </p>

        <h2 className="mb-2 text-xl font-semibold text-gray-900">1. Data We Store</h2>
        <p className="mb-4 text-gray-700">
          In guest mode, your review progress is stored locally in your browser so you can use the
          app without creating an account. In authenticated mode, account-linked progress and
          learning records are stored in the application database to support sync across sessions
          and devices.
        </p>

        <h2 className="mb-2 text-xl font-semibold text-gray-900">2. How We Use Data</h2>
        <p className="mb-4 text-gray-700">
          Data is used to provide the product experience: scheduling due cards, tracking review
          outcomes, and generating progress analytics. We do not sell personal information. We use
          operational logs and diagnostics to maintain uptime, investigate bugs, and improve feature
          quality.
        </p>

        <h2 className="mb-2 text-xl font-semibold text-gray-900">3. Authentication and Providers</h2>
        <p className="mb-4 text-gray-700">
          If you choose to sign in, third-party authentication providers may share profile details
          required for account creation and login. The data shared depends on provider permissions
          you approve. You can continue to use guest mode if you do not want account-based sync.
        </p>

        <h2 className="mb-2 text-xl font-semibold text-gray-900">4. Retention and Control</h2>
        <p className="mb-4 text-gray-700">
          Guest-mode data remains in your browser until cleared. Account data is retained while your
          profile is active and for operational continuity unless deletion is requested. You can
          request correction or deletion by contacting support.
        </p>

        <h2 className="mb-2 text-xl font-semibold text-gray-900">5. Contact</h2>
        <p className="mb-4 text-gray-700">
          We will never ask you for secrets, passwords, or private keys over email. If a request is
          ambiguous, we may ask for verification details before processing account-related actions.
          This verification step protects your data from unauthorized requests.
        </p>
        <p className="mb-4 text-gray-700">
          If this policy changes in a way that materially affects how personal data is handled, we
          will update this page with a new effective date and publish the revised terms in the
          application. Continued use after updates indicates acceptance of the revised policy.
        </p>
        <p className="mb-8 text-gray-700">
          Privacy requests or questions can be sent to{" "}
          <a className="text-indigo-600 hover:text-indigo-700 font-medium" href="mailto:support@codememory.app">
            support@codememory.app
          </a>
          .
        </p>
        <p className="mb-8 text-gray-700">
          We review privacy practices periodically as the product evolves. If storage mechanisms,
          authentication providers, or data-processing workflows change in a way that affects user
          rights, this policy will be revised with updated language and dates. We recommend reviewing
          this page occasionally if you rely on specific data handling guarantees.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link href="/about" className="text-indigo-600 hover:text-indigo-700 font-medium">
            About
          </Link>
          <Link href="/contact" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Contact
          </Link>
          <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-700 font-medium">
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
