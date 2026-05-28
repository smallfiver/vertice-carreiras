"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Plus, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

type Job = any;

const empty = {
  title: "",
  company_name: "",
  logo_url: "",
  description: "",
  requirements: "",
  benefits: "",
  salary_range: "",
  application_url: "",
  is_active: true,
};

export function JobsAdminClient({ initialJobs }: { initialJobs: Job[] }) {
  const supabase = createClient();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [form, setForm] = useState<any>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof typeof empty>(k: K, v: any) {
    setForm((f: any) => ({ ...f, [k]: v }));
  }

  function resetForm() {
    setForm(empty);
    setEditingId(null);
  }

  function startEdit(j: Job) {
    setEditingId(j.id);
    setForm({
      title: j.title,
      company_name: j.company_name,
      logo_url: j.logo_url ?? "",
      description: j.description,
      requirements: (j.requirements || []).join("\n"),
      benefits: (j.benefits || []).join("\n"),
      salary_range: j.salary_range,
      application_url: j.application_url,
      is_active: j.is_active,
    });
  }

  async function save() {
    setSaving(true);
    const payload = {
      title: form.title,
      company_name: form.company_name,
      logo_url: form.logo_url || null,
      description: form.description,
      requirements: form.requirements.split("\n").map((s: string) => s.trim()).filter(Boolean),
      benefits: form.benefits.split("\n").map((s: string) => s.trim()).filter(Boolean),
      salary_range: form.salary_range,
      application_url: form.application_url,
      is_active: form.is_active,
    };
    if (editingId) {
      const { data } = await supabase.from("jobs").update(payload).eq("id", editingId).select().single();
      if (data) setJobs((js) => js.map((j) => (j.id === editingId ? data : j)));
    } else {
      const { data } = await supabase.from("jobs").insert(payload).select().single();
      if (data) setJobs((js) => [data, ...js]);
    }
    resetForm();
    setSaving(false);
    router.refresh();
  }

  async function toggle(j: Job) {
    const { data } = await supabase
      .from("jobs")
      .update({ is_active: !j.is_active })
      .eq("id", j.id)
      .select()
      .single();
    if (data) setJobs((js) => js.map((x) => (x.id === j.id ? data : x)));
  }

  async function remove(j: Job) {
    if (!confirm(`Excluir a vaga "${j.title}"?`)) return;
    await supabase.from("jobs").delete().eq("id", j.id);
    setJobs((js) => js.filter((x) => x.id !== j.id));
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <h2 className="font-semibold">{editingId ? "Editar vaga" : "Nova vaga"}</h2>
        </CardHeader>
        <CardBody className="space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <Input placeholder="Título" value={form.title} onChange={(e) => set("title", e.target.value)} />
            <Input placeholder="Empresa" value={form.company_name} onChange={(e) => set("company_name", e.target.value)} />
            <Input placeholder="URL do logo" value={form.logo_url} onChange={(e) => set("logo_url", e.target.value)} />
            <Input placeholder="Faixa salarial (ex: R$ 2.500 - R$ 3.500)" value={form.salary_range} onChange={(e) => set("salary_range", e.target.value)} />
            <Input placeholder="URL de candidatura externa" value={form.application_url} onChange={(e) => set("application_url", e.target.value)} className="md:col-span-2" />
          </div>
          <textarea
            placeholder="Descrição"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-border bg-card-alt px-3 py-2 text-sm"
          />
          <div className="grid md:grid-cols-2 gap-3">
            <textarea
              placeholder="Requisitos (um por linha)"
              value={form.requirements}
              onChange={(e) => set("requirements", e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-border bg-card-alt px-3 py-2 text-sm"
            />
            <textarea
              placeholder="Benefícios (um por linha)"
              value={form.benefits}
              onChange={(e) => set("benefits", e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-border bg-card-alt px-3 py-2 text-sm"
            />
          </div>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_active} onChange={(e) => set("is_active", e.target.checked)} />
            Vaga ativa
          </label>
          <div className="flex gap-2">
            <Button variant="success" onClick={save} disabled={saving}>
              <Plus className="h-4 w-4" /> {saving ? "Salvando..." : editingId ? "Atualizar" : "Criar vaga"}
            </Button>
            {editingId && (
              <Button variant="secondary" onClick={resetForm}>
                Cancelar
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-semibold">Vagas ({jobs.length})</h2>
        </CardHeader>
        <CardBody className="space-y-2">
          {jobs.map((j) => (
            <div key={j.id} className="flex items-center gap-3 rounded-lg border border-border px-3 py-2">
              <div className="flex-1">
                <p className="font-medium">{j.title}</p>
                <p className="text-xs text-fg-muted">
                  {j.company_name} • {j.salary_range} {j.is_active ? "" : "• inativa"}
                </p>
              </div>
              <Button size="sm" variant="secondary" onClick={() => toggle(j)}>
                {j.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button size="sm" variant="secondary" onClick={() => startEdit(j)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="danger" onClick={() => remove(j)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {jobs.length === 0 && <p className="text-sm text-fg-muted">Nenhuma vaga cadastrada.</p>}
        </CardBody>
      </Card>
    </div>
  );
}
