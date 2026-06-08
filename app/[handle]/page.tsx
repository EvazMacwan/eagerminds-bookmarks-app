import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { createClient } from "@/lib/supabase/server";
import { normalizeHandle, RESERVED_HANDLES } from "@/lib/handles";

type PublicProfilePageProps = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({
  params,
}: PublicProfilePageProps): Promise<Metadata> {
  const { handle } = await params;
  const normalizedHandle = normalizeHandle(handle);

  return {
    title: `@${normalizedHandle} | BookmarkHub`,
    description: `Public bookmarks by @${normalizedHandle}`,
  };
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { handle } = await params;
  const normalizedHandle = normalizeHandle(handle);

  if (RESERVED_HANDLES.includes(normalizedHandle as (typeof RESERVED_HANDLES)[number])) {
    notFound();
  }

  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, handle")
    .eq("handle", normalizedHandle)
    .single();

  if (!profile) {
    notFound();
  }

  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("id, title, url, created_at")
    .eq("user_id", profile.id)
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  return (
    <div className="flex min-h-full flex-col bg-zinc-50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-blue-600">Public profile</p>
          <h1 className="mt-2 text-4xl font-semibold text-zinc-900">@{profile.handle}</h1>
          <p className="mt-2 text-zinc-600">Shared bookmarks from BookmarkHub</p>
        </div>

        {bookmarks && bookmarks.length > 0 ? (
          <ul className="mt-10 space-y-3">
            {bookmarks.map((bookmark) => (
              <li key={bookmark.id}>
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-center shadow-sm transition hover:border-zinc-300 hover:shadow"
                >
                  <span className="font-medium text-zinc-900">{bookmark.title}</span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-10 rounded-2xl border border-dashed border-zinc-300 bg-white px-5 py-10 text-center text-sm text-zinc-500">
            No public bookmarks yet.
          </p>
        )}

        <p className="mt-10 text-center text-sm text-zinc-500">
          <Link href="/" className="font-medium text-zinc-700 hover:underline">
            Create your own BookmarkHub
          </Link>
        </p>
      </main>
    </div>
  );
}
