// Supabase Edge Function — PerfectPay Webhook
// Recebe a notificação de venda da PerfectPay, cria o usuário no Supabase Auth
// (já confirmado, sem precisar de senha), dispara WhatsApp via Z-API com magic
// link + convite pro grupo VIP, e registra tudo em public.whatsapp_messages.
//
// Secrets necessários:
//   PERFECTPAY_WEBHOOK_TOKEN
//   ZAPI_INSTANCE_ID
//   ZAPI_TOKEN
//   ZAPI_CLIENT_TOKEN
//   WHATSAPP_GROUP_LINK
//   SITE_URL
//   ADMIN_WHATSAPP_PHONE (opcional — recebe cópia "lead criado")

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const WEBHOOK_TOKEN = Deno.env.get("PERFECTPAY_WEBHOOK_TOKEN")!;
const SITE_URL = Deno.env.get("SITE_URL") ?? "https://vertice-carreiras.vercel.app";

const ZAPI_INSTANCE_ID = Deno.env.get("ZAPI_INSTANCE_ID")!;
const ZAPI_TOKEN = Deno.env.get("ZAPI_TOKEN")!;
const ZAPI_CLIENT_TOKEN = Deno.env.get("ZAPI_CLIENT_TOKEN")!;
const WHATSAPP_GROUP_LINK =
  Deno.env.get("WHATSAPP_GROUP_LINK") ??
  "https://chat.whatsapp.com/CGw6qFzV1WXDyIkVJQtKgi";
const ADMIN_WHATSAPP_PHONE = Deno.env.get("ADMIN_WHATSAPP_PHONE") ?? "";

// Imagem do card preview do WhatsApp (Unsplash — profissional/escritório).
// Pode ser sobrescrita por env sem redeploy.
const WHATSAPP_CARD_IMAGE =
  Deno.env.get("WHATSAPP_CARD_IMAGE") ??
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80";
const WHATSAPP_CARD_TITLE =
  Deno.env.get("WHATSAPP_CARD_TITLE") ?? "Acessar Plataforma Vértice";
const WHATSAPP_CARD_DESCRIPTION =
  Deno.env.get("WHATSAPP_CARD_DESCRIPTION") ??
  "Sua área do profissional — Vértice Carreiras";

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

// Brasileiro: 55 + DDD (2) + número (8 ou 9) = 12 ou 13 dígitos.
// Aceita:
//  - número já completo com 55 (>=12)
//  - DDD + número (10 ou 11) → prepende 55
//  - se receber área code separado (parâmetro area), concatena
// Rejeita qualquer coisa menor que 10 dígitos (sem DDD), retornando null,
// pra evitar o caso que já vimos: PerfectPay mandando só 9 dígitos e o Z-API
// aceitando sem entregar.
function normalizePhone(raw: unknown, area: unknown = null): {
  phone: string | null;
  reason?: string;
} {
  if (!raw && !area) return { phone: null, reason: "sem telefone" };

  const rawDigits = String(raw ?? "").replace(/\D+/g, "");
  const areaDigits = String(area ?? "").replace(/\D+/g, "");

  // 1) Tenta como veio puro
  if (rawDigits.startsWith("55") && rawDigits.length >= 12) {
    return { phone: rawDigits };
  }
  if (rawDigits.length === 10 || rawDigits.length === 11) {
    return { phone: `55${rawDigits}` };
  }

  // 2) Combina area code + número quando a PerfectPay manda separado
  if (areaDigits && rawDigits) {
    const combined = `${areaDigits}${rawDigits}`;
    if (combined.startsWith("55") && combined.length >= 12) {
      return { phone: combined };
    }
    if (combined.length === 10 || combined.length === 11) {
      return { phone: `55${combined}` };
    }
    if (combined.length >= 12) {
      return { phone: combined };
    }
    return {
      phone: null,
      reason: `telefone incompleto após combinar DDD+numero: ${combined} (${combined.length} dígitos)`,
    };
  }

  return {
    phone: null,
    reason: `telefone inválido: ${rawDigits} (${rawDigits.length} dígitos, sem DDD)`,
  };
}

