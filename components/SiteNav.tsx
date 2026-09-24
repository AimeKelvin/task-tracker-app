import Link from "next/link";
import Icon from "@/components/Icon";
import ThemeToggle from "@/components/ThemeToggle";
import UserNav from "@/components/UserNav";

export default function SiteNav() {
    return (
        <nav className="site-nav" aria-label="Main navigation">
            <div className="site-nav__bar">
                <Link href="/" className="site-nav__brand" aria-label="Taskly home">
                    <span className="site-nav__mark"><Icon name="check" size={18} strokeWidth={2.3} /></span>
                    taskly<span className="text-zinc-400">.</span>
                </Link>

                <div className="site-nav__links">
                    <Link href="/" className="site-nav__link"><Icon name="home" size={15} />Home</Link>
                    <Link href="/tasks" className="site-nav__link"><Icon name="list" size={15} />Tasks</Link>
                </div>

                <div className="site-nav__actions">
                    <ThemeToggle />
                    <UserNav />
                </div>
            </div>
        </nav>
    );
}
