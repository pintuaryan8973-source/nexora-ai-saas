"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import { createClient } from "@/lib/supabase/client";

export type DashboardUser = {
  name: string;
  email: string;
};

export default function DashboardShell({
  user,
  children,
}: {
  user: DashboardUser;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#06060b] text-white">
      <Sidebar
        user={user}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onSignOut={signOut}
        signingOut={signingOut}
      />

      <div className="min-h-screen lg:pl-[270px]">
        <Topbar user={user} onMenu={() => setMobileOpen(true)} />
        <main className="px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pt-8">
          <div className="mx-auto max-w-[1500px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
