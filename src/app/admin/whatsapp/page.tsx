import { createClient } from "@/lib/supabase/server";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { CheckCheck, Check, Eye, MessageSquareReply, AlertCircle, MinusCircle } from "lucide-react";

type Msg = {
  id: string;
  user_id: string | null;
  email: string;
  full_name: string | null;
  phone: string | null;
  message: string;
  zapi_message_id: string | null;
  status: string;
  reply_text: string | null;
  sent_at: string;
  delivered_at: string | null;
  read_at: string | null;
  replied_at: string | null;
  error: string | null;
  perfectpay_sale_code: string | null;
};

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; Icon: any }> = {
    sent: { label: "Enviada", color: "bg-card-alt text-fg-muted", Icon: Check },
    delivered: { label: "Entregue", color: "bg-blue-500/15 text-blue-400", Icon: CheckCheck },
    read: { label: "Lida", color: "bg-success/15 text-success", Icon: Eye },
    replied: { label: "Respondida", color: "bg-brand/20 text-brand", Icon: MessageSquareReply },
    failed: { label: "Falhou", color: "bg-warning/15 text-warning", Icon: AlertCircle },
    skipped: { label: "Sem telefone", color: "bg-card-alt text-fg-muted", Icon: MinusCircle },
  };
  const meta = map[status] ?? { label: status, color: "bg-card-alt text-fg-muted", Icon: Check };
  const Icon = meta.Icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${meta.color}`}>
      <Icon className="h-3 w-3" /> {meta.label}
    </span>
  );
}

function fmt(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminWhatsappPage() {
  const supabase = createClient();

  const { data: messages } = await supabase
    .from("whatsapp_messages")
    .select("*")
    .order("sent_at", { ascending: false })
    .limit(500);

  const all = (messages || []) as Msg[];

  const counts = {
    total: all.length,
    sent: all.filter((m) => m.status === "sent").length,
    delivered: all.filter((m) => m.status === "delivered").length,
    read: all.filter((m) => m.status === "read").length,
    replied: all.filter((m) => m.status === "replied").length,
    failed: all.filter((m) => m.status === "failed").length,
    skipped: all.filter((m) => m.status === "skipped").length,
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Disparos WhatsApp</h1>
        <p className="text-sm text-fg-muted mt-1">
          Cada compra aprovada na PerfectPay dispara uma mensagem via Z-API. Aqui você acompanha entrega, leitura e resposta de cada usuário.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
        {[
          { label: "Total", value: counts.total },
          { label: "Enviadas", value: counts.sent },
          { label: "Entregues", value: counts.delivered },
          { label: "Lidas", value: counts.read },
          { label: "Respondidas", value: counts.replied },
          { label: "Falhas", value: counts.failed },
          { label: "Sem telefone", value: counts.skipped },
        ].map((s) => (
          <Card key={s.label}>
            <CardBody>
              <p className="text-[11px] uppercase tracking-wider text-fg-muted">{s.label}</p>
              <p className="text-xl font-semibold mt-1">{s.value}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <h2 className="font-semibold">Mensagens ({all.length})</h2>
        </CardHeader>
        <CardBody className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-fg-muted text-xs uppercase">
              <tr>
                <th className="py-2 pr-3">Destinatário</th>
                <th className="py-2 pr-3">Telefone</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3">Enviada</th>
                <th className="py-2 pr-3">Entregue</th>
                <th className="py-2 pr-3">Lida</th>
                <th className="py-2 pr-3">Respondida</th>
                <th className="py-2 pr-3">Resposta / Erro</th>
              </tr>
            </thead>
            <tbody>
              {all.map((m) => (
                <tr key={m.id} className="border-t border-border align-top">
                  <td className="py-2 pr-3">
                    <div className="font-medium">{m.full_name || "—"}</div>
                    <div className="text-xs text-fg-muted">{m.email}</div>
                    {m.perfectpay_sale_code && (
                      <div className="text-[10px] text-fg-muted font-mono mt-0.5">
                        PP: {m.perfectpay_sale_code}
                      </div>
                    )}
                  </td>
                  <td className="py-2 pr-3 font-mono text-xs">{m.phone || "—"}</td>
                  <td className="py-2 pr-3">
                    <StatusBadge status={m.status} />
                  </td>
                  <td className="py-2 pr-3 text-xs">{fmt(m.sent_at)}</td>
                  <td className="py-2 pr-3 text-xs">{fmt(m.delivered_at)}</td>
                  <td className="py-2 pr-3 text-xs">{fmt(m.read_at)}</td>
                  <td className="py-2 pr-3 text-xs">{fmt(m.replied_at)}</td>
                  <td className="py-2 pr-3 text-xs max-w-[280px]">
                    {m.reply_text && (
                      <div className="bg-brand/10 border border-brand/20 rounded px-2 py-1 text-fg">
                        {m.reply_text}
                      </div>
                    )}
                    {m.error && (
                      <div className="text-warning text-[11px] mt-1">{m.error}</div>
                    )}
                    {!m.reply_text && !m.error && <span className="text-fg-muted">—</span>}
                  </td>
                </tr>
              ))}
              {all.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-6 text-fg-muted text-center">
                    Nenhuma mensagem disparada ainda. Assim que a PerfectPay aprovar uma compra, o registro aparece aqui.
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
