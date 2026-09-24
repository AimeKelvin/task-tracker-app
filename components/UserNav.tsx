"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import Icon from "@/components/Icon";

export default function UserNav() {
    const { user, loading, signOut } = useAuth();
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function onPointerDown(event: PointerEvent) {
            if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
        }
        function onKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") setOpen(false);
        }
        document.addEventListener("pointerdown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("pointerdown", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, []);

    async function handleSignOut() {
        setError("");
        try {
            await signOut();
            setOpen(false);
        } catch {
            setError("Could not sign out. Please try again.");
        }
    }

    if (loading) return <span className="nav-user-loading" aria-label="Loading account" />;
    if (!user) {
        return <Link href="/signin" className="nav-sign-in">Sign in <Icon name="arrow" size={15} /></Link>;
    }

    const label = user.displayName || user.email || "Account";
    const initial = label.slice(0, 1).toUpperCase();

    return (
        <div className="nav-user" ref={rootRef}>
            <button
                type="button"
                className="nav-user-trigger"
                aria-expanded={open}
                aria-haspopup="dialog"
                aria-label="Open account profile"
                onClick={() => { setOpen((value) => !value); setError(""); }}
            >
                <span className="nav-user__avatar">{initial}</span>
                <span className="nav-user-trigger__name">{user.displayName || "Account"}</span>
                <Icon name="chevron" size={14} />
            </button>

            {open && (
                <section className="nav-user__popover" aria-label="Your profile">
                    <div className="nav-user__identity">
                        <span className="nav-user__avatar">{initial}</span>
                        <div className="min-w-0">
                            <p className="nav-user__name">{user.displayName || "Taskly member"}</p>
                            <p className="nav-user__email">{user.email}</p>
                        </div>
                    </div>
                    <div className="nav-user__divider" />
                    {error && <p role="alert" className="px-3 py-2 text-xs text-red-700">{error}</p>}
                    <button type="button" className="nav-user__menu-item nav-user__menu-item--danger" onClick={handleSignOut}>
                        <Icon name="logout" size={16} /> Sign out
                    </button>
                </section>
            )}
        </div>
    );
}
