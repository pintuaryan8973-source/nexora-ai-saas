import AuthShell from "@/components/AuthShell";
import LoginForm from "@/components/LoginForm";
import { getSafeNext } from "@/lib/auth/safe-next";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const next = getSafeNext(params.next);

  return (
    <AuthShell title="Welcome back" description="Sign in to continue to your Nexora workspace.">
      <LoginForm next={next} />
    </AuthShell>
  );
}
