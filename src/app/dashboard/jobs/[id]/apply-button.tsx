"use client";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { ExternalLink } from "lucide-react";
import { useState } from "react";

export function ApplyButton({
  jobId,
  applicationUrl,
}: {
  jobId: string;
  applicationUrl: string;
}) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  async function apply() {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("applications")
        .upsert({ user_id: user.id, job_id: jobId }, { onConflict: "user_id,job_id" });
      await supabase.from("user_events").insert({
        user_id: user.id,
        event_type: "apply_job",
        event_data: { job_id: jobId },
      });
    }
    window.open(applicationUrl, "_blank");
    setLoading(false);
  }

  return (
    <div className="flex justify-center">
      <Button variant="success" size="lg" onClick={apply} disabled={loading}>
        <ExternalLink className="h-5 w-5" />
        {loading ? "Registrando..." : "Aplicar para esta vaga"}
      </Button>
    </div>
  );
}
