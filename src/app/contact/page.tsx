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
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Contact</h1>
        <p className="mb-6 text-sm text-gray-600">
          By <span className="font-medium">CodeMemory Team</span> • Last updated{" "}
          <time dateTime="2026-02-16">February 16, 2026</time>
        </p>

        <p className="mb-4 text-gray-700">
          If you run into an issue while reviewing cards, loading content, or tracking progress,
          send a message and include as much context as possible. Useful details include the page
          where the issue occurred, the browser/device you used, and a short description of the
          expected behavior versus what actually happened. This helps us reproduce and fix problems
          quickly.
        </p>
        <p className="mb-4 text-gray-700">
          We also welcome feedback on learning quality. If a flashcard is unclear, a challenge is
          misleading, or a concept pack needs expansion, tell us what you were trying to learn and
          what would have made the experience clearer. Product decisions prioritize practical
          outcomes, so concrete examples are especially valuable.
        </p>
        <p className="mb-4 text-gray-700">
          For partnership or educational use, include your organization context and timeline. We
          can help map concept coverage and challenge difficulty to your goals. For security-related
          reports, use the same contact channel and mark the subject line clearly so it is routed
          with priority.
        </p>
        <p className="mb-4 text-gray-700">
          We typically respond in one to two business days. When an incident affects data integrity,
          authentication, or account access, we prioritize response and remediation updates. If your
          request is time-sensitive, include a clear deadline in your message and we will confirm
          whether we can meet it.
        </p>
        <p className="mb-4 text-gray-700">
          We read every product suggestion. If you are requesting new concepts, challenges, or
          language coverage, include the exact topic and the level of depth you need. This helps us
          prioritize additions that are both educationally valuable and aligned with real-world web
          development workflows.
        </p>
        <p className="mb-8 text-gray-700">
          Email:{" "}
          <a className="text-indigo-600 hover:text-indigo-700 font-medium" href="mailto:support@codememory.app">
            support@codememory.app
          </a>
        </p>
        <p className="mb-8 text-gray-700">
          For the fastest resolution, include reproducible steps and expected behavior. If the report
          involves learning content, mention the concept name and card or challenge context. Clear
          reports reduce turnaround time and help us ship improvements with fewer follow-up questions.
        </p>
        <p className="mb-8 text-gray-700">
          If you are submitting curriculum feedback, include your target outcome and current skill
          level. This helps us shape explanations and challenge progression to match real learner
          needs rather than generic examples.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link href="/about" className="text-indigo-600 hover:text-indigo-700 font-medium">
            About
          </Link>
          <Link href="/privacy-policy" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Privacy Policy
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
