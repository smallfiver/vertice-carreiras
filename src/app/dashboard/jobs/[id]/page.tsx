import { createClient } from "@/lib/supabase/server";
import { getTrainingProgress } from "@/lib/progress";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Lock, Rocket, CheckCircle2, ShieldCheck, Clock, Award } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ApplyButton } from "./apply-button";

export default async function JobDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", params.id)
    .eq("is_active", true)
    .single();

  if (!job) notFound();

  const progress = await getTrainingProgress(user!.id);

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <Card>
        <CardBody>
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-xl bg-card-alt grid place-items-center overflow-hidden">
              {job.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={job.logo_url} alt={job.company_name} className="h-full w-full object-cover" />
              ) : (
                <Building2 className="h-7 w-7 text-fg-muted" />
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold">{job.title}</h1>
              <p className="text-fg-muted">{job.company_name}</p>
              <p className="mt-2 text-success font-semibold text-lg">{job.salary_range}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader><h2 className="font-semibold">Descrição</h2></CardHeader>
        <CardBody className="text-sm text-fg-muted whitespace-pre-wrap">{job.description}</CardBody>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><h2 className="font-semibold">Requisitos</h2></CardHeader>
          <CardBody>
            <ul className="space-y-2 text-sm">
              {job.requirements.map((r: string, i: number) => (
                <li key={i} className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-brand-accent shrink-0 mt-0.5" />{r}</li>
              ))}
            </ul>
          </CardBody>
        </Card>
        <Card>
          <CardHeader><h2 className="font-semibold">Benefícios</h2></CardHeader>
          <CardBody>
            <ul className="space-y-2 text-sm">
              {job.benefits.map((b: string, i: number) => (
                <li key={i} className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />{b}</li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>

      {progress.isComplete ? (
        <>
          <Card className="border-brand/40 bg-gradient-to-br from-brand/10 via-success/5 to-transparent">
            <CardBody className="py-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full gold-gradient grid place-items-center shrink-0">
                  <ShieldCheck className="h-6 w-6 text-bg-deep" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-brand font-semibold">
                      Selo de Garantia Vértice
                    </span>
                    <span className="rounded-full bg-success/20 text-success px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      ✓ Contratação 100% garantida
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold mt-1.5">
                    Sua aprovação é certa. Nós garantimos por escrito.
                  </h3>
                  <p className="text-sm text-fg-muted mt-2 leading-relaxed">
                    Você concluiu o programa preparatório completo — isso te
                    coloca no grupo de profissionais com{" "}
                    <span className="text-brand font-semibold">
                      prioridade máxima
                    </span>{" "}
                    junto às empresas parceiras da Vértice. Ao se candidatar
                    agora, sua contratação para esta vaga é{" "}
                    <span className="text-success font-semibold">
                      assegurada contratualmente
                    </span>{" "}
                    pelo nosso compromisso de recolocação.
                  </p>
                  <div className="mt-4 grid sm:grid-cols-3 gap-3">
                    <div className="rounded-lg border border-border bg-card-alt/40 p-3">
                      <div className="flex items-center gap-1.5 text-brand">
                        <Clock className="h-4 w-4" />
                        <span className="text-xs uppercase tracking-wider font-semibold">
                          Prazo
                        </span>
                      </div>
                      <p className="text-sm font-bold mt-1">
                        2 dias úteis
                      </p>
                      <p className="text-[11px] text-fg-muted">
                        para aprovação oficial
                      </p>
                    </div>
                    <div className="rounded-lg border border-border bg-card-alt/40 p-3">
                      <div className="flex items-center gap-1.5 text-brand">
                        <Award className="h-4 w-4" />
                        <span className="text-xs uppercase tracking-wider font-semibold">
                          Status
                        </span>
                      </div>
                      <p className="text-sm font-bold mt-1">
                        Pré-aprovado
                      </p>
                      <p className="text-[11px] text-fg-muted">
                        pelo selo Vértice
                      </p>
                    </div>
                    <div className="rounded-lg border border-border bg-card-alt/40 p-3">
                      <div className="flex items-center gap-1.5 text-brand">
                        <ShieldCheck className="h-4 w-4" />
                        <span className="text-xs uppercase tracking-wider font-semibold">
                          Garantia
                        </span>
                      </div>
                      <p className="text-sm font-bold mt-1">
                        100% por contrato
                      </p>
                      <p className="text-[11px] text-fg-muted">
                        ou seu acesso devolvido
                      </p>
                    </div>
                  </div>
                  <p className="text-[11px] text-fg-muted/80 mt-4 italic">
                    Após o envio da candidatura, a empresa parceira tem até{" "}
                    <strong className="text-fg">2 (dois) dias úteis</strong>{" "}
                    para emitir a aprovação formal. Você receberá o contrato
                    diretamente no e-mail cadastrado.
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
          <ApplyButton jobId={job.id} applicationUrl={job.application_url} />
        </>
      ) : (
        <Card className="border-warning/40 bg-gradient-to-br from-warning/10 to-danger/10">
          <CardBody className="text-center py-8">
            <Lock className="h-12 w-12 mx-auto text-warning" />
            <h2 className="mt-3 font-serif text-2xl font-bold">
              Acesso à candidatura bloqueado
            </h2>
            <p className="mt-3 text-fg max-w-xl mx-auto leading-relaxed">
              Esta vaga faz parte do nosso{" "}
              <span className="text-brand font-semibold">
                Programa de Garantia de Contratação
              </span>
              . Para receber o{" "}
              <span className="text-success font-semibold">
                Selo Vértice de Pré-Aprovação
              </span>{" "}
              — que garante sua contratação em até{" "}
              <strong>2 dias úteis</strong> após a candidatura — é necessário
              concluir 100% do programa preparatório.
            </p>
            <p className="mt-3 text-sm text-fg-muted max-w-xl mx-auto">
              Profissionais que finalizam o treinamento têm{" "}
              <strong className="text-fg">aprovação assegurada</strong> junto
              às empresas parceiras. É a forma da Vértice proteger tanto você
              quanto o empregador.
            </p>
            <p className="text-xs text-fg-muted mt-4">
              Seu progresso: {progress.completedLessons}/{progress.totalLessons} aulas ({progress.percent}%)
            </p>
            <Link href="/training" className="inline-block mt-5">
              <Button className="bg-brand hover:bg-brand-accent text-bg-deep font-semibold" size="lg">
                <Rocket className="h-5 w-5" /> Concluir treinamento e desbloquear
              </Button>
            </Link>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
