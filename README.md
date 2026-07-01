# Museum of the Unsaid Thoughts 🖼️

A public, anonymous space to leave the thoughts you never said out loud — pinned up like polaroids on a gallery wall, or shouted into the void on the rant wall.

## What is this?

Museum of the Unsaid Thoughts is an anonymous confession board. Anyone can post a thought paired with an image, styled as a polaroid and pinned at a random spot and angle on a shared canvas — or write a longer, unfiltered rant that gets its own page. No accounts, no names, just the thought.

## Features

- 🖼️ **Polaroid wall** — anonymous thoughts posted as polaroid cards with customizable text color, size, alignment, and image, scattered across the canvas with a natural random tilt
- 🔄 **3D flip modal** — tap a polaroid to flip it and read more
- 📱 **Mobile horizontal scroll strip** — a clipped, pinned strip layout for smaller screens
- 😤 **Rant wall** — longer-form anonymous rants with selectable fonts and color palettes (e.g. Gloria / parchment)
- 🔐 **Hidden admin panel** — lets the site owner moderate and remove posts via a secret key
- 📦 **Client-side image compression** — images are resized and compressed via the Canvas API in-browser before upload, keeping uploads small and fast

## Tech Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) — build tool & dev server
- [Tailwind CSS v4](https://tailwindcss.com/) — styling
- [Framer Motion](https://www.framer.com/motion/) — animations (card flip, transitions)
- [React Router](https://reactrouter.com/) — routing
- [Neon](https://neon.tech/) — serverless Postgres for data persistence
- [Supabase Storage](https://supabase.com/storage) — image hosting
- [Vercel](https://vercel.com/) — hosting & serverless API functions

### Why this stack?

Neon and Supabase Storage were chosen specifically to avoid the "cold start" / free-tier pausing issues common with other free database tiers, while Vercel serverless functions keep the API layer simple and deploy-friendly.

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm
- A [Neon](https://console.neon.tech/) account (Postgres database)
- A [Supabase](https://supabase.com/) account (image storage)

### Installation

```bash
# Clone the repository
git clone https://github.com/joshdev09/museum-of-the-unsaid-thoughts.git
cd museum-of-the-unsaid-thoughts

# Install dependencies
npm install
```

### Database Setup

1. Create a Neon project and copy its connection string.
2. Run `schema.sql` once in the Neon SQL editor to create the `thoughts` and `rants` tables.
3. Create a Supabase project and a storage bucket named `polaroid-images` (public read access).

### Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

```
# Neon — console.neon.tech → your project → Connection string
DATABASE_URL=postgresql://user:password@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require

# Supabase — supabase.com → project → Settings → API
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Admin — make this something only you know
ADMIN_KEY=your-secret-key-here
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5173` to view the app locally.

> Note: the `/api` serverless functions are Vercel functions — use `vercel dev` instead of `npm run dev` if you need to test the API routes locally.

### Build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Project Structure

```
api/                  # Vercel serverless functions
├── thoughts.ts        # GET/POST/DELETE polaroid thoughts
└── rants.ts            # GET/POST/DELETE rants

src/
├── admin/              # Hidden admin moderation panel
│   └── AdminScreen.tsx
├── assets/             # Images and static assets
├── components/
│   ├── MainScreen.tsx    # Polaroid wall / main view
│   ├── PolaroidCard.tsx  # Individual polaroid with 3D flip
│   ├── Rant.tsx
│   ├── RantPage.tsx      # Single rant view
│   ├── RantWall.tsx
│   ├── WriteRant.tsx     # Rant submission form
│   └── WriteThought.tsx  # Polaroid submission form
├── context/             # React context providers (Thoughts, Rants)
├── storage/
│   ├── db.ts             # Neon connection
│   └── storage.ts        # Supabase upload + client-side compression
├── types/               # TypeScript type definitions
├── App.tsx              # Routes
└── main.tsx             # App entry point

schema.sql              # Postgres schema (run once in Neon)
```

## Routes

| Path          | Page                          |
|---------------|--------------------------------|
| `/`           | Polaroid wall (main screen)     |
| `/write`      | Submit a new thought/polaroid   |
| `/rant/write` | Submit a new rant               |
| `/rant/:id`   | View a single rant              |
| `/admin`      | Hidden admin moderation panel   |

## API

| Endpoint         | Methods                | Notes                              |
|-------------------|-------------------------|-------------------------------------|
| `/api/thoughts`   | `GET`, `POST`, `DELETE` | `DELETE` requires `x-admin-key` header |
| `/api/rants`      | `GET`, `POST`, `DELETE` | `DELETE` requires `x-admin-key` header |
