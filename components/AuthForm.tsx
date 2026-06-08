"use client";

import { useActionState } from "react";
import type { AuthActionState } from "@/app/actions/auth";

type AuthFormProps = {
  action: (
    prevState: AuthActionState,
    formData: FormData,
  ) => Promise<AuthActionState>;
  submitLabel: string;
  next?: string;
};

const initialState: AuthActionState = {};

export function AuthForm({ action, submitLabel, next }: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-4">
      {next ? <input type="hidden" name="next" value={next} /> : null}

      <label className="flex flex-col gap-1.5 text-sm font-medium text-zinc-700">
        Email
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className="rounded-lg border border-zinc-300 px-3 py-2 text-base font-normal text-zinc-900 outline-none ring-blue-500 focus:ring-2"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium text-zinc-700">
        Password
        <input
          type="password"
          name="password"
          required
          minLength={8}
          autoComplete={submitLabel === "Sign in" ? "current-password" : "new-password"}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-base font-normal text-zinc-900 outline-none ring-blue-500 focus:ring-2"
        />
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

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Please wait..." : submitLabel}
      </button>
    </form>
  );
}
