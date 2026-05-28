import { NextResponse } from "next/server";

// Endpoint aposentado: o webhook da PerfectPay agora aponta para a
// Supabase Edge Function `perfectpay-webhook`.
// Mantido apenas para retornar 410 caso algum postback antigo ainda chegue aqui.
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Endpoint descontinuado. Configure o webhook da PerfectPay para a Edge Function do Supabase.",
    },
    { status: 410 }
  );
}
