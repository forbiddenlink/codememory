import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Brain, Code, Github, Sparkles, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Master Web Development with Spaced Repetition",
  description:
    "Practice web development fundamentals with adaptive spaced repetition, coding challenges, and a zero-friction guest mode that works instantly.",
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    // Already authenticated, go to dashboard
    redirect("/dashboard");
  }

  // Show landing page with guest + auth options
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-card rounded-lg border border-border shadow-card p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Code<span className="text-accent">Memory</span>
          </h1>
          <p className="text-secondary">
            Master web development through spaced repetition
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-accent-subtle text-accent">
              <BookOpen className="w-[18px] h-[18px]" />
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">Learn Real Skills</p>
              <p className="text-secondary text-xs">JavaScript, React, CSS, Python</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-accent-subtle text-accent">
              <Brain className="w-[18px] h-[18px]" />
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">Scientific Scheduling</p>
              <p className="text-secondary text-xs">FSRS algorithm optimizes review timing</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-accent-subtle text-accent">
              <Code className="w-[18px] h-[18px]" />
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">Code Challenges</p>
              <p className="text-secondary text-xs">Practice with real coding problems</p>
            </div>
          </div>
        </div>

        {/* Primary CTA: Guest Mode */}
        <Link
          href="/dashboard"
          className="w-full bg-accent text-white rounded-lg px-6 py-3 font-medium hover:bg-accent-hover transition-colors flex items-center justify-center gap-2 mb-3"
        >
          <Sparkles className="w-4 h-4" />
          <span>Continue as Guest</span>
        </Link>

        <p className="text-center text-xs text-tertiary mb-4">
          Try instantly • No sign-up • Progress saved locally
        </p>

        {/* Secondary CTA: GitHub Sign In */}
        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-card text-tertiary">or</span>
          </div>
        </div>

        <form action="/api/auth/signin">
          <button
            type="submit"
            className="w-full bg-foreground text-background rounded-lg px-6 py-2.5 font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Github className="w-4 h-4" />
            <span>Sign in with GitHub</span>
          </button>
        </form>

        <p className="text-center text-xs text-tertiary mt-3">
          Sync progress across devices
        </p>

        <section className="mt-6 pt-5 border-t border-border text-left">
          <h2 className="text-base font-semibold text-foreground mb-2">How It Works</h2>
          <p className="text-secondary text-sm">
            Actively retrieve information through prompts, rate your recall, and the FSRS algorithm
            schedules reviews when they’re most effective for memory formation.
          </p>
        </section>
      </div>
    </main>
  );
}
