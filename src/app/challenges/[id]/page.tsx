"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically import Monaco Editor (client-side only)
const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <div className="h-96 bg-subtle animate-pulse rounded" />,
});

interface Challenge {
  id: string;
  title: string;
  description: string;
  language: string;
  stage: number;
  difficulty: string;
  starterCode: string;
  testCases: Array<{
    input: string;
    expected: string;
    description: string;
  }>;
  hints: string[];
  concept: {
    name: string;
  };
}

interface TestResult {
  passed: boolean;
  message: string;
  expected: string;
  actual: string;
}

export default function ChallengePage() {
  const params = useParams();
  const router = useRouter();
  const challengeId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  const loadChallenge = useCallback(async () => {
    if (!challengeId) return;

    try {
      const response = await fetch(`/api/challenges/${challengeId}`);
      if (response.ok) {
        const data = await response.json();
        setChallenge(data.challenge);
        setCode(data.challenge.starterCode);
      }
    } catch (error) {
      console.error("Failed to load challenge:", error);
    }
  }, [challengeId]);

  useEffect(() => {
    void loadChallenge();
  }, [loadChallenge]);

  async function runCode() {
    if (!challenge) return;

    setIsRunning(true);
    setOutput("");
    setTestResults([]);

    try {
      // Use our API endpoint for code execution
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: challenge.language,
          code: code,
          testCases: challenge.testCases,
        }),
      });

      const result = await response.json();

      if (result.output) {
        setOutput(result.output);
      }

      if (result.testResults) {
        setTestResults(result.testResults);
      }
    } catch (error) {
      setOutput(`Error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  }

  function getEditorLanguage(language: string): string {
    const languageMap: Record<string, string> = {
      javascript: "javascript",
      python: "python",
      typescript: "typescript",
      css: "css",
      html: "html",
    };
    return languageMap[language] || "plaintext";
  }

  const allTestsPassed = testResults.length > 0 && testResults.every((r) => r.passed);

  if (!challenge) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-secondary">Loading challenge...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-accent hover:text-accent-hover mb-4 flex items-center text-sm font-medium transition-colors"
          >
            ← Back
          </button>
          <div className="bg-card rounded-lg border border-border shadow-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-xl font-semibold text-foreground mb-1">
                  {challenge.title}
                </h1>
                <p className="text-secondary text-sm">{challenge.concept.name}</p>
              </div>
              <div className="flex gap-2">
                <span className="px-2.5 py-1 bg-accent-subtle text-accent rounded-full text-xs font-medium">
                  Stage {challenge.stage}
                </span>
                <span className="px-2.5 py-1 bg-subtle text-secondary rounded-full text-xs font-medium">
                  {challenge.difficulty}
                </span>
              </div>
            </div>
            <p className="text-secondary text-sm mb-4">{challenge.description}</p>

            {/* Hints */}
            <button
              onClick={() => setShowHints(!showHints)}
              className="text-accent hover:text-accent-hover text-sm font-medium transition-colors"
            >
              {showHints ? "Hide" : "Show"} Hints ({challenge.hints.length})
            </button>
            {showHints && (
              <ul className="mt-2 space-y-1">
                {challenge.hints.map((hint, i) => (
                  <li key={i} className="text-sm text-secondary">
                    💡 {hint}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-card rounded-lg border border-border shadow-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-foreground">Code</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setCode(challenge.starterCode)}
                  className="text-secondary hover:text-foreground px-3 py-1 text-sm border border-border rounded-lg hover:bg-subtle transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    allTestsPassed
                      ? "bg-success text-white hover:opacity-90"
                      : "bg-accent text-white hover:bg-accent-hover"
                  } disabled:opacity-50`}
                >
                  {isRunning ? "Running..." : allTestsPassed ? "✓ Tests Passed" : "Run Code"}
                </button>
              </div>
            </div>
            <Editor
              height="400px"
              language={getEditorLanguage(challenge.language)}
              value={code}
              onChange={(value) => setCode(value || "")}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>

          {/* Output */}
          <div className="bg-card rounded-lg border border-border shadow-card p-5">
            <h2 className="text-base font-semibold text-foreground mb-4">Output</h2>
            
            {/* Test Results */}
            {testResults.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-secondary mb-2">Test Results:</h3>
                <div className="space-y-2">
                  {testResults.map((result, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg ${
                        result.passed
                          ? "bg-success-subtle border border-[var(--success)]"
                          : "bg-error-subtle border border-[var(--error)]"
                      }`}
                    >
                      <div
                        className={`flex items-center gap-2 font-medium text-sm ${
                          result.passed ? "text-success" : "text-error"
                        }`}
                      >
                        <span>{result.passed ? "✓" : "✗"}</span>
                        <span>{result.message}</span>
                      </div>
                      {!result.passed && (
                        <div className="mt-2 text-xs space-y-1 text-secondary">
                          <div>
                            <strong>Expected:</strong> {result.expected}
                          </div>
                          <div>
                            <strong>Got:</strong> {result.actual}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {testResults.every((r) => r.passed) && (
                  <div className="mt-3 p-3 bg-success-subtle border border-[var(--success)] rounded-lg text-success font-medium text-center text-sm">
                    All tests passed!
                  </div>
                )}
              </div>
            )}

            {/* Console Output */}
            <div className="bg-[var(--bg-code)] text-[var(--text-code)] p-4 rounded-lg font-mono text-sm h-64 overflow-auto">
              {output || "Run your code to see output..."}
            </div>

            {/* Expected Test Cases */}
            <div className="mt-4">
              <h3 className="text-sm font-medium text-secondary mb-2">Test Cases:</h3>
              {challenge.testCases.map((test, i) => (
                <div key={i} className="text-sm text-secondary mb-1">
                  <strong>Input:</strong> {test.input} →{" "}
                  <strong>Expected:</strong> {test.expected}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
