import { redirect } from "next/navigation";
import DashboardShell from "@/components/DashboardShell";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/login");
  }

  const user = data.user;
  const metadata = user.user_metadata ?? {};
  const name = metadata.full_name || metadata.name || user.email?.split("@")[0] || "User";

  return (
    <DashboardShell
      user={{
        name: String(name),
        email: user.email ?? "Authenticated user",
      }}
    >
      {children}
    </DashboardShell>
  );
}
