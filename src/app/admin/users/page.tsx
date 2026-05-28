import { createClient } from "@/lib/supabase/server";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default async function AdminUsersPage() {
  const supabase = createClient();

  const [{ data: profiles }, { count: totalLessons }, { data: progressRows }] = await Promise.all([
    supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    supabase.from("lessons").select("id", { count: "exact", head: true }),
    supabase.from("user_lesson_progress").select("user_id, completed").eq("completed", true),
  ]);

  const total = totalLessons ?? 0;
  const byUser = new Map<string, number>();
  (progressRows || []).forEach((r) => {
    byUser.set(r.user_id, (byUser.get(r.user_id) || 0) + 1);
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <h2 className="font-semibold">Usuários ({profiles?.length ?? 0})</h2>
        </CardHeader>
        <CardBody className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-fg-muted text-xs uppercase">
              <tr>
                <th className="py-2 pr-3">Nome</th>
                <th className="py-2 pr-3">E-mail</th>
                <th className="py-2 pr-3">Cadastro</th>
                <th className="py-2 pr-3">PerfectPay</th>
                <th className="py-2 pr-3">Admin</th>
                <th className="py-2 pr-3 min-w-[200px]">Progresso</th>
              </tr>
            </thead>
            <tbody>
              {(profiles || []).map((p: any) => {
                const done = byUser.get(p.id) || 0;
                const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                return (
                  <tr key={p.id} className="border-t border-border">
                    <td className="py-2 pr-3">{p.full_name || "—"}</td>
                    <td className="py-2 pr-3">{p.email}</td>
                    <td className="py-2 pr-3">
                      {p.created_at ? new Date(p.created_at).toLocaleDateString("pt-BR") : "—"}
                    </td>
                    <td className="py-2 pr-3 font-mono text-xs">{p.perfectpay_code || "—"}</td>
                    <td className="py-2 pr-3">{p.is_admin ? "Sim" : "Não"}</td>
                    <td className="py-2 pr-3">
                      <div className="flex items-center gap-2">
                        <Progress value={pct} className="flex-1" />
                        <span className="text-xs text-fg-muted w-20">
                          {done}/{total} ({pct}%)
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {(!profiles || profiles.length === 0) && (
                <tr>
                  <td colSpan={6} className="py-4 text-fg-muted text-center">
                    Nenhum usuário cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}
