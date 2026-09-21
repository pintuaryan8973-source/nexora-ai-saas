import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSafeNext } from "@/lib/auth/safe-next";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const code = searchParams.get("code");
  const next = getSafeNext(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();

    const { error } =
      await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const forwardedHost =
        request.headers.get("x-forwarded-host");

      const host =
        forwardedHost ??
        request.headers.get("host");

      const forwardedProto =
        request.headers.get("x-forwarded-proto");

      const protocol =
        forwardedProto ??
        (host?.includes("localhost") ||
        host?.startsWith("192.168.")
          ? "http"
          : "https");

      const origin =
        host && host !== "0.0.0.0:3000"
          ? `${protocol}://${host}`
          : process.env.NEXT_PUBLIC_SITE_URL ||
            "http://localhost:3000";

      return NextResponse.redirect(
        new URL(next, origin)
      );
    }
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  return NextResponse.redirect(
    new URL("/auth/error", siteUrl)
  );
}