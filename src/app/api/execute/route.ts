import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiter
// In production, use Redis or a proper rate limiting service
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per window
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  // Clean up expired entries periodically
  if (rateLimitMap.size > 1000) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }

  if (record.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: RATE_LIMIT - record.count };
}

/**
 * Execute code using Piston API
 * Public endpoint for challenge code execution
 */
export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ||
               request.headers.get("x-real-ip") ||
               "unknown";

    // Check rate limit
    const { allowed, remaining } = checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait before trying again." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(RATE_LIMIT),
            "X-RateLimit-Remaining": "0",
            "Retry-After": "60",
          },
        }
      );
    }

    const { language, code, testCases } = await request.json();

    if (!language || !code) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Execute code using Piston API
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: language,
        version: "*",
        files: [
          {
            name: `solution.${getFileExtension(language)}`,
            content: code,
          },
        ],
      }),
    });

    const result = await response.json();

    if (!result.run) {
      return NextResponse.json(
        { error: "Execution failed", details: result },
        { status: 500 }
      );
    }

    const output = result.run.stdout || result.run.stderr || "";
    const hasError = !!result.run.stderr;

    // Validate test cases if provided
    const testResults = testCases
      ? validateTestCases(output, testCases, hasError)
      : [];

    return NextResponse.json(
      {
        output,
        hasError,
        testResults,
        exitCode: result.run.code,
      },
      {
        headers: {
          "X-RateLimit-Limit": String(RATE_LIMIT),
          "X-RateLimit-Remaining": String(remaining),
        },
      }
    );
  } catch (error) {
    console.error("Code execution error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function getFileExtension(language: string): string {
  const extensions: Record<string, string> = {
    javascript: "js",
    python: "py",
    typescript: "ts",
    css: "css",
    html: "html",
  };
  return extensions[language] || "txt";
}

function validateTestCases(
  output: string,
  testCases: Array<{ input: string; expected: string; description: string }>,
  hasError: boolean
): Array<{ passed: boolean; message: string; expected: string; actual: string }> {
  if (hasError) {
    return testCases.map((test) => ({
      passed: false,
      message: `${test.description}: Failed - Code has errors`,
      expected: test.expected,
      actual: "Error",
    }));
  }

  return testCases.map((test) => {
    const outputLines = output.trim().split("\n");
    const normalizedOutput = output.trim().toLowerCase();
    const normalizedExpected = test.expected.trim().toLowerCase();

    // Simple validation - check if expected output is in the actual output
    const passed =
      normalizedOutput.includes(normalizedExpected) ||
      normalizedOutput === normalizedExpected;

    return {
      passed,
      message: passed
        ? `${test.description}: ✓ Passed`
        : `${test.description}: ✗ Failed`,
      expected: test.expected,
      actual: outputLines[outputLines.length - 1] || output,
    };
  });
}
