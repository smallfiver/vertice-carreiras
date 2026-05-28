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

  const totalLessons = total ?? 0;
  const completedLessons = done ?? 0;
  const percent =
    totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);
  const isComplete = totalLessons > 0 && completedLessons >= totalLessons;
  return { totalLessons, completedLessons, percent, isComplete };
}
