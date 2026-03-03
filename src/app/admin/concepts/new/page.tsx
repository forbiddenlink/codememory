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
    } catch {
      setError("An error occurred while creating the concept");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-tertiary focus:ring-2 focus:ring-accent focus:border-transparent transition-colors text-sm";

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b border-border">
        <div className="max-w-2xl mx-auto px-6">
          <div className="flex justify-between h-14 items-center">
            <h1 className="text-lg font-semibold text-foreground">
              Create New Concept
            </h1>
            <Link href="/admin" className="text-sm text-accent hover:text-accent-hover transition-colors">
              ← Back
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-error-subtle border border-[var(--error)] text-error p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="bg-card rounded-lg border border-border shadow-card p-5 space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
                Concept Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="e.g., JavaScript Promises"
                className={inputClasses}
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-foreground mb-1.5">
                Category *
              </label>
              <input
                type="text"
                id="category"
                name="category"
                required
                placeholder="e.g., Async Programming, Data Structures, etc."
                className={inputClasses}
              />
            </div>

            {/* Language */}
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-foreground mb-1.5">
                Programming Language
              </label>
              <input
                type="text"
                id="language"
                name="language"
                placeholder="e.g., JavaScript, Python, TypeScript"
                className={inputClasses}
              />
              <p className="mt-1 text-xs text-tertiary">
                Optional — Leave blank for language-agnostic concepts
              </p>
            </div>

            {/* Difficulty */}
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-foreground mb-1.5">
                Difficulty Level *
              </label>
              <select
                id="difficulty"
                name="difficulty"
                required
                defaultValue="2"
                className={inputClasses}
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
              <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1.5">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                placeholder="What will students learn from this concept?"
                className={inputClasses}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm"
            >
              {loading ? "Creating..." : "Create Concept"}
            </button>
            <Link
              href="/admin"
              className="px-5 py-2.5 border border-border rounded-lg hover:bg-subtle transition-colors text-sm text-secondary"
            >
              Cancel
            </Link>
          </div>
        </form>

        {/* Helper Text */}
        <div className="mt-6 bg-accent-subtle border border-accent rounded-lg p-5">
          <h3 className="text-sm font-semibold text-foreground mb-2">
            Content Guidelines
          </h3>
          <ul className="list-disc list-inside space-y-1 text-secondary text-sm">
            <li>Choose concepts you&apos;re actively learning or want to master</li>
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
