import { createClient } from "@/lib/supabase/server";

export async function getTrainingProgress(userId: string) {
  const supabase = createClient();
  const { count: total } = await supabase
    .from("lessons")
    .select("id", { count: "exact", head: true });
  const { count: done } = await supabase
    .from("user_lesson_progress")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("completed", true);

  const { data: profile } = await supabase
    .from("profiles")
    .select("training_started_at")
    .eq("id", userId)
    .single();

  const totalLessons = total ?? 0;
  const completedLessons = done ?? 0;
  const percent =
    totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);
  const isComplete = totalLessons > 0 && completedLessons >= totalLessons;
  return {
    totalLessons,
    completedLessons,
    percent,
    isComplete,
    trainingStartedAt: profile?.training_started_at ?? null,
  };
}

// Calcula quando uma aula com determinado unlock_day_offset fica liberada
// para o usuário (baseado em quando ele começou o treinamento).
export function unlockDateFor(
  trainingStartedAt: string | null,
  unlockDayOffset: number
) {
  const start = trainingStartedAt ? new Date(trainingStartedAt) : new Date();
  const unlock = new Date(start);
  unlock.setDate(unlock.getDate() + (unlockDayOffset || 0));
  return unlock;
}

export function isTimeUnlocked(
  trainingStartedAt: string | null,
  unlockDayOffset: number
) {
  if (!unlockDayOffset || unlockDayOffset <= 0) return true;
  if (!trainingStartedAt) return false;
  return unlockDateFor(trainingStartedAt, unlockDayOffset).getTime() <= Date.now();
}

export function formatUnlockMessage(
  trainingStartedAt: string | null,
  unlockDayOffset: number
) {
  if (isTimeUnlocked(trainingStartedAt, unlockDayOffset)) return null;
  if (!trainingStartedAt) {
    return `Libera em D+${unlockDayOffset} após sua primeira aula`;
  }
  const date = unlockDateFor(trainingStartedAt, unlockDayOffset);
  const fmt = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
  return `Libera em ${fmt}`;
}
