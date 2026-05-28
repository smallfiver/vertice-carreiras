"use client";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { initials } from "@/lib/utils";

export function Header({ name, email }: { name?: string | null; email: string }) {
  const router = useRouter();
  const supabase = createClient();

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-bg/80 backdrop-blur px-4 md:px-6">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-brand grid place-items-center font-semibold text-sm">
          {initials(name || email)}
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-medium">{name || "Profissional Vértice"}</p>
          <p className="text-xs text-fg-muted">{email}</p>
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={logout}>
        <LogOut className="h-4 w-4" /> Sair
      </Button>
    </header>
  );
}
