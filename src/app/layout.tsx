import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";

const inter = Inter({ subsets: ["latin"] });
const siteDescription =
  "CodeMemory helps you master web development with spaced repetition flashcards, coding challenges, and progress tracking that turns forgetting into practice.";
const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "CodeMemory | Master Web Development with Spaced Repetition",
    template: "%s | CodeMemory",
  },
  authors: [{ name: "CodeMemory Team" }],
  creator: "CodeMemory Team",
  publisher: "CodeMemory",
  description: siteDescription,
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    siteName: "CodeMemory",
    title: "CodeMemory | Master Web Development with Spaced Repetition",
    description: siteDescription,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "CodeMemory preview image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeMemory | Master Web Development with Spaced Repetition",
    description: siteDescription,
    images: ["/twitter-image"],
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentYear = new Date().getFullYear();

  return (
    <html lang="en">
      <head>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      </head>
      <body className={inter.className}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-gray-900 focus:shadow"
        >
          Skip to main content
        </a>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <div id="main-content" className="flex-1">
              {children}
            </div>
            <footer className="border-t border-border bg-card">
              <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-4 text-sm">
                <nav className="flex flex-wrap items-center gap-4">
                  <Link href="/dashboard" className="text-secondary hover:text-foreground transition-colors">
                    Dashboard
                  </Link>
                  <Link href="/review" className="text-secondary hover:text-foreground transition-colors">
                    Review
                  </Link>
                  <Link href="/stats" className="text-secondary hover:text-foreground transition-colors">
                    Analytics
                  </Link>
                  <Link href="/about" className="text-tertiary hover:text-secondary transition-colors">
                    About
                  </Link>
                  <Link href="/privacy-policy" className="text-tertiary hover:text-secondary transition-colors">
                    Privacy
                  </Link>
                </nav>
                <p className="text-tertiary">© {currentYear} CodeMemory</p>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
