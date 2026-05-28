// Supabase Edge Function — PerfectPay Webhook
// Recebe a notificação de venda da PerfectPay, cria o usuário no Supabase Auth
// e envia automaticamente um e-mail de convite com link mágico para o lead
// definir senha e entrar na plataforma Vértice Carreiras.
//
// Deploy:
//   supabase functions deploy perfectpay-webhook --no-verify-jwt
//
// Secrets necessários (definir no projeto Supabase):
//   supabase secrets set PERFECTPAY_WEBHOOK_TOKEN=xxxxx
//   # SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY já são injetados automaticamente
//
// URL pública (configure na PerfectPay):
//   https://<PROJECT_REF>.supabase.co/functions/v1/perfectpay-webhook

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const WEBHOOK_TOKEN = Deno.env.get("PERFECTPAY_WEBHOOK_TOKEN")!;
const SITE_URL = Deno.env.get("SITE_URL") ?? "https://verticecarreiras.com.br";

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
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

  // 1) Valida o token da PerfectPay
  if (token !== WEBHOOK_TOKEN) {
    return json({ error: "Token inválido" }, 401);
  }

  // 2) Só processa vendas APROVADAS (2 = approved, 10 = completed)
  const isApproved = sale_status_enum === 2 || sale_status_enum === 10;
  if (!isApproved) {
    return json(
      { message: `Evento ignorado (status: ${sale_status_detail ?? sale_status_enum})` },
      200,
    );
  }

  const email = (customer?.email ?? "").toString().toLowerCase().trim();
  const fullName = customer?.full_name ?? null;

  if (!email) return json({ error: "Email do cliente ausente" }, 400);

  try {
    // 3) Já existe? — apenas atualiza o código da venda
    const { data: list } = await supabaseAdmin.auth.admin.listUsers();
    const existing = list?.users.find(
      (u) => u.email?.toLowerCase() === email,
    );

    if (existing) {
      await supabaseAdmin
        .from("profiles")
        .update({ perfectpay_sale_code: code })
        .eq("id", existing.id);

      // Reenvia link de acesso (magic link) para o lead voltar a entrar
      await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email,
        options: { redirectTo: `${SITE_URL}/dashboard` },
      });

      return json(
        { message: "Usuário já existia; link de acesso reenviado.", userId: existing.id },
        200,
      );
    }

    // 4) Cria o usuário e dispara o INVITE (e-mail automático do Supabase
    //    com link para definir senha + entrar). Esse é o canal oficial de
    //    liberação — só o e-mail da compra recebe acesso.
    const { data: invited, error: inviteErr } =
      await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        data: { full_name: fullName, perfectpay_sale_code: code },
        redirectTo: `${SITE_URL}/dashboard`,
      });

    if (inviteErr || !invited.user) {
      throw new Error(`Erro ao convidar usuário: ${inviteErr?.message}`);
    }

    // 5) Cria o profile vinculado
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: invited.user.id,
        full_name: fullName,
        email,
        perfectpay_sale_code: code,
        is_admin: false,
      });

    if (profileError) {
      // Não bloqueia (o usuário foi criado); apenas loga
      console.error("Erro ao criar profile:", profileError.message);
    }

    return json(
      {
        success: true,
        message: "Acesso liberado. E-mail de convite enviado ao cliente.",
        userId: invited.user.id,
      },
      201,
    );
  } catch (err: any) {
    console.error("Erro Webhook PerfectPay:", err);
    return json({ error: err.message ?? "Erro interno" }, 500);
  }
});
