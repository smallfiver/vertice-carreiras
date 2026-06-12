import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import Link from "next/link";
import { BarChart3, Briefcase, GraduationCap, Users, MessageCircle } from "lucide-react";

export default async function AdminLayout({
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

  if (!profile?.is_admin) redirect("/dashboard");

  const tabs = [
    { href: "/admin", label: "Visão Geral", icon: BarChart3 },
    { href: "/admin/jobs", label: "Vagas", icon: Briefcase },
    { href: "/admin/training", label: "Treinamento", icon: GraduationCap },
    { href: "/admin/users", label: "Usuários", icon: Users },
    { href: "/admin/whatsapp", label: "WhatsApp", icon: MessageCircle },
  ];

  return (
    <div className="flex">
      <Sidebar isAdmin />
      <div className="flex-1 flex flex-col">
        <Header name={profile?.full_name} email={profile?.email ?? user.email!} />
        <main className="p-4 md:p-6 max-w-6xl mx-auto w-full space-y-4">
          <nav className="flex flex-wrap gap-2 border-b border-border pb-2">
            {tabs.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-card-alt text-fg-muted hover:text-fg"
              >
                <t.icon className="h-4 w-4" /> {t.label}
              </Link>
            ))}
          </nav>
          {children}
        </main>
      </div>
    </div>
  );
}
