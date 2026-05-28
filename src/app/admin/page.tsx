import { createClient } from "@/lib/supabase/server";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Users, Briefcase, GraduationCap, FileCheck2 } from "lucide-react";

export default async function AdminOverviewPage() {
  const supabase = createClient();

  const [{ count: usersCount }, { count: jobsCount }, { count: appsCount }, { count: lessonsCount }, { data: progressRows }] =
    await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("jobs").select("id", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("applications").select("id", { count: "exact", head: true }),
      supabase.from("lessons").select("id", { count: "exact", head: true }),
      supabase.from("user_lesson_progress").select("user_id, lesson_id, completed").eq("completed", true),
    ]);

  const totalLessons = lessonsCount ?? 0;
  const perUser = new Map<string, number>();
  (progressRows || []).forEach((r) => {
    perUser.set(r.user_id, (perUser.get(r.user_id) || 0) + 1);
  });
  let completedTraining = 0;
  perUser.forEach((c) => {
    if (totalLessons > 0 && c >= totalLessons) completedTraining++;
  });

  const stats = [
    { label: "Usuários cadastrados", value: usersCount ?? 0, icon: Users, color: "text-brand-accent" },
    { label: "Vagas ativas", value: jobsCount ?? 0, icon: Briefcase, color: "text-success" },
    { label: "Concluíram treinamento", value: completedTraining, icon: GraduationCap, color: "text-warning" },
    { label: "Candidaturas registradas", value: appsCount ?? 0, icon: FileCheck2, color: "text-brand-accent" },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Visão Geral</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardBody>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-card-alt grid place-items-center">
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-xs text-fg-muted">{s.label}</p>
                  <p className="text-2xl font-semibold">{s.value}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <h2 className="font-semibold">Bem-vindo ao painel administrativo</h2>
        </CardHeader>
        <CardBody className="text-sm text-fg-muted">
          Use as abas acima para gerenciar vagas, módulos de treinamento e usuários da plataforma.
        </CardBody>
      </Card>
    </div>
  );
}
