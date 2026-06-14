export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { VideoPlayer } from "@/components/shared/video-player";
import { CompleteLessonButton } from "./complete-button";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { isTimeUnlocked } from "@/lib/progress";
import { trackEvent } from "@/lib/track";
import { SofiaWidget } from "@/components/support/sofia-widget";

export default async function LessonPlayerPage({
  params,
}: {
  params: { lessonId: string };
}) {
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

  const { data: lesson } = await supabase
    .from("lessons")
    .select("*, modules(id, title, sequence_order)")
    .eq("id", params.lessonId)
    .single();

  if (!lesson) notFound();

  const { data: modules } = await supabase
    .from("modules")
    .select("*, lessons(id, sequence_order, title)")
    .order("sequence_order");

  const allLessons = (modules || []).flatMap((m: any) =>
    [...(m.lessons || [])].sort(
      (a: any, b: any) => a.sequence_order - b.sequence_order
    )
  );

  const idx = allLessons.findIndex((x: any) => x.id === lesson.id);
  const prev = allLessons[idx - 1];
  const next = allLessons[idx + 1];

  const { data: progressRows } = await supabase
    .from("user_lesson_progress")
    .select("lesson_id, completed")
    .eq("user_id", user.id);

  const completedIds = new Set(
    progressRows?.filter((r) => r.completed).map((r) => r.lesson_id) || []
  );

  if (prev && !completedIds.has(prev.id)) {
    redirect("/training");
  }

  if (
    !isTimeUnlocked(
      profile?.training_started_at ?? null,
      lesson.unlock_day_offset ?? 0
    )
  ) {
    redirect("/training");
  }

  const done = completedIds.has(lesson.id);

  await trackEvent(user.id, "view_lesson", {
    lesson_id: lesson.id,
    lesson_title: lesson.title,
    module_id: lesson.modules?.id,
    module_title: lesson.modules?.title,
  });

  return (
    <div className="flex">
      <Sidebar isAdmin={profile?.is_admin} />
      <div className="flex-1 flex flex-col">
        <Header name={profile?.full_name} email={profile?.email ?? user.email!} />
        <main className="p-4 md:p-6 max-w-4xl mx-auto w-full space-y-4">
          <Link
            href="/training"
            className="inline-flex items-center gap-1 text-sm text-fg-muted hover:text-fg"
          >
            <ChevronLeft className="h-4 w-4" /> Voltar ao treinamento
          </Link>

          <Card>
            <CardHeader>
              <p className="text-xs text-fg-muted">
                Módulo {lesson.modules?.sequence_order} — {lesson.modules?.title}
              </p>
              <h1 className="text-2xl font-semibold">
                {lesson.sequence_order}. {lesson.title}
              </h1>
            </CardHeader>
            <CardBody className="space-y-4">
              <VideoPlayer url={lesson.video_url} title={lesson.title} />
              {lesson.content && (
                <div className="text-sm text-fg-muted whitespace-pre-wrap">
                  {lesson.content}
                </div>
              )}
            </CardBody>
          </Card>

          <div className="flex items-center justify-between gap-4">
            {prev ? (
              <Link
                href={`/training/${prev.id}`}
                className="inline-flex items-center gap-1 text-sm text-fg-muted hover:text-fg"
              >
                <ChevronLeft className="h-4 w-4" /> Aula anterior
              </Link>
            ) : (
              <span />
            )}

            <CompleteLessonButton
              lessonId={lesson.id}
              nextLessonId={next?.id}
              alreadyDone={done}
            />
          </div>

          {done && next && (
            <div className="text-right">
              <Link
                href={`/training/${next.id}`}
                className="inline-flex items-center gap-1 text-sm text-brand-accent hover:underline"
              >
                Próxima aula <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </main>
      </div>
      <SofiaWidget />
    </div>
  );
}
