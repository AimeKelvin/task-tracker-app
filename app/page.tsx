
import Link from "next/link";

export default function Home() {
  return (
      <main className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900">
        {/* Hero */}
        <section className="flex flex-1 items-center justify-center px-6">
          <div className="flex w-full max-w-2xl flex-col items-center text-center">
            {/* Small label */}
            <div className="mb-6 flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-500 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Simple task management
            </div>

            {/* Title */}
            <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
              Get things done.
              <br />
              <span className="text-zinc-400">One task at a time.</span>
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-md text-base leading-7 text-zinc-500">
              A simple task tracker to organize your day,
              stay focused, and get more done.
            </p>

            {/* CTA */}
            <Link
                href="/tasks"
                className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-medium text-white transition hover:bg-zinc-700"
            >
              Go to my tasks
              <span className="ml-2">→</span>
            </Link>

            {/* Minimal visual */}
            <div className="mt-16 w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-4 text-left shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-semibold">Today's tasks</span>
                <span className="text-xs text-zinc-400">3 tasks</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-900 text-[10px] text-white">
                    ✓
                  </div>
                  <span className="text-sm text-zinc-400 line-through">
                  Plan the day
                </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full border border-zinc-300" />
                  <span className="text-sm text-zinc-700">
                  Work on project
                </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full border border-zinc-300" />
                  <span className="text-sm text-zinc-700">
                  Review progress
                </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
  );
}