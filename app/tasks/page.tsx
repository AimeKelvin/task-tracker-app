
import Link from "next/link";
import TaskCard from "@/components/TaskCard";
import { Task } from "@/types/task";

const tasks: Task[] = [
    {
        id: "001",
        title: "Design homepage",
        description: "Create a clean and minimal landing page for the app.",
        status: "completed",
        createdAt: new Date("2026-09-20"),
    },
    {
        id: "002",
        title: "Build task components",
        description: "Create reusable components for displaying tasks.",
        status: "in_progress",
        createdAt: new Date("2026-09-21"),
    },
    {
        id: "003",
        title: "Set up database",
        description: "Connect the application to a database for task storage.",
        status: "todo",
        createdAt: new Date("2026-09-22"),
    },
    {
        id: "004",
        title: "Add authentication",
        description: "Allow users to securely sign in to their accounts.",
        status: "todo",
        createdAt: new Date("2026-09-22"),
    },
];

export default function TasksPage() {
    return (
        <main className="min-h-screen bg-zinc-50 px-6 pb-16 pt-32">
            <div className="mx-auto max-w-5xl">
                {/* Header */}
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <Link
                            href="/"
                            className="text-sm text-zinc-400 transition hover:text-zinc-900"
                        >
                            ← Back home
                        </Link>

                        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
                            Your tasks
                        </h1>

                        <p className="mt-2 text-sm text-zinc-500">
                            Keep track of what needs to get done.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="inline-flex h-10 items-center justify-center rounded-full bg-zinc-900 px-5 text-sm font-medium text-white transition hover:bg-zinc-700"
                    >
                        + New task
                    </button>
                </div>

                {/* Task list */}
                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                    {tasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </div>

                {/* Empty state (when no tasks exist) */}
                {tasks.length === 0 && (
                    <div className="mt-10 rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center">
                        <p className="text-sm text-zinc-500">
                            No tasks yet. Create your first task.
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}