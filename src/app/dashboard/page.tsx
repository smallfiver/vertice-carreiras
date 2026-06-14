import { createClient } from "@/lib/supabase/server";
import { getTrainingProgress } from "@/lib/progress";
import { JobFeed } from "@/components/dashboard/job-feed";
import { Testimonials } from "@/components/dashboard/testimonials";
import { TestimonialsBanner } from "@/components/dashboard/testimonials-banner";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, FileText, Lightbulb } from "lucide-react";
import { trackEvent } from "@/lib/track";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await trackEvent(user.id, "view_dashboard");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user!.id)
    .single();

  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const progress = await getTrainingProgress(user!.id);

  return (
    <>
    <TestimonialsBanner />
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_300px] gap-4 max-w-7xl mx-auto">
      <aside className="space-y-4">
        <Card>
          <CardBody className="text-center">
            <div className="h-16 w-16 mx-auto rounded-full bg-brand grid place-items-center text-xl font-bold">
              {profile?.full_name?.[0]?.toUpperCase() || "V"}
            </div>
            <h2 className="mt-2 font-semibold">
              {profile?.full_name || "Profissional Vértice"}
            </h2>
            <p className="text-xs text-fg-muted">{profile?.email}</p>
          </CardBody>
          <CardBody className="border-t border-border">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-fg-muted">Treinamento</span>
              <span className="font-medium">{progress.percent}%</span>
            </div>
            <Progress value={progress.percent} />
            <p className="text-xs text-fg-muted mt-2">
              {progress.completedLessons} de {progress.totalLessons} aulas
            </p>
            <Link href="/training" className="block mt-3">
              <Button variant="secondary" size="sm" className="w-full">
                <GraduationCap className="h-4 w-4" /> Continuar
              </Button>
            </Link>
          </CardBody>
        </Card>
      </aside>

      <section>
        <h1 className="text-2xl font-semibold mb-4">Feed de Vagas</h1>
        <JobFeed jobs={jobs ?? []} />
      </section>

      <aside className="space-y-4">
        <Card>
          <CardHeader>
            <h3 className="font-semibold flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-warning" /> Dicas
            </h3>
          </CardHeader>
          <CardBody className="text-sm text-fg-muted space-y-2">
            <p>✓ Use o e-mail da sua compra como contato.</p>
            <p>✓ Complete o treinamento para liberar candidaturas.</p>
            <p>✓ Vagas atualizadas semanalmente.</p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <h3 className="font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-success" /> Currículo
            </h3>
          </CardHeader>
          <CardBody className="text-sm text-fg-muted">
            Aprenda no treinamento como montar um currículo que se destaca mesmo
            sem experiência.
          </CardBody>
        </Card>
      </aside>
    </div>
    <Testimonials />
    </>
  );
}
