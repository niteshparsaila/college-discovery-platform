# Prospectus — College Discovery Platform

Built for: AI Software Engineer Internship demo task — **Full Stack Engineer**, **Track A**.

## Features implemented (4 of 6, chosen deliberately)

1. **College Listing + Search** — filterable, sortable, paginated (server-side).
2. **College Detail Page** — overview, courses, placements, reviews.
3. **Compare Colleges** — side-by-side comparison of 2–4 colleges.
4. **Authentication + Saved Items** — credentials-based auth, save/unsave colleges.

Not built: Predictor Tool, Q&A/Discussion — cut deliberately to execute the other four
well rather than all six shallowly, per the brief's own instruction ("choose 3–4 and
execute them extremely well").

## Tech stack

- Next.js 14 (App Router) + React 18 + TypeScript
- TailwindCSS
- PostgreSQL + Prisma ORM
- NextAuth (Credentials provider, JWT sessions)
- Zod for input validation

## Architecture decisions & tradeoffs (for the Loom)

**Why the DB schema is normalized instead of JSON blobs on College**
Courses, Placements, and Reviews are separate tables (1:N) rather than JSON arrays
on `College`. This lets each be queried, filtered, and paginated independently (e.g.
review pagination on the detail page later without loading the whole college row),
and lets Postgres index the columns actually used in `WHERE` clauses.

**Why filtering/sorting/pagination all happen in the database**
`/api/colleges` builds a Prisma `where`/`orderBy`/`skip`/`take` query — nothing is
fetched into memory and filtered in JS. That's the only approach that still works
once the dataset doesn't fit in memory. `pageSize` is clamped server-side (max 50)
so a client can't request the entire table in one call.

**Why Credentials auth instead of OAuth**
No third-party app registration needed to demo signup → login → save end to end.
Swapping in Google/GitHub OAuth later is additive (one more provider in
`lib/auth.ts`); the JWT session strategy and the rest of the app don't change.

**Why comparisons aren't persisted as snapshots**
`SavedComparison` stores only a list of college IDs, not a frozen copy of their
fees/ratings at save time. Re-fetching live data on each view means a saved
comparison always reflects current data — the tradeoff is one extra query, which
is cheap at this scale.

**Why saved-college URLs are id OR slug**
`/colleges/[id]` looks up by `id` or `slug` in a single query (`OR`), so the
frontend can generate clean URLs (`/colleges/national-university-12`) without a
second slug→id lookup roundtrip.

**Known limitations / what I'd do next with more time**
- `topRecruiters` is a comma-separated string, not a join table — fine for display,
  not queryable ("colleges recruited by X"). Would normalize if that became a
  real filter.
- No optimistic UI on save/unsave — a slow network shows a brief lag. Would add
  optimistic state + rollback on error.
- No test suite. Would add integration tests for the `/api/colleges` filter
  combinations first, since that's the highest-complexity endpoint.
- No image/logo uploads — colleges get a colored initials badge instead, to avoid
  depending on stock photography for a synthetic dataset.

## Data

All 60 colleges, courses, placements, and reviews are **synthetically generated**
by `prisma/seed.ts` — not scraped. The brief permits mock/generated datasets as
long as the frontend never hardcodes data and everything is served through the
database and APIs, which this does end to end.

## Running locally

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL (see below) and NEXTAUTH_SECRET
npx prisma migrate dev --name init
npm run seed
npm run dev
```

Visit http://localhost:3000.

### Getting a free Postgres database (2 minutes)

1. Go to https://neon.tech, sign up, create a project.
2. Copy the connection string it gives you into `DATABASE_URL` in `.env`
   (keep `?sslmode=require` at the end).

### Generating NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

## Deploying (to get the Live URL the submission form asks for)

1. Push this folder to a new GitHub repo:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: college discovery platform"
   git branch -M main
   git remote add origin <your-empty-github-repo-url>
   git push -u origin main
   ```
2. Go to https://vercel.com → **Add New Project** → import that GitHub repo.
3. In Vercel's project settings → Environment Variables, add:
   - `DATABASE_URL` (your Neon connection string)
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` → set to your Vercel URL once Vercel assigns it
     (e.g. `https://your-app.vercel.app`)
4. Deploy. After the first deploy succeeds, run migrations + seed against the
   production database once, from your machine:
   ```bash
   DATABASE_URL="<your-neon-url>" npx prisma migrate deploy
   DATABASE_URL="<your-neon-url>" npm run seed
   ```

