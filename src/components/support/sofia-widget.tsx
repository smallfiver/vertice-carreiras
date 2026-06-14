"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string; pending?: boolean };

const GREETING: Msg = {
  role: "assistant",
  content:
    "Oi! Eu sou a Sofia, atendente da Vértice Carreiras. Posso te ajudar com login, treinamento, vagas ou qualquer dúvida da plataforma — em que posso ser útil?",
};

export function SofiaWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loadedHistory, setLoadedHistory] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || loadedHistory) return;
    const supabase = createClient();
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoadedHistory(true);
        return;
      }
      const { data } = await supabase
        .from("support_messages")
        .select("role, content")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })
        .limit(40);
      if (data && data.length > 0) {
        setMessages([GREETING, ...data.map((d: any) => ({ role: d.role, content: d.content }))]);
      }
      setLoadedHistory(true);
    })();
  }, [open, loadedHistory]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    setSending(true);
    const next: Msg[] = [
      ...messages,
      { role: "user", content: text },
      { role: "assistant", content: "", pending: true },
    ];
    setMessages(next);

    try {
      const res = await fetch("/api/support/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const json = await res.json();
      const reply: string =
        json?.reply ||
        "Não consegui responder agora — tenta de novo em alguns segundos, por favor.";
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "assistant", content: reply };
        return copy;
      });
    } catch {
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          content:
            "Tive um problema de conexão aqui. Tenta de novo ou recarrega a página — se persistir, me avisa que escalo para a equipe.",
        };
        return copy;
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {/* Floating launcher */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full gold-gradient text-bg-deep font-semibold px-5 py-3 shadow-lg shadow-black/30 hover:scale-105 transition-transform"
          aria-label="Abrir suporte Sofia"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="hidden sm:inline">Fale com a Sofia</span>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-5 right-5 z-50 w-[min(380px,calc(100vw-2rem))] h-[min(560px,calc(100vh-2rem))] flex flex-col rounded-2xl border border-border bg-card shadow-2xl shadow-black/40 overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card-alt/60">
            <div className="h-9 w-9 rounded-full gold-gradient grid place-items-center shrink-0">
              <Sparkles className="h-4 w-4 text-bg-deep" />
            </div>
            <div className="flex-1 leading-tight">
              <p className="font-semibold text-sm">Sofia · Suporte Vértice</p>
              <p className="text-[11px] text-fg-muted flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-success inline-block" />
                Online agora
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="h-8 w-8 grid place-items-center rounded-md hover:bg-bg-deep/40 text-fg-muted"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-brand text-bg-deep rounded-br-sm"
                      : "bg-card-alt text-fg rounded-bl-sm border border-border"
                  }`}
                >
                  {m.pending ? (
                    <span className="inline-flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-fg-muted animate-pulse" />
                      <span className="h-1.5 w-1.5 rounded-full bg-fg-muted animate-pulse [animation-delay:150ms]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-fg-muted animate-pulse [animation-delay:300ms]" />
                    </span>
                  ) : (
                    m.content
                  )}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={send}
            className="border-t border-border p-3 flex items-center gap-2 bg-card-alt/40"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escreva sua dúvida..."
              disabled={sending}
              className="flex-1 bg-bg-deep border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-brand"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="h-9 w-9 grid place-items-center rounded-md bg-brand text-bg-deep hover:bg-brand-accent disabled:opacity-40"
              aria-label="Enviar"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
