import Link from "next/link";
import Icon from "@/components/Icon";
import SignInForm from "@/components/SignInForm";

export default function SignInPage() {
    return (
        <main className="relative flex h-dvh items-center justify-center overflow-hidden bg-zinc-50 px-5 pb-4 pt-16 text-zinc-900 sm:px-6 sm:pt-20">
            <Link href="/tasks" className="absolute left-5 top-5 inline-flex h-10 items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900 sm:left-8 sm:top-8">
                <Icon name="arrow" size={15} className="rotate-180" />
                Back to tasks
            </Link>
            <SignInForm />
        </main>
    );
}
