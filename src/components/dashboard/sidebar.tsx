"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, GraduationCap, Briefcase, User, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Feed", icon: Home },
  { href: "/training", label: "Treinamento", icon: GraduationCap },
];

export function Sidebar({ isAdmin }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex md:w-60 flex-col gap-1 p-3 border-r border-border bg-card/40 min-h-screen sticky top-0">
      <Link href="/dashboard" className="flex items-center gap-2 p-3 mb-2">
        <div className="h-9 w-9 rounded-md gold-gradient grid place-items-center">
          <span className="font-serif text-bg-deep font-bold">V</span>
        </div>
        <div className="leading-tight">
          <div className="font-serif font-bold tracking-wide text-sm">VÉRTICE</div>
          <div className="text-[8px] uppercase tracking-[0.25em] text-brand">Carreiras</div>
        </div>
      </Link>
      {items.map((it) => {
        const active = pathname?.startsWith(it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm",
              active ? "bg-card-alt text-fg" : "text-fg-muted hover:bg-card-alt"
            )}
          >
            <it.icon className="h-4 w-4" />
            {it.label}
          </Link>
        );
      })}
      {isAdmin && (
        <Link
          href="/admin"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm mt-4",
            pathname?.startsWith("/admin")
              ? "bg-card-alt text-fg"
              : "text-fg-muted hover:bg-card-alt"
          )}
        >
          <ShieldCheck className="h-4 w-4 text-warning" />
          Admin
        </Link>
      )}
    </aside>
  );
}
