import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Review Flashcards and Strengthen Retention",
  description:
    "Run focused review sessions, reveal answers, and rate recall quality to keep web development concepts in long-term memory.",
  alternates: {
    canonical: "/review",
  },
};

export default function ReviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
