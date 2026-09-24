import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import Icon from "@/components/Icon";

const previewTasks = [
  { title: "Plan the day", time: "9:00 AM", done: true },
  { title: "Build something meaningful", time: "11:30 AM", done: false },
  { title: "Take a proper break", time: "1:00 PM", done: false },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-50 text-zinc-900">
      <SiteNav />

      <section className="page-enter relative mx-auto grid min-h-[calc(100vh-90px)] max-w-7xl items-center gap-14 px-6 pb-20 pt-32 lg:grid-cols-[.9fr_1.1fr] lg:gap-16 lg:px-10">
        <div className="max-w-xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3.5 py-2 text-xs font-medium text-zinc-500 shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            A little more focus, every day
          </div>

          <h1 className="max-w-lg text-5xl font-semibold leading-[1.04] tracking-[-0.055em] sm:text-6xl lg:text-6xl">
            Make room for
            <br />
            <span className="text-zinc-500">what matters.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-zinc-500 sm:text-lg sm:leading-8">
            A calmer place for your to-dos. Keep the next step close, make steady progress, and let the rest wait its turn.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/tasks" className="group inline-flex h-12 items-center gap-3 rounded-full bg-zinc-900 px-6 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-700">
              Open my tasks <Icon name="arrow" size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <span className="inline-flex items-center gap-2 px-2 text-xs text-zinc-400"><Icon name="check" size={15} /> Free, simple, yours</span>
          </div>

          <p className="mt-8 border-t border-zinc-200/80 pt-5 text-xs text-zinc-400">Private to your account <span className="mx-2">·</span> In sync wherever you sign in</p>
        </div>

        <div className="relative mx-auto w-full max-w-[590px] lg:ml-auto">
          <div className="absolute -inset-10 rounded-[42px] bg-gradient-to-br from-zinc-200/50 via-transparent to-zinc-300/40 blur-2xl" />
          <div className="hero-preview">
            <div className="hero-preview__topbar">
              <div className="flex items-center gap-2"><span className="site-nav__mark !h-7 !w-7 !rounded-[9px]"><Icon name="check" size={15} strokeWidth={2.3} /></span><span className="text-xs font-semibold tracking-tight">taskly<span className="text-zinc-400">.</span></span></div>
              <div className="flex items-center gap-1.5" aria-hidden="true"><span className="hero-preview__dot" /><span className="hero-preview__dot" /><span className="hero-preview__dot" /></div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-zinc-400">TODAY</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Your day, in view.</h2>
                </div>
                <span className="pb-1 text-xs font-medium text-zinc-500">1 of 3 done</span>
              </div>

              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-zinc-200"><div className="h-full w-1/3 rounded-full bg-zinc-900" /></div>
              <div className="task-list-enter mt-4 divide-y divide-zinc-200/70">
                  {previewTasks.map((task) => (
                    <div className="hero-preview__row" key={task.title}>
                      <span className={`task-check ${task.done ? "task-check--done" : ""}`}>{task.done && <Icon name="check" size={13} strokeWidth={2.5} />}</span>
                      <span className={`min-w-0 flex-1 truncate text-sm font-medium ${task.done ? "text-zinc-400 line-through" : "text-zinc-800"}`}>{task.title}</span>
                      <span className="hidden text-[11px] text-zinc-400 sm:block">{task.time}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
