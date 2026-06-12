export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronLeft,
  Activity,
  CheckCircle2,
  Briefcase,
  LogIn,
  PlayCircle,
  Eye,
  GraduationCap,
  LayoutDashboard,
  MessageCircle,
  Clock,
  ShieldCheck,
  Mail,
} from "lucide-react";

const EVENT_META: Record<
  string,
  { label: string; icon: any; tone: string }
> = {
  login: { label: "Fez login", icon: LogIn, tone: "text-brand" },
  view_dashboard: { label: "Abriu o painel", icon: LayoutDashboard, tone: "text-fg-muted" },
  view_training: { label: "Abriu o treinamento", icon: GraduationCap, tone: "text-fg-muted" },
  view_lesson: { label: "Visualizou aula", icon: PlayCircle, tone: "text-brand-accent" },
  complete_lesson: { label: "Concluiu aula", icon: CheckCircle2, tone: "text-success" },
  view_jobs: { label: "Abriu a lista de vagas", icon: Eye, tone: "text-fg-muted" },
  view_job: { label: "Visualizou vaga", icon: Briefcase, tone: "text-brand-accent" },
  apply_job: { label: "Aplicou para vaga", icon: ShieldCheck, tone: "text-success" },
  view_profile: { label: "Visualizou perfil", icon: Eye, tone: "text-fg-muted" },
  support_message: { label: "Mensagem ao suporte", icon: MessageCircle, tone: "text-brand" },
};

function describeEvent(eventType: string, data: Record<string, any> | null) {
  const meta = EVENT_META[eventType];
  const label = meta?.label ?? eventType;
  if (!data) return label;
  if (eventType === "view_lesson" || eventType === "complete_lesson") {
    return data.lesson_title
      ? `${label}: ${data.lesson_title}`
      : label;
  }
  if (eventType === "view_job" || eventType === "apply_job") {
    const parts = [data.title, data.company].filter(Boolean).join(" — ");
    return parts ? `${label}: ${parts}` : label;
  }
  if (eventType === "login" && data.method) {
    return `${label} (${data.method})`;
  }
  return label;
}

function relativeTime(iso: string) {
  const d = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - d);
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "agora";
  const min = Math.floor(sec / 60);
  if (min < 60) return `há ${min}m`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `há ${hr}h`;
  const days = Math.floor(hr / 24);
  if (days < 30) return `há ${days}d`;
  const months = Math.floor(days / 30);
  if (months < 12) return `há ${months}mês`;
  return `há ${Math.floor(months / 12)}a`;
}

