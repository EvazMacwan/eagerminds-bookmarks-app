import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { BookmarkForm } from "@/components/BookmarkForm";
import { BookmarkList } from "@/components/BookmarkList";
import { signOut } from "@/app/actions/auth";
import { createBookmark } from "@/app/actions/bookmarks";
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
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-medium text-zinc-500">Email</dt>
              <dd className="text-zinc-900">{user.email}</dd>
            </div>
            <div>
              <dt className="font-medium text-zinc-500">Public handle</dt>
              <dd className="text-zinc-900">
                {profile?.handle ? `@${profile.handle}` : "Not set yet"}
              </dd>
            </div>
          </dl>
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
