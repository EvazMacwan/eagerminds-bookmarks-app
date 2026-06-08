import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";
import { SiteHeader } from "@/components/SiteHeader";
import { signIn } from "@/app/actions/auth";

type LoginPageProps = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = params.next ?? "/dashboard";

  return (
    <div className="flex min-h-full flex-col bg-zinc-50">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-zinc-900">Log in</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Welcome back. Sign in to manage your bookmarks.
          </p>

          {params.error === "auth_callback_failed" ? (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              Email confirmation failed. Try signing in or sign up again.
            </p>
          ) : null}

          <div className="mt-6">
            <AuthForm action={signIn} submitLabel="Sign in" next={next} />
          </div>

          <p className="mt-6 text-center text-sm text-zinc-600">
            No account yet?{" "}
            <Link href="/signup" className="font-medium text-zinc-900 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
