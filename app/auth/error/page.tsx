import Link from "next/link";
import AuthShell from "@/components/AuthShell";

export default function AuthErrorPage() {
  return (
    <AuthShell title="Authentication failed" description="The sign-in link may be invalid, expired, or already used.">
      <div className="mt-7 grid gap-3">
        <Link href="/login" className="rounded-xl bg-violet-600 px-5 py-3 text-center text-sm font-medium hover:bg-violet-500">Try signing in again</Link>
        <Link href="/forgot-password" className="rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 text-center text-sm text-white/70 hover:bg-white/[0.08]">Reset password</Link>
      </div>
    </AuthShell>
  );
}
