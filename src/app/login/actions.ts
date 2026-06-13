"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

export type LoginState = {
  error?: string;
};

function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    "https://vertice-carreiras.vercel.app"
  );
}

async function findUserByEmail(admin: ReturnType<typeof createAdminClient>, email: string) {
  // Pagina até encontrar o usuário (não há getUserByEmail no admin SDK).
  const perPage = 200;
  for (let page = 1; page <= 25; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw new Error(error.message);
    const match = data.users.find(
      (u) => (u.email ?? "").toLowerCase() === email.toLowerCase()
    );
    if (match) return match;
    if (data.users.length < perPage) return null;
  }
  return null;
}

export async function loginWithBuyerEmail(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const rawEmail = (formData.get("email") ?? "").toString().trim().toLowerCase();
  if (!rawEmail || !rawEmail.includes("@")) {
    return { error: "Informe um e-mail válido." };
  }

  let actionLink: string | null = null;
  try {
    const admin = createAdminClient();

    const existing = await findUserByEmail(admin, rawEmail);
    if (!existing) {
      return {
        error:
          "Este e-mail não consta em nossa base. Use exatamente o e-mail da compra na PerfectPay.",
      };
    }

    const { data, error } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email: rawEmail,
      options: {
        redirectTo: `${getSiteUrl()}/dashboard`,
      },
    });

    if (error || !data?.properties?.action_link) {
      return {
        error:
          error?.message ??
          "Não foi possível gerar o acesso agora. Tente novamente em instantes.",
      };
    }

    actionLink = data.properties.action_link;
  } catch (e: any) {
    return {
      error: e?.message ?? "Erro inesperado ao gerar acesso.",
    };
  }

  // redirect() lança NEXT_REDIRECT — precisa estar fora do try/catch.
  redirect(actionLink!);
}
