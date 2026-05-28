import { createClient } from "@/lib/supabase/server";
import { JobsAdminClient } from "./jobs-client";

export default async function AdminJobsPage() {
  const supabase = createClient();
  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  return <JobsAdminClient initialJobs={jobs ?? []} />;
}