async function sendWhatsApp(phone: string, message: string) {
  const url = `https://api.z-api.io/instances/${ZAPI_INSTANCE_ID}/token/${ZAPI_TOKEN}/send-text`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Client-Token": ZAPI_CLIENT_TOKEN,
    },
    body: JSON.stringify({ phone, message }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Z-API erro ${res.status}: ${text}`);
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

// /send-link: gera um card preview com imagem + titulo + descricao + botao
// clicavel para a linkUrl. O texto da mensagem aparece ACIMA do card.
async function sendWhatsAppLink(args: {
  phone: string;
  message: string;
  linkUrl: string;
  title: string;
  description: string;
  image: string;
}) {
  const url = `https://api.z-api.io/instances/${ZAPI_INSTANCE_ID}/token/${ZAPI_TOKEN}/send-link`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Client-Token": ZAPI_CLIENT_TOKEN,
    },
    body: JSON.stringify({
      phone: args.phone,
      message: args.message,
      image: args.image,
      linkUrl: args.linkUrl,
      title: args.title,
      linkDescription: args.description,
    }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Z-API erro ${res.status}: ${text}`);
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

function buildMessage(fullName: string | null, email: string) {
  const nome = fullName?.split(" ")[0] ?? "tudo bem";
  return [
    `🎉 *Parabéns, ${nome}!* Seu acesso à *Vértice Carreiras* foi liberado.`,
    ``,
    `🔐 *Seu login é exatamente este e-mail:*`,
    `${email}`,
    `Guarde-o — você usa toda vez que entrar na plataforma.`,
    ``,
    `Toque no card abaixo pra entrar agora (1 toque = logado, válido por 1h):`,
    ``,
    `👥 Depois, entra no grupo VIP dos profissionais:`,
    `${WHATSAPP_GROUP_LINK}`,
    ``,
    `Qualquer dúvida, responde aqui mesmo. 💼`,
    `Equipe *Vértice Carreiras*`,
  ].join("\n");
}

function buildAdminCopy(args: {
  fullName: string | null;
  email: string;
  phone: string | null;
  status: string;
  error: string | null;
  saleCode: string | null;
}) {
  const lines = [
    `📤 *Lead Vértice Carreiras*`,
    ``,
    `👤 ${args.fullName ?? "(sem nome)"}`,
    `📧 ${args.email}`,
    `📱 ${args.phone ?? "(sem telefone válido)"}`,
    `🛒 Venda: ${args.saleCode ?? "-"}`,
    `📨 WhatsApp: ${args.status}${args.error ? ` (${args.error})` : ""}`,
  ];
  return lines.join("\n");
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const url = new URL(req.url);
  const tokenFromQuery = url.searchParams.get("token");

  let body: any;
  let rawText = "";
  try {
    rawText = await req.text();
    body = JSON.parse(rawText);
  } catch {
    return json({ error: "JSON inválido" }, 400);
  }

  const { sale_status_enum, sale_status_detail, code, customer } = body;
  const token = tokenFromQuery ?? body.token;

  if (token !== WEBHOOK_TOKEN) {
    console.error("[AUTH] Token mismatch", {
      received_len: token ? String(token).length : 0,
      received_source: tokenFromQuery ? "query" : (body?.token ? "body" : "none"),
      expected_len: WEBHOOK_TOKEN ? WEBHOOK_TOKEN.length : 0,
      env_present: !!WEBHOOK_TOKEN,
    });
    return json({ error: "Token inválido" }, 401);
  }

  const isApproved = sale_status_enum === 2 || sale_status_enum === 10;

  const email = (customer?.email ?? "").toString().toLowerCase().trim();
  const fullName = customer?.full_name ?? customer?.fullName ?? customer?.name ?? null;

  // Lê TODOS os campos possíveis da PerfectPay pra montar o telefone
  const rawPhone =
    customer?.phone_number ??
    customer?.phone ??
    customer?.cellphone ??
    customer?.mobile ??
    customer?.celular ??
    null;
  const phoneArea =
    customer?.phone_area_code ??
    customer?.area_code ??
    customer?.ddd ??
    null;

  const { phone, reason: phoneReason } = normalizePhone(rawPhone, phoneArea);

  // SEMPRE loga o payload bruto da PerfectPay pra diagnóstico futuro
  await supabaseAdmin
    .from("perfectpay_payloads")
    .insert({
      sale_code: code ?? null,
      email: email || null,
      full_name: fullName,
      phone_parsed: phone,
      phone_valid: !!phone,
      raw_body: body,
    })
    .then(() => {}, (e) => console.error("log payload falhou:", e?.message));

  if (!isApproved) {
    return json(
      { message: `Evento ignorado (status: ${sale_status_detail ?? sale_status_enum})` },
      200,
    );
  }

  if (!email) return json({ error: "Email do cliente ausente" }, 400);

  try {
    const { data: list } = await supabaseAdmin.auth.admin.listUsers();
    const existing = list?.users.find(
      (u) => u.email?.toLowerCase() === email,
    );

    let userId: string;

    if (existing) {
      userId = existing.id;
      await supabaseAdmin
        .from("profiles")
        .update({ perfectpay_sale_code: code })
        .eq("id", userId);
    } else {
      const { data: created, error: createErr } =
        await supabaseAdmin.auth.admin.createUser({
          email,
          email_confirm: true,
          user_metadata: { full_name: fullName, perfectpay_sale_code: code },
        });

      if (createErr || !created.user) {
        throw new Error(`Erro ao criar usuário: ${createErr?.message}`);
      }

      userId = created.user.id;

      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .insert({
          id: userId,
          full_name: fullName,
          email,
          perfectpay_sale_code: code,
          is_admin: false,
        });

      if (profileError) {
        console.error("Erro ao criar profile:", profileError.message);
      }
    }

    const { data: linkData, error: linkErr } =
      await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email,
        options: { redirectTo: `${SITE_URL}/dashboard` },
      });

    if (linkErr || !linkData?.properties?.action_link) {
      throw new Error(`Erro ao gerar magic link: ${linkErr?.message}`);
    }

    const magicLink = linkData.properties.action_link;
    const messageBody = buildMessage(fullName, email);

    let whatsappStatus: string;
    let zapiMessageId: string | null = null;
    let waError: string | null = null;

    if (phone) {
      try {
        const result = await sendWhatsAppLink({
          phone,
          message: messageBody,
          linkUrl: magicLink,
          title: WHATSAPP_CARD_TITLE,
          description: WHATSAPP_CARD_DESCRIPTION,
          image: WHATSAPP_CARD_IMAGE,
        });
        zapiMessageId =
          result?.messageId ?? result?.id ?? result?.zaapId ?? null;
        whatsappStatus = "sent";
      } catch (waErr: any) {
        console.error("Falha Z-API:", waErr.message);
        whatsappStatus = "failed";
        waError = waErr.message;
      }
    } else {
      whatsappStatus = "skipped";
      waError = phoneReason ?? "sem telefone";
    }

    // Registra log da mensagem (mesmo se falhar / skip)
    const { error: logErr } = await supabaseAdmin
      .from("whatsapp_messages")
      .insert({
        user_id: userId,
        email,
        full_name: fullName,
        phone,
        message: messageBody,
        zapi_message_id: zapiMessageId,
        status: whatsappStatus,
        error: waError,
        perfectpay_sale_code: code,
      });

    if (logErr) {
      console.error("Erro ao registrar whatsapp_messages:", logErr.message);
    }

    // Cópia pro admin (royal) - visibilidade que o lead chegou
    if (ADMIN_WHATSAPP_PHONE) {
      const adminCopy = buildAdminCopy({
        fullName,
        email,
        phone,
        status: whatsappStatus,
        error: waError,
        saleCode: code ?? null,
      });
      sendWhatsApp(ADMIN_WHATSAPP_PHONE, adminCopy).catch((e) =>
        console.error("Falha cópia admin:", e?.message),
      );
    }

    return json(
      {
        success: true,
        message: existing ? "Acesso já existente — link reenviado." : "Acesso liberado.",
        userId,
        whatsapp: whatsappStatus,
        zapiMessageId,
        error: waError,
      },
      existing ? 200 : 201,
    );
  } catch (err: any) {
    console.error("Erro Webhook PerfectPay:", err);

    // tenta logar erro como mensagem failed
    await supabaseAdmin
      .from("whatsapp_messages")
      .insert({
        email,
        full_name: fullName,
        phone,
        message: "(falha antes do envio)",
        status: "failed",
        error: err.message ?? "Erro interno",
        perfectpay_sale_code: code,
      })
      .then(() => {}, () => {});

    return json({ error: err.message ?? "Erro interno" }, 500);
  }
});
