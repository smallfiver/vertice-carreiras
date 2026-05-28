"use client";
import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { JobCard } from "./job-card";
import type { Job } from "@/types";

export function JobFeed({ jobs }: { jobs: Job[] }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.toLowerCase().trim();
    if (!s) return jobs;
    return jobs.filter(
      (j) =>
        j.title.toLowerCase().includes(s) ||
        j.company_name.toLowerCase().includes(s) ||
        j.salary_range.toLowerCase().includes(s)
    );
  }, [q, jobs]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-fg-muted" />
        <Input
          placeholder="Buscar por título, empresa ou salário..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="pl-9"
        />
      </div>
      {filtered.length === 0 ? (
        <p className="text-fg-muted text-sm text-center py-12">
          Nenhuma vaga encontrada.
        </p>
      ) : (
        filtered.map((j) => <JobCard key={j.id} job={j} />)
      )}
    </div>
  );
}
