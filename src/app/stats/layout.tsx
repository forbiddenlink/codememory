import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning Analytics and Study Trends",
  description:
    "Inspect streaks, daily review activity, rating distribution, and card-state trends to improve your spaced-repetition study habits.",
  alternates: {
    canonical: "/stats",
  },
};

export default function StatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
