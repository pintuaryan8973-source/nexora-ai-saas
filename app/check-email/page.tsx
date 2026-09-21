import Link from "next/link";
import { MailCheck } from "lucide-react";
import AuthShell from "@/components/AuthShell";

export default function CheckEmailPage() {
  return (
    <AuthShell title="Check your email" description="Your account is almost ready.">
      <div className="mt-7 text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
          <MailCheck className="size-7" />
        </div>
        <p className="mt-5 text-sm leading-6 text-white/55">
          We sent you a confirmation link. Open it to verify your email, then Nexora will sign you in securely.
        </p>
        <Link href="/login" className="mt-6 inline-flex rounded-xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-medium hover:bg-white/[0.1]">
          Back to sign in
        </Link>
      </div>
    </AuthShell>
  );
}
