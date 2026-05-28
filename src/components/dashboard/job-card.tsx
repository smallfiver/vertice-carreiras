import Link from "next/link";
import { Building2, Home, Sparkles } from "lucide-react";
import type { Job } from "@/types";
import { Button } from "@/components/ui/button";

export function JobCard({ job }: { job: Job }) {
  return (
    <article className="rounded-xl border border-border bg-card p-5 hover:border-border-alt transition-colors">
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 rounded-lg bg-card-alt grid place-items-center overflow-hidden">
          {job.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={job.logo_url} alt={job.company_name} className="h-full w-full object-cover" />
          ) : (
            <Building2 className="h-6 w-6 text-fg-muted" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg leading-tight">{job.title}</h3>
          <p className="text-sm text-fg-muted">{job.company_name}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-card-alt px-2 py-1 text-fg-muted">
              <Home className="h-3 w-3" /> Home Office
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-brand/20 text-brand-accent px-2 py-1">
              <Sparkles className="h-3 w-3" /> Sem Experiência
            </span>
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm text-fg-muted line-clamp-2">{job.description}</p>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-success font-semibold">{job.salary_range}</span>
        <Link href={`/dashboard/jobs/${job.id}`}>
          <Button size="sm">Ver detalhes</Button>
        </Link>
      </div>
    </article>
  );
}