export default async function AdminUserDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const [
    { data: profile },
    { data: events },
    { count: totalLessons },
    { data: progressRows },
    { data: applications },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", params.id).single(),
    supabase
      .from("user_events")
      .select("id, event_type, event_data, created_at")
      .eq("user_id", params.id)
      .order("created_at", { ascending: false })
      .limit(200),
    supabase.from("lessons").select("id", { count: "exact", head: true }),
    supabase
      .from("user_lesson_progress")
      .select("lesson_id, completed, completed_at")
      .eq("user_id", params.id)
      .eq("completed", true),
    supabase
      .from("applications")
      .select("id, job_id, created_at, jobs(title, company_name)")
      .eq("user_id", params.id)
      .order("created_at", { ascending: false }),
  ]);

  if (!profile) notFound();

  const completed = progressRows?.length ?? 0;
  const total = totalLessons ?? 0;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const lastEvent = events?.[0];
  const loginCount = (events || []).filter((e) => e.event_type === "login").length;

  return (
    <div className="space-y-4">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-1 text-sm text-fg-muted hover:text-fg"
      >
        <ChevronLeft className="h-4 w-4" /> Voltar para usuários
      </Link>

      <Card>
        <CardBody>
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-full gold-gradient grid place-items-center shrink-0">
              <span className="text-bg-deep font-serif text-xl font-bold">
                {(profile.full_name || profile.email || "?")
                  .charAt(0)
                  .toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-semibold">
                  {profile.full_name || "Sem nome"}
                </h1>
                {profile.is_admin && (
                  <span className="rounded-full bg-brand/20 text-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-fg-muted text-sm flex items-center gap-1 mt-1">
                <Mail className="h-3.5 w-3.5" /> {profile.email}
              </p>
              <div className="mt-2 text-xs text-fg-muted space-x-4">
                <span>
                  Cadastro:{" "}
                  {profile.created_at
                    ? new Date(profile.created_at).toLocaleDateString("pt-BR")
                    : "—"}
                </span>
                {profile.training_started_at && (
                  <span>
                    Iniciou treinamento:{" "}
                    {new Date(profile.training_started_at).toLocaleDateString(
                      "pt-BR"
                    )}
                  </span>
                )}
                {profile.perfectpay_sale_code && (
                  <span>
                    PerfectPay:{" "}
                    <span className="font-mono">{profile.perfectpay_sale_code}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardBody>
            <div className="flex items-center gap-2 text-fg-muted text-xs uppercase tracking-wider">
              <Activity className="h-3.5 w-3.5" /> Eventos
            </div>
            <p className="text-2xl font-semibold mt-1">{events?.length ?? 0}</p>
            <p className="text-[11px] text-fg-muted">últimos 200 registros</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center gap-2 text-fg-muted text-xs uppercase tracking-wider">
              <Clock className="h-3.5 w-3.5" /> Última atividade
            </div>
            <p className="text-2xl font-semibold mt-1">
              {lastEvent ? relativeTime(lastEvent.created_at) : "—"}
            </p>
            <p className="text-[11px] text-fg-muted">
              {lastEvent
                ? new Date(lastEvent.created_at).toLocaleString("pt-BR")
                : "sem registros"}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center gap-2 text-fg-muted text-xs uppercase tracking-wider">
              <CheckCircle2 className="h-3.5 w-3.5" /> Aulas concluídas
            </div>
            <p className="text-2xl font-semibold mt-1">
              {completed}
              <span className="text-sm text-fg-muted font-normal">
                /{total}
              </span>
            </p>
            <Progress value={pct} className="mt-2" />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center gap-2 text-fg-muted text-xs uppercase tracking-wider">
              <Briefcase className="h-3.5 w-3.5" /> Candidaturas
            </div>
            <p className="text-2xl font-semibold mt-1">
              {applications?.length ?? 0}
            </p>
            <p className="text-[11px] text-fg-muted">
              {loginCount} {loginCount === 1 ? "login" : "logins"} registrados
            </p>
          </CardBody>
        </Card>
      </div>

      {applications && applications.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="font-semibold flex items-center gap-2">
              <Briefcase className="h-4 w-4" /> Candidaturas
            </h2>
          </CardHeader>
          <CardBody className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-fg-muted text-xs uppercase">
                <tr>
                  <th className="py-2 pr-3">Data</th>
                  <th className="py-2 pr-3">Vaga</th>
                  <th className="py-2 pr-3">Empresa</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((a: any) => (
                  <tr key={a.id} className="border-t border-border">
                    <td className="py-2 pr-3 text-fg-muted text-xs">
                      {new Date(a.created_at).toLocaleString("pt-BR")}
                    </td>
                    <td className="py-2 pr-3">{a.jobs?.title ?? "—"}</td>
                    <td className="py-2 pr-3">{a.jobs?.company_name ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader>
          <h2 className="font-semibold flex items-center gap-2">
            <Activity className="h-4 w-4" /> Linha do tempo
          </h2>
          <p className="text-xs text-fg-muted mt-1">
            Tudo que esta pessoa fez na plataforma, em ordem cronológica.
          </p>
        </CardHeader>
        <CardBody>
          {!events || events.length === 0 ? (
            <p className="text-sm text-fg-muted text-center py-6">
              Nenhuma atividade registrada ainda.
            </p>
          ) : (
            <ol className="relative border-l border-border ml-3">
              {events.map((ev: any) => {
                const meta = EVENT_META[ev.event_type] || {
                  label: ev.event_type,
                  icon: Activity,
                  tone: "text-fg-muted",
                };
                const Icon = meta.icon;
                return (
                  <li key={ev.id} className="ml-6 py-3">
                    <span
                      className={`absolute -left-3 grid place-items-center h-6 w-6 rounded-full bg-card border border-border ${meta.tone}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <p className="text-sm">
                        {describeEvent(ev.event_type, ev.event_data)}
                      </p>
                      <span className="text-[11px] text-fg-muted">
                        {new Date(ev.created_at).toLocaleString("pt-BR")} ·{" "}
                        {relativeTime(ev.created_at)}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
