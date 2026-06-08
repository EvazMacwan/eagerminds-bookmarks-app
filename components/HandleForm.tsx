"use client";

import { useActionState } from "react";
import type { ProfileActionState } from "@/app/actions/profile";

type HandleFormProps = {
  action: (
    prevState: ProfileActionState,
    formData: FormData,
  ) => Promise<ProfileActionState>;
  currentHandle?: string | null;
};

const initialState: ProfileActionState = {};

const inputClassName =
  "rounded-lg border border-zinc-300 px-3 py-2 text-base font-normal text-zinc-900 outline-none ring-blue-500 focus:ring-2";

export function HandleForm({ action, currentHandle }: HandleFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm font-medium text-zinc-700">
        Public handle
        <div className="flex items-center gap-2">
          <span className="text-zinc-500">@</span>
          <input
            type="text"
            name="handle"
            required
            minLength={3}
            maxLength={30}
            pattern="[a-zA-Z0-9_]+"
            defaultValue={currentHandle ?? ""}
            placeholder="yourname"
            className={`${inputClassName} flex-1`}
          />
        </div>
      </label>
      <p className="text-xs text-zinc-500">
        3–30 characters. Letters, numbers, and underscores only. Your profile will be at
        /yourhandle
      </p>

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

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving..." : currentHandle ? "Update handle" : "Claim handle"}
      </button>
    </form>
  );
}
