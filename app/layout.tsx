
import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Taskly — Simple Task Tracker",
  description: "A simple way to organize your tasks.",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html
          lang="en"
          className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
      <body className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
      {/* Navbar */}
      <nav className="absolute top-0 z-10 w-full">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
          {/* Logo */}
          <Link
              href="/"
              className="text-lg font-semibold tracking-tight"
          >
            taskly<span className="text-zinc-400">.</span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link
                href="/"
                className="text-zinc-500 transition hover:text-zinc-900"
            >
              Home
            </Link>

            <Link
                href="/tasks"
                className="text-zinc-500 transition hover:text-zinc-900"
            >
              Tasks
            </Link>
          </div>
        </div>
      </nav>

      {children}
      </body>
      </html>
  );
}