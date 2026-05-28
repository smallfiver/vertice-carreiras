import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Briefcase, GraduationCap, ShieldCheck, Award, Star, TrendingUp } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-bg">
      <header className="border-b border-border bg-bg-deep/60 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md gold-gradient grid place-items-center">
              <span className="font-serif text-bg-deep font-bold">V</span>
            </div>
            <div className="leading-tight">
              <div className="font-serif font-bold tracking-wide">VÉRTICE</div>
              <div className="text-[9px] uppercase tracking-[0.25em] text-brand">
                Carreiras
              </div>
            </div>
          </div>
          <Link href="/login">
            <Button
              size="sm"
              className="bg-brand hover:bg-brand-accent text-bg-deep font-semibold"
            >
              Área do Profissional
            </Button>
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-24 text-center relative">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/5 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-brand">
          <Award className="h-3.5 w-3.5" /> Recolocação Profissional · Desde 2014
        </span>
        <h1 className="mt-8 font-serif text-5xl md:text-6xl font-bold tracking-tight leading-tight">
          A excelência em recolocação <br />
          <span className="brand-text-gold">
            home office no Brasil.
          </span>
        </h1>
        <p className="mt-6 text-lg text-fg-muted max-w-2xl mx-auto leading-relaxed">
          Programa estratégico de preparação combinado com um portfólio curado
          de oportunidades home office em empresas selecionadas. Para
          profissionais que buscam autoridade na própria trajetória.
        </p>
        <div className="mt-10 flex gap-4 justify-center flex-wrap">
          <a href="https://go.perfectpay.com.br/PPU000000000" target="_blank">
            <Button
              size="lg"
              className="bg-brand hover:bg-brand-accent text-bg-deep font-semibold"
            >
              Adquirir acesso
            </Button>
          </a>
          <Link href="/login">
            <Button size="lg" variant="secondary">
              Já sou cliente
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto border-t border-border pt-10">
          <div>
            <div className="font-serif text-3xl text-brand font-bold">9.842</div>
            <div className="text-[10px] uppercase tracking-wider text-fg-muted mt-1">
              Recolocações
            </div>
          </div>
          <div>
            <div className="font-serif text-3xl text-brand font-bold">4,9★</div>
            <div className="text-[10px] uppercase tracking-wider text-fg-muted mt-1">
              Avaliação média
            </div>
          </div>
          <div>
            <div className="font-serif text-3xl text-brand font-bold">4,7d</div>
            <div className="text-[10px] uppercase tracking-wider text-fg-muted mt-1">
              Tempo médio
            </div>
          </div>
          <div>
            <div className="font-serif text-3xl text-brand font-bold">+10</div>
            <div className="text-[10px] uppercase tracking-wider text-fg-muted mt-1">
              Anos de mercado
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24 grid md:grid-cols-4 gap-4">
        {[
          {
            icon: Briefcase,
            t: "Portfólio Curado",
            d: "Vagas home office de empresas selecionadas, atualizadas semanalmente.",
          },
          {
            icon: GraduationCap,
            t: "Programa Estratégico",
            d: "Metodologia exclusiva para conquistar a primeira oportunidade remota.",
          },
          {
            icon: ShieldCheck,
            t: "Empresas Verificadas",
            d: "Processo de validação criterioso de cada empregador parceiro.",
          },
          {
            icon: TrendingUp,
            t: "Acesso Vitalício",
            d: "Investimento único. Atualizações e suporte permanentes.",
          },
        ].map((f, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-6 hover:border-brand/40 transition-colors"
          >
            <div className="h-10 w-10 rounded-md bg-brand/10 border border-brand/20 grid place-items-center">
              <f.icon className="h-5 w-5 text-brand" />
            </div>
            <h3 className="mt-4 font-serif text-lg font-bold">{f.t}</h3>
            <p className="text-sm text-fg-muted mt-1.5 leading-relaxed">{f.d}</p>
          </div>
        ))}
      </section>

      <footer className="border-t border-border bg-bg-deep">
        <div className="mx-auto max-w-6xl px-6 py-8 flex flex-wrap items-center justify-between gap-4 text-xs text-fg-muted">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded gold-gradient grid place-items-center">
              <span className="font-serif text-bg-deep font-bold text-xs">V</span>
            </div>
            <span className="font-serif tracking-wide">VÉRTICE CARREIRAS</span>
            <span className="text-fg-muted/60">© 2026</span>
          </div>
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-brand" /> LGPD
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 text-brand" /> Reclame Aqui
            </span>
            <span>Conteúdo educacional ilustrativo.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
