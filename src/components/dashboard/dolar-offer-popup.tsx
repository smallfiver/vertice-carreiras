"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  X,
  Zap,
  Globe2,
  Shield,
  TrendingUp,
  Sparkles,
} from "lucide-react";

const STORAGE_KEY = "vertice:dolar-offer-v1";
const CHECKOUT_URL =
  process.env.NEXT_PUBLIC_DOLAR_CHECKOUT_URL ??
  "https://go.perfectpay.com.br/PPU38CQD57Q";

export function DolarOfferPopup() {
  const [open, setOpen] = useState(false);
  const [seats, setSeats] = useState(17);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Aguarda termos antes de aparecer (não empilhar 2 modais).
    if (!localStorage.getItem("vertice:terms-v1")) return;
    if (localStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setOpen(true), 1500);
    return () => clearTimeout(t);
  }, []);

  // Contador de escassez (visual) — decresce devagar enquanto o modal está aberto.
  useEffect(() => {
    if (!open) return;
    const t = setInterval(() => {
      setSeats((n) => (n > 4 ? n - 1 : n));
    }, 18000);
    return () => clearInterval(t);
  }, [open]);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-md rounded-2xl border border-brand/40 bg-card shadow-[0_20px_80px_-20px_rgba(201,169,97,0.4)] overflow-hidden">
        <button
          onClick={dismiss}
          aria-label="Fechar"
          className="absolute top-3 right-3 z-10 h-8 w-8 grid place-items-center rounded-full text-bg-deep/60 hover:text-bg-deep hover:bg-white/30 transition"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Cabeçalho dourado */}
        <div className="relative bg-gradient-to-br from-brand via-brand-accent to-brand p-5 text-bg-deep overflow-hidden">
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, #fff 0%, transparent 40%), radial-gradient(circle at 80% 80%, #fff 0%, transparent 40%)",
            }}
          />
          <div className="relative flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold">
            <Sparkles className="h-3.5 w-3.5" />
            Liberação exclusiva — só nesta sessão
          </div>
          <h2 className="relative font-serif text-2xl md:text-[1.7rem] font-extrabold mt-2 leading-tight">
            Receba em <span className="underline decoration-bg-deep/40">dólar</span>{" "}
            trabalhando do seu sofá.
          </h2>
          <p className="relative text-[13px] mt-2 text-bg-deep/85 leading-snug">
            Destrave o módulo <b>Vagas em Dólar</b> e tenha acesso às oportunidades
            internacionais que pagam de <b>US$ 1.500 a US$ 6.000/mês</b> —
            convertendo a um câmbio que muda sua vida.
          </p>
        </div>

        {/* Corpo */}
        <div className="p-5 space-y-4">
          <ul className="space-y-2.5 text-[13px] leading-snug">
            <li className="flex gap-2.5">
              <Globe2 className="h-4 w-4 text-brand mt-0.5 shrink-0" />
              <span>
                <b className="text-brand">+340 vagas remotas internacionais</b> de
                empresas dos EUA, Europa e LATAM contratando brasileiros agora.
              </span>
            </li>
            <li className="flex gap-2.5">
              <TrendingUp className="h-4 w-4 text-brand mt-0.5 shrink-0" />
              <span>
                Modelos de currículo, carta e mensagens em inglês{" "}
                <b className="text-brand">já aprovados</b> em processos seletivos
                reais — é só copiar e enviar.
              </span>
            </li>
            <li className="flex gap-2.5">
              <DollarSign className="h-4 w-4 text-brand mt-0.5 shrink-0" />
              <span>
                Passo a passo para <b className="text-brand">receber em dólar</b>{" "}
                via Wise, Deel e Payoneer — sem perder dinheiro em taxas
                abusivas.
              </span>
            </li>
            <li className="flex gap-2.5">
              <Zap className="h-4 w-4 text-brand mt-0.5 shrink-0" />
              <span>
                Lista atualizada toda semana com as vagas que{" "}
                <b className="text-brand">aceitam inglês intermediário</b>.
              </span>
            </li>
            <li className="flex gap-2.5">
              <Shield className="h-4 w-4 text-brand mt-0.5 shrink-0" />
              <span>
                <b className="text-brand">7 dias de garantia incondicional.</b>{" "}
                Não amou? Devolvemos cada centavo.
              </span>
            </li>
          </ul>

          {/* Bloco de preço com âncora */}
          <div className="rounded-xl border border-brand/30 bg-gradient-to-br from-brand/10 to-transparent p-4 text-center">
            <div className="text-[10px] uppercase tracking-wider text-fg-muted">
              De{" "}
              <span className="line-through decoration-danger/70">
                R$ 197,00
              </span>{" "}
              por apenas
            </div>
            <div className="font-serif text-[2.6rem] font-extrabold text-brand mt-1 leading-none">
              R$ 27<span className="text-2xl">,90</span>
            </div>
            <div className="text-[11px] text-fg-muted mt-2">
              Pagamento único · Acesso vitalício · Liberação imediata
            </div>
          </div>

          {/* Escassez */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-warning">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-warning" />
            </span>
            Restam <b className="text-warning">{seats} vagas</b> nesta condição
          </div>

          <a
            href={CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              // Marca como "intent" — não fecha pra eles voltarem se cancelarem.
              try {
                localStorage.setItem(
                  "vertice:dolar-offer-clicked",
                  new Date().toISOString()
                );
              } catch {}
            }}
            className="block"
          >
            <Button
              size="lg"
              className="w-full bg-brand hover:bg-brand-accent text-bg-deep font-bold text-[15px] shadow-lg shadow-brand/30"
            >
              QUERO DESTRAVAR AGORA POR R$ 27,90
            </Button>
          </a>

          <button
            onClick={dismiss}
            className="w-full text-[11px] text-fg-muted hover:text-fg transition"
          >
            Agora não — entendo que perco esta condição.
          </button>

          <div className="flex items-center justify-center gap-3 text-[10px] text-fg-muted pt-1 border-t border-border">
            <span className="inline-flex items-center gap-1">
              <Shield className="h-3 w-3 text-brand" /> Compra 100% segura
            </span>
            <span>·</span>
            <span>Pix, cartão e boleto</span>
          </div>
        </div>
      </div>
    </div>
  );
}
