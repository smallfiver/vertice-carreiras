import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { TermsPopup } from "@/components/dashboard/terms-popup";
import { SofiaWidget } from "@/components/support/sofia-widget";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, is_admin")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex">
      <Sidebar isAdmin={profile?.is_admin} />
      <div className="flex-1 flex flex-col">
        <Header name={profile?.full_name} email={profile?.email ?? user.email!} />
        <main className="p-4 md:p-6">{children}</main>
      </div>
      <TermsPopup />
      <SofiaWidget />
    </div>
  );
}
