export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { CheckCircle2, Lock, PlayCircle, Clock } from "lucide-react";
import {
  getTrainingProgress,
  isTimeUnlocked,
  formatUnlockMessage,
} from "@/lib/progress";
import { redirect } from "next/navigation";

export default async function TrainingPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, is_admin, training_started_at")
    .eq("id", user.id)
    .single();

  const { data: modules } = await supabase
    .from("modules")
    .select("*, lessons(*)")
    .order("sequence_order");

  const { data: progressRows } = await supabase
    .from("user_lesson_progress")
    .select("lesson_id, completed")
    .eq("user_id", user.id);

  const completedIds = new Set(
    progressRows?.filter((r) => r.completed).map((r) => r.lesson_id) || []
  );

  const allLessons = (modules || []).flatMap((m: any) =>
    [...(m.lessons || [])].sort(
      (a: any, b: any) => a.sequence_order - b.sequence_order
    )
  );

  const overall = await getTrainingProgress(user.id);
  const startedAt = profile?.training_started_at ?? null;

  return (
    <div className="flex">
      <Sidebar isAdmin={profile?.is_admin} />
      <div className="flex-1 flex flex-col">
        <Header name={profile?.full_name} email={profile?.email ?? user.email!} />
        <main className="p-4 md:p-6 max-w-4xl mx-auto w-full space-y-6">
          <Card>
            <CardBody>
              <h1 className="text-2xl font-semibold">Programa de Preparação Vértice</h1>
              <p className="text-fg-muted text-sm mt-1">
                Conclua todas as aulas para desbloquear as candidaturas. O
                treinamento é liberado dia após dia — esse ritmo é proposital
                pra você absorver de verdade cada etapa.
              </p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-fg-muted">
                  {overall.completedLessons}/{overall.totalLessons} aulas concluídas
                </span>
                <span className="font-medium">{overall.percent}%</span>
              </div>
              <Progress value={overall.percent} className="mt-2" />
              {!startedAt && (
                <p className="text-xs text-fg-muted mt-3">
                  Sua jornada começa assim que você concluir a primeira aula.
                  A partir daí, novas aulas vão sendo liberadas a cada dia.
                </p>
              )}
            </CardBody>
          </Card>

          {modules?.map((m: any) => {
            const lessons = [...(m.lessons || [])].sort(
              (a: any, b: any) => a.sequence_order - b.sequence_order
            );
            return (
              <Card key={m.id}>
                <CardHeader>
                  <h2 className="font-semibold">
                    Módulo {m.sequence_order} — {m.title}
                  </h2>
                  {m.description && (
                    <p className="text-sm text-fg-muted">{m.description}</p>
                  )}
                </CardHeader>
                <CardBody className="space-y-2">
                  {lessons.map((l: any) => {
                    const idx = allLessons.findIndex((x: any) => x.id === l.id);
                    const prev = allLessons[idx - 1];
                    const sequentialOk = !prev || completedIds.has(prev.id);
                    const timeOk = isTimeUnlocked(
                      startedAt,
                      l.unlock_day_offset ?? 0
                    );
                    const unlocked = sequentialOk && timeOk;
                    const done = completedIds.has(l.id);
                    const timeMsg = formatUnlockMessage(
                      startedAt,
                      l.unlock_day_offset ?? 0
                    );
                    return (
                      <Link
                        key={l.id}
                        href={unlocked ? `/training/${l.id}` : "#"}
                        className={`flex items-center gap-3 rounded-lg border border-border px-3 py-3 text-sm ${
                          unlocked
                            ? "hover:bg-card-alt"
                            : "opacity-60 cursor-not-allowed"
                        }`}
                      >
                        {done ? (
                          <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                        ) : unlocked ? (
                          <PlayCircle className="h-5 w-5 text-brand-accent shrink-0" />
                        ) : !timeOk ? (
                          <Clock className="h-5 w-5 text-fg-muted shrink-0" />
                        ) : (
                          <Lock className="h-5 w-5 text-fg-muted shrink-0" />
                        )}
                        <span className="flex-1">
                          {l.sequence_order}. {l.title}
                        </span>
                        {done ? (
                          <span className="text-xs text-success">Concluída</span>
                        ) : !timeOk && timeMsg ? (
                          <span className="text-xs text-fg-muted">{timeMsg}</span>
                        ) : !sequentialOk ? (
                          <span className="text-xs text-fg-muted">
                            Conclua a anterior
                          </span>
                        ) : null}
                      </Link>
                    );
                  })}
                </CardBody>
              </Card>
            );
          })}
        </main>
      </div>
    </div>
  );
}
