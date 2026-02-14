"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically import Monaco Editor (client-side only)
const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded" />,
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
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  useEffect(() => {
    loadChallenge();
  }, [params.id]);

  async function loadChallenge() {
    try {
      const response = await fetch(`/api/challenges/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setChallenge(data.challenge);
        setCode(data.challenge.starterCode);
      }
    } catch (error) {
      console.error("Failed to load challenge:", error);
    }
  }

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading challenge...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-indigo-600 hover:text-indigo-700 mb-4 flex items-center"
          >
            ← Back
          </button>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {challenge.title}
                </h1>
                <p className="text-gray-600">{challenge.concept.name}</p>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Stage {challenge.stage}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  {challenge.difficulty}
                </span>
              </div>
            </div>
            <p className="text-gray-700 mb-4">{challenge.description}</p>

            {/* Hints */}
            <button
              onClick={() => setShowHints(!showHints)}
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              {showHints ? "Hide" : "Show"} Hints ({challenge.hints.length})
            </button>
            {showHints && (
              <ul className="mt-2 space-y-1">
                {challenge.hints.map((hint, i) => (
                  <li key={i} className="text-sm text-gray-600">
                    💡 {hint}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Code</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setCode(challenge.starterCode)}
                  className="text-gray-600 hover:text-gray-800 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    allTestsPassed
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  } disabled:bg-gray-400`}
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
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Output</h2>
            
            {/* Test Results */}
            {testResults.length > 0 && (
              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-2">Test Results:</h3>
                <div className="space-y-2">
                  {testResults.map((result, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg ${
                        result.passed
                          ? "bg-green-50 border border-green-200"
                          : "bg-red-50 border border-red-200"
                      }`}
                    >
                      <div
                        className={`flex items-center gap-2 font-medium ${
                          result.passed ? "text-green-800" : "text-red-800"
                        }`}
                      >
                        <span>{result.passed ? "✓" : "✗"}</span>
                        <span className="text-sm">{result.message}</span>
                      </div>
                      {!result.passed && (
                        <div className="mt-2 text-xs space-y-1">
                          <div className="text-gray-700">
                            <strong>Expected:</strong> {result.expected}
                          </div>
                          <div className="text-gray-700">
                            <strong>Got:</strong> {result.actual}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {testResults.every((r) => r.passed) && (
                  <div className="mt-3 p-3 bg-green-100 border border-green-300 rounded-lg text-green-800 font-medium text-center">
                    🎉 All tests passed! Great job!
                  </div>
                )}
              </div>
            )}

            {/* Console Output */}
            <div className="bg-gray-900 text-gray-100 p-4 rounded font-mono text-sm h-64 overflow-auto">
              {output || "Run your code to see output..."}
            </div>

            {/* Expected Test Cases */}
            <div className="mt-4">
              <h3 className="font-medium text-gray-700 mb-2">Test Cases:</h3>
              {challenge.testCases.map((test, i) => (
                <div key={i} className="text-sm text-gray-600 mb-1">
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
