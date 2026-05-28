import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, sale_status_enum, code, customer } = body;

    if (token !== process.env.PERFECTPAY_WEBHOOK_TOKEN) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const isApproved = sale_status_enum === 2 || sale_status_enum === 10;
    if (!isApproved) {
      return NextResponse.json(
        { message: "Evento ignorado (venda não aprovada)" },
        { status: 200 }
      );
    }

    const email = customer?.email?.toLowerCase().trim();
    const fullName = customer?.full_name;

    if (!email) {
      return NextResponse.json(
        { error: "Email do cliente ausente" },
        { status: 400 }
      );
    }

    // Verificar se o usuário já existe
    const { data: list } = await supabaseAdmin.auth.admin.listUsers();
    const existing = list?.users.find(
      (u) => u.email?.toLowerCase() === email
    );

    if (existing) {
      await supabaseAdmin
        .from("profiles")
        .update({ perfectpay_sale_code: code })
        .eq("id", existing.id);
      return NextResponse.json(
        { message: "Usuário já existente, perfil atualizado" },
        { status: 200 }
      );
    }

    const tempPassword =
      (customer?.identification_number as string | undefined)?.replace(
        /\D/g,
        ""
      ) || "VagaStart2026!";

    const { data: newUser, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: { full_name: fullName },
      });

    if (createError || !newUser.user) {
      throw new Error(`Erro ao criar usuário auth: ${createError?.message}`);
    }

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: newUser.user.id,
        full_name: fullName,
        email,
        perfectpay_sale_code: code,
        is_admin: false,
      });

    if (profileError) {
      throw new Error(`Erro ao criar perfil: ${profileError.message}`);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Usuário criado e acesso liberado com sucesso",
        userId: newUser.user.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erro Webhook PerfectPay:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno" },
      { status: 500 }
    );
  }
}
