"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewConceptPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      description: formData.get("description") as string,
      difficulty: parseInt(formData.get("difficulty") as string),
      language: formData.get("language") as string || null,
    };

    try {
      const response = await fetch("/api/admin/concepts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        router.push(`/admin?created=${result.concept.id}`);
      } else {
        const error = await response.json();
        setError(error.message || "Failed to create concept");
      }
    } catch (err) {
      setError("An error occurred while creating the concept");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Create New Concept
            </h1>
            <Link href="/admin" className="text-blue-600 hover:text-blue-700">
              ← Back
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 p-4 rounded-lg">
              {error}
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Concept Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="e.g., JavaScript Promises"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Category *
              </label>
              <input
                type="text"
                id="category"
                name="category"
                required
                placeholder="e.g., Async Programming, Data Structures, etc."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Language */}
            <div>
              <label
                htmlFor="language"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Programming Language
              </label>
              <input
                type="text"
                id="language"
                name="language"
                placeholder="e.g., JavaScript, Python, TypeScript"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Optional - Leave blank for language-agnostic concepts
              </p>
            </div>

            {/* Difficulty */}
            <div>
              <label
                htmlFor="difficulty"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Difficulty Level *
              </label>
              <select
                id="difficulty"
                name="difficulty"
                required
                defaultValue="2"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="1">1 - Beginner</option>
                <option value="2">2 - Intermediate</option>
                <option value="3">3 - Advanced</option>
                <option value="4">4 - Expert</option>
                <option value="5">5 - Master</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                placeholder="What will students learn from this concept?"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              {loading ? "Creating..." : "Create Concept"}
            </button>
            <Link
              href="/admin"
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>

        {/* Helper Text */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
            💡 Content Guidelines
          </h3>
          <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-300">
            <li>Choose concepts you're actively learning or want to master</li>
            <li>Each concept should have 10 flashcards (2 of each type)</li>
            <li>Each concept should have 5 challenges (stages 1-5)</li>
            <li>Start with beginner concepts, progress to advanced</li>
            <li>Build upon prerequisites (you can link them later)</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
