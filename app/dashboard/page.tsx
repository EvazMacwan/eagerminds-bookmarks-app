import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { BookmarkForm } from "@/components/BookmarkForm";
import { BookmarkList } from "@/components/BookmarkList";
import { HandleForm } from "@/components/HandleForm";
import { signOut } from "@/app/actions/auth";
import { createBookmark } from "@/app/actions/bookmarks";
import { setHandle } from "@/app/actions/profile";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: profile }, { data: bookmarks }] = await Promise.all([
    supabase.from("profiles").select("handle").eq("id", user.id).single(),
    supabase
      .from("bookmarks")
      .select("id, title, url, is_public, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div className="flex min-h-full flex-col bg-zinc-50">
      <SiteHeader userEmail={user.email} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-zinc-900">Dashboard</h1>
            <p className="mt-2 text-zinc-600">
              Add, edit, and delete your bookmarks. Public ones will appear on your profile.
            </p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
            >
              Sign out
            </button>
          </form>
        </div>

        <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-zinc-900">Account</h2>
          <p className="mt-1 text-sm text-zinc-600">{user.email}</p>

          <div className="mt-6 border-t border-zinc-100 pt-6">
            <h3 className="text-sm font-medium text-zinc-900">Public profile</h3>
            {profile?.handle ? (
              <p className="mt-2 text-sm text-zinc-600">
                Your profile is live at{" "}
                <Link
                  href={`/${profile.handle}`}
                  className="font-medium text-blue-600 hover:underline"
                  target="_blank"
                >
                  /{profile.handle}
                </Link>
              </p>
            ) : (
              <p className="mt-2 text-sm text-zinc-600">
                Claim a handle so others can view your public bookmarks.
              </p>
            )}
            <div className="mt-4 max-w-md">
              <HandleForm action={setHandle} currentHandle={profile?.handle} />
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-zinc-900">Add bookmark</h2>
          <div className="mt-4">
            <BookmarkForm action={createBookmark} submitLabel="Add bookmark" />
          </div>
        </section>

        <section className="mt-8">
          <h2 className="mb-4 text-lg font-medium text-zinc-900">
            Your bookmarks ({bookmarks?.length ?? 0})
          </h2>
          <BookmarkList bookmarks={bookmarks ?? []} />
        </section>
      </main>
    </div>
  );
}
