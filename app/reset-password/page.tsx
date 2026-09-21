import { redirect } from "next/navigation";
import AuthShell from "@/components/AuthShell";
import ResetPasswordForm from "@/components/ResetPasswordForm";
import { createClient } from "@/lib/supabase/server";

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    redirect("/forgot-password");
  }

  return (
    <AuthShell title="Choose a new password" description="Create a strong password you do not use on another service.">
      <ResetPasswordForm />
    </AuthShell>
  );
}
