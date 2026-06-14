"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, GraduationCap, Briefcase, User, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/logo";

const items = [
  { href: "/dashboard", label: "Feed", icon: Home },
  { href: "/training", label: "Treinamento", icon: GraduationCap },
];

export function Sidebar({ isAdmin }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex md:w-60 flex-col gap-1 p-3 border-r border-border bg-card/40 min-h-screen sticky top-0">
      <Link href="/dashboard" className="p-3 mb-2 block">
        <Logo size="sm" />
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
