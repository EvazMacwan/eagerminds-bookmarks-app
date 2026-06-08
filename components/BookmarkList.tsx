"use client";

import { useState } from "react";
import { BookmarkForm } from "@/components/BookmarkForm";
import { deleteBookmark, updateBookmark } from "@/app/actions/bookmarks";
import type { Bookmark } from "@/lib/bookmarks";

type BookmarkListProps = {
  bookmarks: Bookmark[];
};

export function BookmarkList({ bookmarks }: BookmarkListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  if (bookmarks.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-500">
        No bookmarks yet. Add your first link above.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white">
      {bookmarks.map((bookmark) => {
        const isEditing = editingId === bookmark.id;

        return (
          <li key={bookmark.id} className="p-5">
            {isEditing ? (
              <BookmarkForm
                action={updateBookmark}
                submitLabel="Save changes"
                bookmark={bookmark}
                onCancel={() => setEditingId(null)}
                onSuccess={() => setEditingId(null)}
              />
            ) : (
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium text-zinc-900">{bookmark.title}</h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        bookmark.is_public
                          ? "bg-green-100 text-green-800"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {bookmark.is_public ? "Public" : "Private"}
                    </span>
                  </div>
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block truncate text-sm text-blue-600 hover:underline"
                  >
                    {bookmark.url}
                  </a>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingId(bookmark.id)}
                    className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
                  >
                    Edit
                  </button>
                  <form action={deleteBookmark}>
                    <input type="hidden" name="id" value={bookmark.id} />
                    <button
                      type="submit"
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
