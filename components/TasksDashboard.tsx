"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";
import SiteNav from "@/components/SiteNav";
import TaskCard from "@/components/TaskCard";
import Icon from "@/components/Icon";
import { useAuth } from "@/components/AuthProvider";
import { db } from "@/lib/firebase";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import type { Task, TaskStatus } from "@/types/task";

const buttonClass = "inline-flex h-10 items-center justify-center rounded-full bg-zinc-900 px-5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50";
const statuses: TaskStatus[] = ["todo", "in_progress", "completed"];
const filters: { id: TaskStatus | "all"; label: string }[] = [
    { id: "all", label: "All tasks" },
    { id: "todo", label: "To do" },
    { id: "in_progress", label: "In progress" },
    { id: "completed", label: "Completed" },
];

export default function TasksDashboard() {
    const { user, loading: authLoading, configured } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [tasksUserId, setTasksUserId] = useState<string | null>(null);
    const [loadingTasks, setLoadingTasks] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [subscriptionAttempt, setSubscriptionAttempt] = useState(0);
    const [editingTask, setEditingTask] = useState<Task | null | undefined>(undefined);
    const [pendingWrites, setPendingWrites] = useState(0);
    const [error, setError] = useState("");
    const [activeFilter, setActiveFilter] = useState<TaskStatus | "all">("all");

    useEffect(() => {
        if (!user || !db) return;

        const taskQuery = query(
            collection(db, "users", user.uid, "tasks"),
            orderBy("createdAt", "desc"),
        );
        return onSnapshot(taskQuery, (snapshot) => {
            setTasksUserId(user.uid);
            setTasks(snapshot.docs.map((taskDoc) => {
                const data = taskDoc.data({ serverTimestamps: "estimate" });
                return {
                    id: taskDoc.id,
                    title: data.title,
                    description: data.description ?? "",
                    status: data.status,
                    createdAt: data.createdAt?.toDate?.() ?? new Date(),
            } as Task;
            }));
            setLoadingTasks(false);
            setLoadError("");
            setError("");
        }, (cause) => {
            setTasksUserId(user.uid);
            setLoadError(getAuthErrorMessage(cause));
            setLoadingTasks(false);
        });
    }, [user, subscriptionAttempt]);

    function trackWrite(write: Promise<unknown>) {
        setPendingWrites((count) => count + 1);
        void write.then(
            () => setPendingWrites((count) => Math.max(0, count - 1)),
            (cause: unknown) => {
                setPendingWrites((count) => Math.max(0, count - 1));
                setError(getAuthErrorMessage(cause));
            },
        );
    }

    function saveTask(values: Pick<Task, "title" | "description" | "status">) {
        if (!user || !db) return;
        setError("");
        try {
            let write: Promise<unknown>;
            if (editingTask) {
                write = updateDoc(doc(db, "users", user.uid, "tasks", editingTask.id), values);
            } else {
                write = addDoc(collection(db, "users", user.uid, "tasks"), {
                    ...values,
                    createdAt: serverTimestamp(),
                });
            }
            trackWrite(write);
            setEditingTask(undefined);
        } catch (cause) {
            setError(getAuthErrorMessage(cause));
        }
    }

    function changeStatus(task: Task, status: TaskStatus) {
        if (!user || !db) return;
        setError("");
        try {
            trackWrite(updateDoc(doc(db, "users", user.uid, "tasks", task.id), { status }));
        } catch (cause) {
            setError(getAuthErrorMessage(cause));
        }
    }

    function removeTask(task: Task) {
        if (!user || !db || !window.confirm(`Delete “${task.title}”?`)) return;
        setError("");
        try {
            trackWrite(deleteDoc(doc(db, "users", user.uid, "tasks", task.id)));
        } catch (cause) {
            setError(getAuthErrorMessage(cause));
        }
    }

    const completedCount = tasks.filter((task) => task.status === "completed").length;
    const inProgressCount = tasks.filter((task) => task.status === "in_progress").length;
    const filteredTasks = activeFilter === "all" ? tasks : tasks.filter((task) => task.status === activeFilter);

    return (
        <div className="page-enter relative min-h-screen bg-zinc-50">
            <SiteNav />
            <main className="min-h-screen px-6 pb-20 pt-32 sm:pt-36">
                <div className="mx-auto max-w-5xl">
                    {authLoading ? (
                        <p className="mt-8 text-sm text-zinc-500">Checking your session…</p>
                    ) : !configured ? (
                        <SetupNotice />
                    ) : !user ? (
                        <div className="mt-8 rounded-3xl border border-zinc-200 bg-white p-8 sm:p-12">
                            <p className="text-sm font-medium text-zinc-400">Your personal workspace</p>
                            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Sign in to see your tasks.</h1>
                            <p className="mt-3 max-w-lg text-sm leading-6 text-zinc-500">Your tasks are private to your account and available anywhere you sign in.</p>
                            <Link href="/signin" className={`${buttonClass} mt-6`}>Sign in or create an account <span className="ml-2">→</span></Link>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.13em] text-zinc-400"><span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Your personal space</p>
                                    <h1 className="mt-3 text-4xl font-semibold tracking-[-.055em] text-zinc-900 sm:text-5xl">Your tasks<span className="text-zinc-400">.</span></h1>
                                    <p className="mt-3 text-sm leading-6 text-zinc-500">A clear view of what you&apos;re working on{user.displayName ? `, ${user.displayName.split(" ")[0]}` : ""}.</p>
                                </div>
                                <button type="button" onClick={() => setEditingTask(null)} className={`${buttonClass} h-11 gap-2 px-5 shadow-lg shadow-zinc-900/10`}><Icon name="plus" size={16} /> Add a task</button>
                            </div>

                            <div className="mt-9 grid grid-cols-3 gap-3 sm:gap-4">
                                <SummaryCard label="Total tasks" value={tasks.length} icon="list" detail="in your list" />
                                <SummaryCard label="In progress" value={inProgressCount} icon="clock" detail="moving forward" />
                                <SummaryCard label="Completed" value={completedCount} icon="check" detail={tasks.length ? `${Math.round(completedCount / tasks.length * 100)}% of your list` : "ready when you are"} />
                            </div>

                            {error && <p role="alert" className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            {pendingWrites > 0 && (
                <p role="status" className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                    Syncing {pendingWrites === 1 ? "a change" : `${pendingWrites} changes`} with Firestore… If this stays here, check your connection and the Firestore database in Firebase Console.
                </p>
            )}

            {loadingTasks || tasksUserId !== user.uid ? (
                <p className="mt-10 text-sm text-zinc-500">Loading your tasks…</p>
            ) : loadError ? (
                <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm leading-6 text-red-800">
                    <p role="alert">Could not load your tasks: {loadError}</p>
                    <button type="button" onClick={() => { setLoadError(""); setLoadingTasks(true); setSubscriptionAttempt((attempt) => attempt + 1); }} className="mt-3 font-semibold underline underline-offset-4">Try again</button>
                </div>
            ) : tasks.length ? (
                <>
                    <div className="mt-9 flex items-center gap-1 overflow-x-auto border-b border-zinc-200 pb-3">
                        {filters.map((filter) => {
                            const count = filter.id === "all" ? tasks.length : tasks.filter((task) => task.status === filter.id).length;
                            return (
                                <button key={filter.id} type="button" onClick={() => setActiveFilter(filter.id)} aria-pressed={activeFilter === filter.id} className={`task-filter shrink-0 ${activeFilter === filter.id ? "task-filter--active" : ""}`}>
                                    {filter.label}<span className="task-filter__count">{count}</span>
                                </button>
                            );
                        })}
                    </div>
                    {filteredTasks.length ? (
                        <div className="task-list-enter mt-5 grid gap-4 sm:grid-cols-2">
                            {filteredTasks.map((task) => <TaskCard key={task.id} task={task} onEdit={setEditingTask} onDelete={removeTask} onStatusChange={changeStatus} />)}
                        </div>
                    ) : (
                        <div className="mt-6 rounded-3xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center">
                            <p className="font-medium">Nothing in this view yet.</p>
                            <button type="button" onClick={() => setActiveFilter("all")} className="mt-2 text-sm text-zinc-500 underline underline-offset-4">Show all tasks</button>
                        </div>
                    )}
                </>
            ) : (
                                <div className="mt-8 rounded-3xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-xl">✓</div>
                                    <h2 className="mt-4 font-semibold">A clear list is a good place to start.</h2>
                                    <p className="mt-2 text-sm text-zinc-500">Add a task and keep your next step in view.</p>
                                    <button type="button" onClick={() => setEditingTask(null)} className={`${buttonClass} mt-5 gap-2`}><Icon name="plus" size={16} /> Add your first task</button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            {editingTask !== undefined && <TaskEditor task={editingTask} error={error} onClose={() => setEditingTask(undefined)} onSave={saveTask} />}
        </div>
    );
}

function SummaryCard({ label, value, icon, detail }: { label: string; value: number; icon: "list" | "clock" | "check"; detail: string }) {
    return (
        <div className="summary-card rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2">
                <span className="truncate text-[11px] font-medium text-zinc-500 sm:text-xs">{label}</span>
                <span className="summary-card__icon hidden h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 sm:flex"><Icon name={icon} size={16} /></span>
            </div>
            <div className="mt-3 flex items-baseline gap-2 sm:mt-2"><span className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">{value}</span><span className="hidden truncate text-[11px] text-zinc-400 sm:inline">{detail}</span></div>
        </div>
    );
}

function TaskEditor({ task, error, onClose, onSave }: {
    task: Task | null;
    error: string;
    onClose: () => void;
    onSave: (values: Pick<Task, "title" | "description" | "status">) => void;
}) {
    const [title, setTitle] = useState(task?.title ?? "");
    const [description, setDescription] = useState(task?.description ?? "");
    const [status, setStatus] = useState<TaskStatus>(task?.status ?? "todo");

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        onSave({ title: title.trim(), description: description.trim(), status });
    }

    const inputClass = "mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-400";

    return (
        <div className="modal-in fixed inset-0 z-30 flex items-center justify-center bg-zinc-950/35 px-4 py-8" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
            <section role="dialog" aria-modal="true" aria-labelledby="task-editor-title" className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl sm:p-8">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium text-zinc-400">Task details</p>
                        <h2 id="task-editor-title" className="mt-1 text-2xl font-semibold tracking-tight">{task ? "Edit task" : "New task"}</h2>
                    </div>
                    <button type="button" onClick={onClose} aria-label="Close" className="rounded-full px-3 py-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900">✕</button>
                </div>
                <form onSubmit={submit} className="mt-6 space-y-4">
                    <label className="block text-sm font-medium">Title<input autoFocus required maxLength={120} value={title} onChange={(event) => setTitle(event.target.value)} className={inputClass} placeholder="What needs to get done?" /></label>
                    <label className="block text-sm font-medium">Description <span className="font-normal text-zinc-400">(optional)</span><textarea maxLength={1000} rows={4} value={description} onChange={(event) => setDescription(event.target.value)} className={`${inputClass} resize-y`} placeholder="Add a few details" /></label>
                    <label className="block text-sm font-medium">Status<select value={status} onChange={(event) => setStatus(event.target.value as TaskStatus)} className={inputClass}>{statuses.map((value) => <option key={value} value={value}>{value === "todo" ? "To do" : value === "in_progress" ? "In progress" : "Completed"}</option>)}</select></label>
                    {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="h-10 rounded-full px-5 text-sm font-medium text-zinc-500 transition hover:bg-zinc-100">Cancel</button>
                        <button type="submit" disabled={!title.trim()} className={buttonClass}>{task ? "Save changes" : "Add task"}</button>
                    </div>
                </form>
            </section>
        </div>
    );
}

function SetupNotice() {
    return (
        <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-8 text-amber-950 sm:p-12">
            <p className="text-sm font-medium text-amber-700">One-time setup</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Connect your Firebase project.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-amber-900">Copy <code>.env.example</code> to <code>.env.local</code>, add your Firebase web app configuration, enable Authentication providers, and create Firestore. The setup notes are in the project README.</p>
            <Link href="/signin" className={`${buttonClass} mt-6`}>Go to sign in</Link>
        </div>
    );
}
