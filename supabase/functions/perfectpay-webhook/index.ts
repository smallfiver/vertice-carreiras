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

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function normalizePhone(raw: unknown): string | null {
  if (!raw) return null;
  const digits = String(raw).replace(/\D+/g, "");
  if (!digits) return null;
  if (digits.startsWith("55") && digits.length >= 12) return digits;
  if (digits.length === 10 || digits.length === 11) return `55${digits}`;
  return digits;
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

function buildMessage(fullName: string | null, email: string, magicLink: string) {
  const nome = fullName?.split(" ")[0] ?? "tudo bem";
  return [
    `🎉 *Parabéns, ${nome}!* Seu acesso à *Vértice Carreiras* foi liberado.`,
    ``,
    `🔐 *Seu login é exatamente este e-mail:*`,
    `\`${email}\``,
    `Guarde-o — você usa ele toda vez que entrar na plataforma.`,
    ``,
    `Pra entrar agora sem senha, clique no link mágico abaixo (válido por 1h):`,
    `🔗 ${magicLink}`,
    ``,
    `👥 Entre no grupo VIP dos profissionais:`,
    `${WHATSAPP_GROUP_LINK}`,
    ``,
    `Qualquer dúvida, responde aqui mesmo. 💼`,
    `Equipe *Vértice Carreiras*`,
  ].join("\n");
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let body: any;
  try {
    body = await req.json();
  } catch {
    return json({ error: "JSON inválido" }, 400);
  }

  const { token, sale_status_enum, sale_status_detail, code, customer } = body;

  if (token !== WEBHOOK_TOKEN) {
    return json({ error: "Token inválido" }, 401);
  }

  const isApproved = sale_status_enum === 2 || sale_status_enum === 10;
  if (!isApproved) {
    return json(
      { message: `Evento ignorado (status: ${sale_status_detail ?? sale_status_enum})` },
      200,
    );
  }

  const email = (customer?.email ?? "").toString().toLowerCase().trim();
  const fullName = customer?.full_name ?? null;
  const phone = normalizePhone(
    customer?.phone_number ?? customer?.phone ?? customer?.cellphone,
  );

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
    const messageBody = buildMessage(fullName, email, magicLink);

    let whatsappStatus: string;
    let zapiMessageId: string | null = null;
    let waError: string | null = null;

    if (phone) {
      try {
        const result = await sendWhatsApp(phone, messageBody);
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
      waError = "sem telefone";
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
