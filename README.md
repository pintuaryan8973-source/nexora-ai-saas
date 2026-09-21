# Nexora AI

A production-style SaaS landing page built with Next.js 16, TypeScript, Tailwind CSS v4, and Lucide icons.

## Requirements

- Node.js 20.9 or newer
- npm 10+ (recommended)

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production check

```bash
npm run lint
npm run build
npm start
```

## Environment

Copy `.env.example` to `.env.local` and replace the example URL with your real deployment domain:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Included

- Responsive glass navigation with mobile menu
- Hero and interactive product preview
- Logo cloud
- Features grid
- How-it-works flow
- KPI strip
- Testimonials
- Monthly/annual pricing toggle
- Accessible FAQ using native `details`
- Final CTA and footer
- Metadata, dynamic Open Graph image, sitemap, robots, web manifest, and SVG app icon
- Reduced-motion support

## Important

This repository is a complete landing-page frontend. Authentication, billing, database persistence, and real AI execution are intentionally not faked; connect those services when you build the Nexora application itself.


## Authentication

A production-style Supabase authentication scaffold is included. See `AUTH_SETUP.md` for Google OAuth, email verification, password recovery, environment variables, and production setup.
