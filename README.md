# BookmarkHub

A small personal bookmarks app — linktree meets pocket. Save links privately, mark some as public, and share them on a simple profile page.

**Live URL:** _(add your Vercel URL after deploying)_

**GitHub:** https://github.com/EvazMacwan/eagerminds-bookmarks-app

## Features

- Email + password sign-up and login (Supabase Auth)
- Welcome email on sign-up (Resend) + confirmation email (Supabase)
- Dashboard to add, edit, and delete bookmarks (title, URL, public/private)
- Unique public handle per user (e.g. `/yourname`)
- Public profile page showing public bookmarks only — no login required
- Row Level Security in Supabase so users cannot access each other's private data

## Tech stack

- **Next.js 16** (App Router, TypeScript)
- **Supabase** — authentication + PostgreSQL database
- **Resend** — welcome emails
- **Vercel** — hosting
- **Tailwind CSS** — styling

## Run locally

### 1. Prerequisites

- Node.js 20+
- Accounts on [Supabase](https://supabase.com), [Resend](https://resend.com)

### 2. Clone and install

```bash
git clone https://github.com/EvazMacwan/eagerminds-bookmarks-app.git
cd eagerminds-bookmarks-app
npm install
```

### 3. Environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Full Supabase project URL, e.g. `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key |
| `RESEND_API_KEY` | Resend API key |
| `RESEND_FROM_EMAIL` | Verified sender, e.g. `noreply@bookmarkhub.com` |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` for local dev |

> **Important:** `NEXT_PUBLIC_SUPABASE_URL` must be the full `https://...supabase.co` URL — not just the project reference ID.

### 4. Database setup

In the Supabase dashboard → **SQL Editor**, run the migration:

```
supabase/migrations/20250608000000_initial_schema.sql
```

### 5. Supabase Auth settings

Under **Authentication → URL Configuration**:

- **Site URL:** `http://localhost:3000`
- **Redirect URLs:** `http://localhost:3000/**` and `http://localhost:3000/auth/callback`

Enable **Email** provider with **Confirm email** turned on.

### 6. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> This project uses webpack for local dev (`next dev --webpack`) to avoid Turbopack instability on Windows.

## Deploy to Vercel

1. Push your code to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Add the same environment variables from `.env.example` in **Project Settings → Environment Variables**.
4. Set `NEXT_PUBLIC_SITE_URL` to your Vercel URL (e.g. `https://bookmarkhub.vercel.app`).
5. Deploy.

### After deploying — update Supabase

In **Authentication → URL Configuration**, add your production URLs:

- **Site URL:** `https://your-app.vercel.app`
- **Redirect URLs:** `https://your-app.vercel.app/**` and `https://your-app.vercel.app/auth/callback`

## Where the AI agent got it wrong (and how I fixed it)

The agent initially told me to paste the Supabase **project reference ID** into `NEXT_PUBLIC_SUPABASE_URL`, which caused `Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL` on every page load. I caught this by reading the error in the terminal, comparing it to the Supabase API settings page, and replacing the ID with the full `https://....supabase.co` URL.

It also missed an **open redirect** in the login flow — `next=//evil.com` passed the `startsWith("/")` check and could send users off-site after a real login. I asked the agent to explain the risk, approved a fix using an allowlisted `safeRedirectPath()` helper, and verified `/login?next=//evil.com` now lands safely on `/dashboard`.

## One thing I'd improve with more time

Add **automated tests** for the security-critical paths — especially RLS policies (user A cannot read user B's private bookmarks) and the redirect allowlist — so regressions are caught in CI before deploy, not manually in the browser.

## Agent sessions

Coding sessions were recorded with [Entire CLI](https://github.com/entireio/cli) and stored on the `entire/checkpoints/v1` branch.
