# Nexora AI Authentication Setup

This project is wired for Supabase Auth with Next.js 16.

Included:
- Google OAuth
- Email/password sign up
- Email/password sign in
- Email verification
- Forgot password
- Password reset
- Cookie-based SSR sessions
- Next.js 16 `proxy.ts` session refresh
- Protected `/dashboard`
- Secure sign out

## 1. Install auth packages

```bash
npm install
```

The project uses:
- `@supabase/ssr` 0.12.x
- `@supabase/supabase-js` 2.116.x

## 2. Create `.env.local`

Copy `.env.example` to `.env.local` and set:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

Never put a Supabase secret/service-role key in a `NEXT_PUBLIC_` variable.

## 3. Supabase URL configuration

In Supabase Authentication URL Configuration:

Site URL for local development:

```text
http://localhost:3000
```

Add redirect URLs:

```text
http://localhost:3000/auth/callback
http://localhost:3000/**
```

For production, add your HTTPS production domain too.

## 4. Enable Google

Create a Web OAuth client in Google Auth Platform / Google Cloud.

Authorized JavaScript origin:

```text
http://localhost:3000
```

The Google OAuth redirect URI is the callback URL shown by Supabase in Authentication > Providers > Google. It normally looks like:

```text
https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
```

Put the Google Client ID and Client Secret into the Supabase Google provider settings and enable the provider.

## 5. Email confirmation template for SSR

In Supabase Authentication > Email Templates > Confirm signup, use a server-side token-hash link like:

```html
<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/dashboard">Confirm your email</a>
```

This lets `/auth/confirm` verify the token and create the cookie session safely.

## 6. Password recovery

The app sends recovery emails with:

```text
/auth/callback?next=/reset-password
```

Make sure your local and production app URLs are included in Supabase redirect URL allow-list.

## 7. Run

```bash
npm run dev -- -H 0.0.0.0
```

Then test:
- `/signup`
- `/login`
- Google sign-in
- email confirmation
- forgot password
- `/dashboard`
- sign out

## Production notes

- Configure custom SMTP before real production traffic; Supabase's default email sender is intended for testing and has tight limits.
- Keep Row Level Security enabled on any user-owned application tables.
- Do not authorize server requests from unverified cookie data; the project uses `getClaims()` for protected routes.
- Add CAPTCHA/rate-limiting if public sign-up abuse becomes a concern.
