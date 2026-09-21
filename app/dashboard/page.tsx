import { redirect } from "next/navigation";
import DashboardShell from "@/components/DashboardShell";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    redirect("/login");
  }

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) redirect("/login");

  const metadata = user.user_metadata ?? {};
  const name = metadata.full_name || metadata.name || user.email?.split("@")[0] || "there";

  return <DashboardShell name={String(name)} email={user.email ?? "Authenticated user"} />;
}
