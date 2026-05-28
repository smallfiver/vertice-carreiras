import { createClient } from "@/lib/supabase/server";
import { TrainingAdminClient } from "./training-client";

export default async function AdminTrainingPage() {
  const supabase = createClient();
  const { data: modules } = await supabase
    .from("modules")
    .select("*, lessons(*)")
    .order("sequence_order");

  return <TrainingAdminClient initialModules={modules ?? []} />;
}
