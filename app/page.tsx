import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-full flex-col bg-zinc-50">
      <SiteHeader userEmail={user?.email} />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-20">
        <p className="text-sm font-medium uppercase tracking-wide text-blue-600">
          Linktree meets Pocket
        </p>
        <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          Save bookmarks privately, share the ones you choose.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-zinc-600">
          BookmarkHub lets you collect links, mark them public or private, and publish a simple
          profile page for the world to see.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {user ? (
            <Link
              href="/dashboard"
              className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700"
            >
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/signup"
                className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700"
              >
                Get started
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
              >
                Log in
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
