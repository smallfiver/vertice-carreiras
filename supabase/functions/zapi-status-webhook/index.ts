// Supabase Edge Function — Z-API Status Webhook
// Recebe callbacks do Z-API (delivered, read, replied) e atualiza
// public.whatsapp_messages.
//
// Configurar no painel Z-API → Webhooks:
//   On send / On delivery / On read / On message received
//   URL: https://<PROJECT_REF>.supabase.co/functions/v1/zapi-status-webhook
//
// Sem secrets adicionais — usa SUPABASE_URL + SERVICE_ROLE_KEY.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

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

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let body: any;
  try {
    body = await req.json();
  } catch {
    return json({ error: "JSON inválido" }, 400);
  }

  // Z-API envia { type: "ReceivedCallback" | "DeliveryCallback" | "ReadCallback" | "MessageStatusCallback", ... }
  const type: string = body?.type ?? body?.event ?? "";
  const phone = normalizePhone(body?.phone ?? body?.from);
  const messageId: string | null =
    body?.messageId ?? body?.zaapId ?? body?.referenceMessageId ?? null;
  const now = new Date().toISOString();

  try {
    // Caso 1: mensagem recebida do cliente (resposta).
    // Z-API: type === "ReceivedCallback" com fromMe === false.
    const isReceived =
      type === "ReceivedCallback" ||
      (body?.fromMe === false && (body?.text?.message || body?.message));

    if (isReceived && phone) {
      const replyText =
        body?.text?.message ??
        body?.message ??
        body?.body ??
        "(mídia ou anexo)";

      // Encontra a última mensagem enviada pro mesmo telefone.
      const { data: last } = await supabaseAdmin
        .from("whatsapp_messages")
        .select("id")
        .eq("phone", phone)
        .order("sent_at", { ascending: false })
        .limit(1);

      if (last && last.length > 0) {
        await supabaseAdmin
          .from("whatsapp_messages")
          .update({
            status: "replied",
            reply_text: replyText,
            replied_at: now,
            raw_callback: body,
          })
          .eq("id", last[0].id);
      } else {
        // resposta órfã — registra mesmo assim pra rastreio
        await supabaseAdmin.from("whatsapp_messages").insert({
          email: "(resposta sem envio prévio)",
          phone,
          message: "(inbound)",
          status: "replied",
          reply_text: replyText,
          replied_at: now,
          raw_callback: body,
        });
      }

      return json({ ok: true, handled: "received" });
    }

    // Caso 2: status (delivered / read / sent).
    if (!messageId) {
      return json({ ok: true, handled: "ignored (sem messageId)" });
    }

    const updates: Record<string, unknown> = { raw_callback: body };

    const status: string =
      body?.status ?? body?.messageStatus ?? type ?? "";
    const norm = String(status).toLowerCase();

    if (norm.includes("deliver")) {
      updates.status = "delivered";
      updates.delivered_at = now;
    } else if (norm.includes("read")) {
      updates.status = "read";
      updates.read_at = now;
    } else if (norm.includes("played")) {
      updates.status = "read";
      updates.read_at = now;
    } else if (norm.includes("sent")) {
      updates.status = "sent";
    } else {
      // status desconhecido — só salva o raw_callback
    }

    const { error } = await supabaseAdmin
      .from("whatsapp_messages")
      .update(updates)
      .eq("zapi_message_id", messageId);

    if (error) console.error("Update whatsapp_messages falhou:", error.message);

    return json({ ok: true, handled: norm, messageId });
  } catch (err: any) {
    console.error("Erro zapi-status-webhook:", err);
    return json({ error: err.message ?? "Erro interno" }, 500);
  }
});
