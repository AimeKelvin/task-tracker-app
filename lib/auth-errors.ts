export function getAuthErrorMessage(error: unknown) {
    const code = typeof error === "object" && error && "code" in error
        ? String(error.code)
        : "";

    const messages: Record<string, string> = {
        "auth/email-already-in-use": "An account already exists for this email. Try signing in instead.",
        "auth/invalid-credential": "That email and password combination was not recognized.",
        "auth/invalid-email": "Enter a valid email address.",
        "auth/weak-password": "Choose a password with at least 6 characters.",
        "auth/operation-not-allowed": "This sign-in method is disabled in Firebase Authentication settings.",
        "auth/unauthorized-domain": "This domain is not allowed in Firebase Authentication settings.",
        "auth/popup-closed-by-user": "The Google sign-in window was closed before completing sign-in.",
        "auth/popup-blocked": "Your browser blocked the sign-in window. Allow pop-ups and try again.",
        "auth/network-request-failed": "A network error interrupted sign-in. Check your connection and try again.",
        "permission-denied": "Firestore denied this request. Check that the database exists and the project's firestore.rules have been published.",
        "unavailable": "Cloud Firestore is unavailable. Confirm that a Firestore database has been created in this Firebase project, then try again.",
        "failed-precondition": "Firestore rejected this request. Check the Firestore console for setup requirements or a missing index.",
    };

    if (messages[code]) return messages[code];
    if (code) {
        const detail = error instanceof Error ? error.message : "";
        return `Firebase request failed (${code})${detail ? `: ${detail}` : "."}`;
    }
    return "Something went wrong. Please try again.";
}
