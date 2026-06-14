"use client";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle2, Rocket } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CompleteLessonButton({
  lessonId,
  nextLessonId,
  alreadyDone,
}: {
  lessonId: string;
  nextLessonId?: string;
  alreadyDone: boolean;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function complete() {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    await supabase.from("user_lesson_progress").upsert(
      {
        user_id: user.id,
        lesson_id: lessonId,
        completed: true,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,lesson_id" }
    );

    await supabase.from("user_events").insert({
      user_id: user.id,
      event_type: "complete_lesson",
      event_data: { lesson_id: lessonId },
    });

    // Marca o dia zero do treinamento na primeira conclusão — é a partir
    // dele que os dias D+1..D+6 são calculados pra liberação gradual.
    const { data: profile } = await supabase
      .from("profiles")
      .select("training_started_at")
      .eq("id", user.id)
      .single();
    if (!profile?.training_started_at) {
      await supabase
        .from("profiles")
        .update({ training_started_at: new Date().toISOString() })
        .eq("id", user.id);
    }

    if (nextLessonId) {
      router.push(`/training/${nextLessonId}`);
    } else {
      router.push("/training");
    }
    router.refresh();
  }

  if (alreadyDone) {
    return (
      <div className="inline-flex items-center gap-2 text-sm text-success">
        <CheckCircle2 className="h-5 w-5" /> Aula concluída
      </div>
    );
  }

  return (
    <Button variant="success" size="lg" onClick={complete} disabled={loading}>
      <Rocket className="h-5 w-5" />
      {loading
        ? "Salvando..."
        : nextLessonId
        ? "Concluir aula e avançar"
        : "Concluir treinamento"}
    </Button>
  );
}
