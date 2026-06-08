import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";
import { SiteHeader } from "@/components/SiteHeader";
import { signUp } from "@/app/actions/auth";

export default function SignUpPage() {
  return (
    <div className="flex min-h-full flex-col bg-zinc-50">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-zinc-900">Create account</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Save bookmarks, keep some private, and share a public profile.
          </p>

          <div className="mt-6">
            <AuthForm action={signUp} submitLabel="Sign up" />
          </div>

          <p className="mt-6 text-center text-sm text-zinc-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-zinc-900 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
