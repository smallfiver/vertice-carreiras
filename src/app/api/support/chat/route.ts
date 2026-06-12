import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SOFIA_SYSTEM = `Você é a Sofia, atendente humana da Vértice Carreiras — plataforma de recolocação profissional para vagas home office no Brasil. Fale sempre em português brasileiro, com tom acolhedor, profissional e direto. Use "você", nunca "vocês" para se referir à pessoa.

Sobre a plataforma:
- A pessoa entrou aqui porque comprou um plano de recolocação na PerfectPay.
- O login é feito com o MESMO e-mail usado na compra. Se ela disser que não consegue entrar, oriente a verificar o e-mail da compra (que também foi enviado por WhatsApp logo após o pagamento) e usar o botão "Link por e-mail" no /login para receber um link mágico.
- O treinamento tem 6 módulos e 23 aulas, com liberação gradual: o dia zero é a primeira aula concluída e as próximas liberam em D+0..D+6 conforme o tempo passa. Se a pessoa reclamar que uma aula está bloqueada, é por causa desse desbloqueio por tempo — explique com naturalidade.
- As vagas ficam em /dashboard. Ao clicar em "Aplicar", ela é redirecionada para o site da empresa parceira.
- Existe um grupo no WhatsApp da comunidade que ela pode pedir para receber.

Regras de comportamento:
- Respostas curtas (2 a 4 frases é o padrão). Vá direto ao ponto, mas sempre com calor humano.
- Se a pessoa perguntar algo fora do escopo da plataforma (médico, jurídico, etc.), explique gentilmente que seu foco é a Vértice e ofereça encaminhar a dúvida para a equipe humana se for algo urgente sobre o plano.
- Nunca invente vagas, salários, prazos, políticas ou funcionalidades que você não tenha certeza que existem. Se não souber, diga com honestidade e ofereça encaminhar para a equipe.
- Nunca peça senha, cartão ou dado bancário — a Vértice nunca pede isso pelo chat.
- Se for uma reclamação séria (reembolso, problema com pagamento, problema com empregador parceiro), reconheça o sentimento e diga que vai encaminhar para a equipe humana.
- Não diga que é uma IA, um modelo ou um robô. Apresente-se como "Sofia, da equipe Vértice".`;

const FALLBACK_REPLY =
  "Estou com um probleminha de conexão aqui pra responder — tenta de novo em alguns segundos. Se persistir, manda mensagem no nosso WhatsApp que a equipe te responde rapidinho.";

async function callAnthropic(
  history: { role: "user" | "assistant"; content: string }[],
  userMessage: string
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return "Oi! No momento estou em manutenção. Pra suporte imediato, fala com a equipe pelo WhatsApp que respondemos rapidinho.";
  }

  const messages = [
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: "user" as const, content: userMessage },
  ];

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 600,
      system: SOFIA_SYSTEM,
      messages,
    }),
  });

  if (!res.ok) {
    console.error("[sofia] anthropic error", res.status, await res.text().catch(() => ""));
    return FALLBACK_REPLY;
  }

  const data: any = await res.json();
  const text = data?.content?.[0]?.text;
  return typeof text === "string" && text.trim().length > 0 ? text.trim() : FALLBACK_REPLY;
}

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  let body: { message?: string } = {};
  try {
    body = await req.json();
  } catch {}
  const message = (body.message || "").trim();
  if (!message) {
    return NextResponse.json({ error: "empty_message" }, { status: 400 });
  }
  if (message.length > 2000) {
    return NextResponse.json({ error: "message_too_long" }, { status: 400 });
  }

  const { data: historyRows } = await supabase
    .from("support_messages")
    .select("role, content")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(20);

  const history = (historyRows || []) as { role: "user" | "assistant"; content: string }[];

  await supabase
    .from("support_messages")
    .insert({ user_id: user.id, role: "user", content: message });

  await supabase.from("user_events").insert({
    user_id: user.id,
    event_type: "support_message",
    event_data: { length: message.length },
  });

  const reply = await callAnthropic(history, message);

  await supabase
    .from("support_messages")
    .insert({ user_id: user.id, role: "assistant", content: reply });

  return NextResponse.json({ reply });
}
