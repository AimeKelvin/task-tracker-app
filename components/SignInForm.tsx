"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/components/AuthProvider";
import { getAuthErrorMessage } from "@/lib/auth-errors";

const fieldClass = "mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-400";
const buttonClass = "inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50";

export default function SignInForm() {
    const { configured, loading: authLoading, signIn, signUp, signInWithGoogle } = useAuth();
    const router = useRouter();
    const [mode, setMode] = useState<"signin" | "signup">("signin");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setBusy(true);
        setError("");
        try {
            if (mode === "signup") await signUp(name, email, password);
            else await signIn(email, password);
            router.replace("/tasks");
        } catch (cause) {
            setError(getAuthErrorMessage(cause));
        } finally {
            setBusy(false);
        }
    }

    async function googleSignIn() {
        setBusy(true);
        setError("");
        try {
            await signInWithGoogle();
            router.replace("/tasks");
        } catch (cause) {
            setError(getAuthErrorMessage(cause));
        } finally {
            setBusy(false);
        }
    }

    if (authLoading) return <p className="text-sm text-zinc-500">Checking your session…</p>;
    if (!configured) {
        return (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
                Firebase is not configured yet. Copy <code>.env.example</code> to <code>.env.local</code>, add your Firebase web app values, and restart the dev server.
            </div>
        );
    }

    return (
        <section className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium text-zinc-400">{mode === "signin" ? "Welcome back" : "Get started"}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">{mode === "signin" ? "Sign in to Taskly" : "Create your account"}</h1>
            <p className="mt-2 text-sm leading-6 text-zinc-500">Keep your tasks organized and in sync.</p>

            <button type="button" onClick={googleSignIn} disabled={busy} className="mt-5 flex h-11 w-full items-center justify-center gap-3 rounded-full border border-zinc-200 text-sm font-medium transition hover:bg-zinc-50 disabled:opacity-50">
                <span className="font-semibold text-blue-600">G</span> Continue with Google
            </button>

            <div className="my-5 flex items-center gap-4 text-xs text-zinc-400"><span className="h-px flex-1 bg-zinc-100" />or with email<span className="h-px flex-1 bg-zinc-100" /></div>

            <form onSubmit={submit} className="space-y-4">
                {mode === "signup" && <label className="block text-sm font-medium">Name<input required autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} className={fieldClass} placeholder="Your name" /></label>}
                <label className="block text-sm font-medium">Email<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className={fieldClass} placeholder="you@example.com" /></label>
                <label className="block text-sm font-medium">Password<input required minLength={6} type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} value={password} onChange={(event) => setPassword(event.target.value)} className={fieldClass} placeholder="At least 6 characters" /></label>
                {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
                <button type="submit" disabled={busy} className={`${buttonClass} w-full`}>{busy ? "Please wait…" : mode === "signin" ? "Sign in with email" : "Create account"}</button>
            </form>

            <p className="mt-5 text-center text-sm text-zinc-500">
                {mode === "signin" ? "New to Taskly?" : "Already have an account?"}{" "}
                <button type="button" onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); }} className="font-medium text-zinc-900 underline underline-offset-4">
                    {mode === "signin" ? "Create an account" : "Sign in"}
                </button>
            </p>
        </section>
    );
}
