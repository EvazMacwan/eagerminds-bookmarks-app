import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default function ProfileNotFound() {
  return (
    <div className="flex min-h-full flex-col bg-zinc-50">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <h1 className="text-2xl font-semibold text-zinc-900">Profile not found</h1>
        <p className="mt-2 text-zinc-600">
          This handle does not exist or has not been claimed yet.
        </p>
        <Link
          href="/"
          className="mt-6 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-700"
        >
          Go home
        </Link>
      </main>
    </div>
  );
}
