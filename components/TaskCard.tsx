"use client";

import type { Task, TaskStatus } from "@/types/task";
import Icon from "@/components/Icon";

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
    onStatusChange: (task: Task, status: TaskStatus) => void;
}

const statusStyles: Record<TaskStatus, string> = {
    todo: "status-chip--todo",
    in_progress: "status-chip--progress",
    completed: "status-chip--complete",
};

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
    const date = task.createdAt.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    return (
        <article className="task-card rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <h2 className={`min-w-0 flex-1 font-medium text-zinc-900 ${task.status === "completed" ? "line-through decoration-zinc-300" : ""}`}>
                    {task.title}
                </h2>
                <select
                    aria-label={`Status for ${task.title}`}
                    value={task.status}
                    onChange={(event) => onStatusChange(task, event.target.value as TaskStatus)}
                    className={`status-chip shrink-0 cursor-pointer rounded-full border-0 px-2.5 py-1 text-xs font-medium outline-none ${statusStyles[task.status]}`}
                >
                    <option value="todo">To do</option>
                    <option value="in_progress">In progress</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            {task.description && <p className="mt-2 text-sm leading-6 text-zinc-500">{task.description}</p>}

            <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4">
                <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400"><Icon name="clock" size={13} /> Added {date}</span>
                <div className="flex items-center gap-1">
                    <button type="button" onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`} className="task-action text-zinc-500 transition hover:text-zinc-900"><Icon name="edit" size={15} /></button>
                    <button type="button" onClick={() => onDelete(task)} aria-label={`Delete ${task.title}`} className="task-action task-action--danger text-zinc-400 transition hover:text-red-600"><Icon name="trash" size={15} /></button>
                </div>
            </div>
        </article>
    );
}
