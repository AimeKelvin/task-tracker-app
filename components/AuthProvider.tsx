"use client";

import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut as firebaseSignOut,
    updateProfile,
    GoogleAuthProvider,
    type User,
} from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { auth, firebaseConfigured } from "@/lib/firebase";

interface AuthContextValue {
    user: User | null;
    loading: boolean;
    configured: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (name: string, email: string, password: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(firebaseConfigured);

    useEffect(() => {
        if (!auth) return;
        return onAuthStateChanged(auth, (nextUser) => {
            setUser(nextUser);
            setLoading(false);
        });
    }, []);

    const value = useMemo<AuthContextValue>(() => ({
        user,
        loading,
        configured: firebaseConfigured,
        async signIn(email, password) {
            if (!auth) throw new Error("Firebase is not configured yet.");
            await signInWithEmailAndPassword(auth, email, password);
        },
        async signUp(name, email, password) {
            if (!auth) throw new Error("Firebase is not configured yet.");
            const credential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(credential.user, { displayName: name.trim() });
            setUser(credential.user);
        },
        async signInWithGoogle() {
            if (!auth) throw new Error("Firebase is not configured yet.");
            await signInWithPopup(auth, new GoogleAuthProvider());
        },
        async signOut() {
            if (!auth) return;
            await firebaseSignOut(auth);
        },
    }), [user, loading]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside AuthProvider.");
    return context;
}
