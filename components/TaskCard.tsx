
import { Task } from "@/types/task";

interface TaskCardProps {
    task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
    const statusStyles = {
        todo: "bg-zinc-100 text-zinc-600",
        in_progress: "bg-blue-50 text-blue-600",
        completed: "bg-green-50 text-green-600",
    };

    const statusLabels = {
        todo: "To do",
        in_progress: "In progress",
        completed: "Completed",
    };

    return (
        <div className="rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300">
            {/* Top row */}
            <div className="flex items-start justify-between gap-4">
                <h3 className="font-medium text-zinc-900">
                    {task.title}
                </h3>

                <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                        statusStyles[task.status]
                    }`}
                >
          {statusLabels[task.status]}
        </span>
            </div>

            {/* Description */}
            <p className="mt-2 text-sm leading-6 text-zinc-500">
                {task.description}
            </p>

            {/* Bottom row */}
            <div className="mt-5 flex items-center justify-between">
        <span className="text-xs text-zinc-400">
          {task.createdAt.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
          })}
        </span>

                <span className="text-xs text-zinc-400">
          #{task.id}
        </span>
            </div>
        </div>
    );
}