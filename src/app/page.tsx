import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Brain, Code, Github, Sparkles, BookOpen } from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    // Already authenticated, go to dashboard
    redirect("/dashboard");
  }

  // Show landing page with guest + auth options
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Code<span className="text-indigo-600">Memory</span>
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Master web development through spaced repetition
          </p>
          <p className="text-gray-500">
            Where forgetting shows up as failing tests
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Learn Real Skills</h3>
              <p className="text-gray-600">JavaScript, React, CSS, Python, and more</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Scientific Scheduling</h3>
              <p className="text-gray-600">FSRS algorithm optimizes your review timing</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Code Challenges</h3>
              <p className="text-gray-600">Practice with real coding problems</p>
            </div>
          </div>
        </div>

        {/* Primary CTA: Guest Mode */}
        <Link
          href="/dashboard"
          className="w-full bg-indigo-600 text-white rounded-lg px-6 py-4 font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 mb-4 shadow-lg hover:shadow-xl"
        >
          <Sparkles className="w-5 h-5" />
          <span>Continue as Guest</span>
        </Link>

        <p className="text-center text-sm text-gray-500 mb-4">
          Try it instantly • No sign-up required • Progress saved in your browser
        </p>

        {/* Secondary CTA: GitHub Sign In */}
        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        <a
          href="/api/auth/signin"
          className="w-full bg-gray-900 text-white rounded-lg px-6 py-3 font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          <Github className="w-5 h-5" />
          <span>Sign in with GitHub</span>
        </a>

        <p className="text-center text-xs text-gray-500 mt-4">
          Sign in to sync progress across devices
        </p>
      </div>
    </div>
  );
}
