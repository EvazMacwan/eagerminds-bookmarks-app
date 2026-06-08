import Link from "next/link";

type SiteHeaderProps = {
  userEmail?: string | null;
};

export function SiteHeader({ userEmail }: SiteHeaderProps) {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-zinc-900">
          BookmarkKHub
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-zinc-600">
          {userEmail ? (
            <>
              <span className="hidden text-zinc-500 sm:inline">{userEmail}</span>
              <Link href="/dashboard" className="hover:text-zinc-900">
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-zinc-900">
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-zinc-900 px-3 py-1.5 text-white hover:bg-zinc-700"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
