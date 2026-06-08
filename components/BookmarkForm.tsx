"use client";

import { useActionState, useEffect, useRef } from "react";
import type { BookmarkActionState } from "@/app/actions/bookmarks";
import type { Bookmark } from "@/lib/bookmarks";

type BookmarkFormProps = {
  action: (
    prevState: BookmarkActionState,
    formData: FormData,
  ) => Promise<BookmarkActionState>;
  submitLabel: string;
  bookmark?: Bookmark;
  onCancel?: () => void;
  onSuccess?: () => void;
};

const initialState: BookmarkActionState = {};

const inputClassName =
  "rounded-lg border border-zinc-300 px-3 py-2 text-base font-normal text-zinc-900 outline-none ring-blue-500 focus:ring-2";

export function BookmarkForm({
  action,
  submitLabel,
  bookmark,
  onCancel,
  onSuccess,
}: BookmarkFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.success) {
      return;
    }

    if (bookmark) {
      onSuccess?.();
    } else {
      formRef.current?.reset();
    }
  }, [state.success, bookmark, onSuccess]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      {bookmark ? <input type="hidden" name="id" value={bookmark.id} /> : null}

      <label className="flex flex-col gap-1.5 text-sm font-medium text-zinc-700">
        Title
        <input
          type="text"
          name="title"
          required
          defaultValue={bookmark?.title ?? ""}
          className={inputClassName}
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium text-zinc-700">
        URL
        <input
          type="url"
          name="url"
          required
          placeholder="https://example.com"
          defaultValue={bookmark?.url ?? ""}
          className={inputClassName}
        />
      </label>

      <label className="flex items-center gap-2 text-sm text-zinc-700">
        <input
          type="checkbox"
          name="is_public"
          defaultChecked={bookmark?.is_public ?? false}
          className="size-4 rounded border-zinc-300"
        />
        Public (visible on your profile page)
      </label>

      {state.error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {state.error}
        </p>
      ) : null}

      {state.success ? (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800" role="status">
          {state.success}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving..." : submitLabel}
        </button>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
