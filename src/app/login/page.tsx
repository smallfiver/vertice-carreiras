"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, ShieldCheck, Award, TrendingUp, Lock as LockIcon, MessageCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"password" | "magic">("password");

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setMsg(error.message);
    router.push("/dashboard");
    router.refresh();
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        shouldCreateUser: false, // bloqueia acesso para e-mails sem compra
      },
    });
    setLoading(false);
    if (error) {
      const lower = error.message.toLowerCase();
      if (lower.includes("not found") || lower.includes("signups not allowed")) {
        return setMsg(
          "Este e-mail não consta em nossa base de profissionais. Acesso liberado apenas para o e-mail utilizado na aquisição do plano.",
        );
      }
      return setMsg(error.message);
    }
    setMsg("Enviamos um link de acesso seguro para o seu e-mail corporativo.");
  }

  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-bg-deep via-bg to-card">
        {/* Smiling professional woman background */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80"
          alt="Profissional Vértice"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-deep via-bg-deep/85 to-bg-deep/40 pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, #C9A961 0%, transparent 40%), radial-gradient(circle at 80% 70%, #C9A961 0%, transparent 40%)",
          }}
        />
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-md gold-gradient grid place-items-center">
              <span className="font-serif text-bg-deep text-xl font-bold">V</span>
            </div>
            <div>
              <div className="font-serif text-xl font-bold tracking-wide">
                VÉRTICE
              </div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-brand -mt-0.5">
                Carreiras
              </div>
            </div>
          </div>
        </div>

        <div className="relative space-y-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand mb-3">
              Recolocação Profissional
            </p>
            <h1 className="font-serif text-4xl xl:text-5xl leading-tight">
              O ponto mais alto da sua{" "}
              <span className="brand-text-gold">trajetória profissional</span>{" "}
              começa aqui.
            </h1>
            <p className="mt-5 text-fg-muted leading-relaxed max-w-md">
              Há mais de uma década conectando profissionais qualificados a
              oportunidades home office de empresas selecionadas em todo o
              Brasil.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 border-t border-border pt-6 max-w-md">
            <div>
              <div className="font-serif text-2xl text-brand font-bold">9.842</div>
              <div className="text-[10px] uppercase tracking-wider text-fg-muted">
                Recolocações
              </div>
            </div>
            <div>
              <div className="font-serif text-2xl text-brand font-bold">4,9</div>
              <div className="text-[10px] uppercase tracking-wider text-fg-muted">
                Avaliação média
              </div>
            </div>
            <div>
              <div className="font-serif text-2xl text-brand font-bold">4,7d</div>
              <div className="text-[10px] uppercase tracking-wider text-fg-muted">
                Tempo médio
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex items-center gap-6 text-[11px] text-fg-muted">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-brand" /> SSL 256-bit
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-brand" /> LGPD compliant
          </span>
          <span className="inline-flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-brand" /> Desde 2014
          </span>
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 md:p-12 bg-bg">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="h-10 w-10 rounded-md gold-gradient grid place-items-center">
              <span className="font-serif text-bg-deep font-bold">V</span>
            </div>
            <div>
              <div className="font-serif font-bold tracking-wide">VÉRTICE</div>
              <div className="text-[9px] uppercase tracking-[0.25em] text-brand -mt-0.5">
                Carreiras
              </div>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.25em] text-brand mb-2">
              Área do Profissional
            </p>
            <h2 className="font-serif text-3xl font-bold">Acesso seguro</h2>
            <p className="text-sm text-fg-muted mt-2">
              Utilize o e-mail cadastrado durante a aquisição do seu plano.
            </p>
          </div>

          <div className="mb-6 rounded-lg border border-brand/30 bg-brand/10 p-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-md bg-brand/20 grid place-items-center shrink-0 mt-0.5">
                <MessageCircle className="h-4 w-4 text-brand" />
              </div>
              <div className="text-sm">
                <p className="font-semibold text-fg">
                  Seu login é o e-mail da compra na PerfectPay.
                </p>
                <p className="text-fg-muted text-xs mt-1 leading-relaxed">
                  Enviamos um link mágico de acesso pelo WhatsApp logo após a
                  confirmação do seu pagamento. Use exatamente o mesmo e-mail
                  para entrar aqui.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-1 mb-6 p-1 bg-card rounded-lg border border-border">
            <button
              onClick={() => setMode("password")}
              className={`flex-1 py-2 rounded-md text-sm transition-all ${
                mode === "password"
                  ? "bg-brand text-bg-deep font-semibold"
                  : "text-fg-muted hover:text-fg"
              }`}
            >
              Senha
            </button>
            <button
              onClick={() => setMode("magic")}
              className={`flex-1 py-2 rounded-md text-sm transition-all ${
                mode === "magic"
                  ? "bg-brand text-bg-deep font-semibold"
                  : "text-fg-muted hover:text-fg"
              }`}
            >
              Link por e-mail
            </button>
          </div>

          <form
            onSubmit={mode === "password" ? handlePasswordLogin : handleMagicLink}
            className="space-y-4"
          >
            <div>
              <label className="text-xs uppercase tracking-wider text-fg-muted mb-1.5 block">
                E-mail da compra na PerfectPay
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-fg-muted" />
                <Input
                  type="email"
                  placeholder="seuemail@dacompra.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
              <p className="text-[11px] text-fg-muted mt-2">
                É o mesmo e-mail que você recebeu pelo WhatsApp junto com o
                link mágico.
              </p>
            </div>

            {mode === "password" && (
              <div>
                <label className="text-xs uppercase tracking-wider text-fg-muted mb-1.5 block">
                  Senha de acesso
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-fg-muted" />
                  <Input
                    type="password"
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
                <p className="text-[11px] text-fg-muted mt-2">
                  Primeiro acesso? Use o link mágico que enviamos pelo
                  WhatsApp ou clique em <span className="text-brand font-medium">Link por e-mail</span> acima.
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-brand hover:bg-brand-accent text-bg-deep font-semibold"
              disabled={loading}
            >
              {loading
                ? "Autenticando..."
                : mode === "password"
                ? "Acessar plataforma"
                : "Enviar link de acesso"}
            </Button>
          </form>

          {msg && (
            <p className="mt-4 text-sm text-warning text-center bg-warning/10 border border-warning/20 rounded-md py-2 px-3">
              {msg}
            </p>
          )}

          <div className="mt-8 pt-6 border-t border-border flex items-center justify-center gap-2 text-[11px] text-fg-muted">
            <LockIcon className="h-3 w-3" />
            Conexão criptografada · Certificado de segurança verificado
          </div>
        </div>
      </div>
    </main>
  );
}
