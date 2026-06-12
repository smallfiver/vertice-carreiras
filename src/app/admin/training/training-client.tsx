"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

type Module = any;

export function TrainingAdminClient({ initialModules }: { initialModules: Module[] }) {
  const supabase = createClient();
  const router = useRouter();
  const [modules, setModules] = useState<Module[]>(initialModules);

  const [modForm, setModForm] = useState({ title: "", description: "", sequence_order: 1 });
  const [editingModId, setEditingModId] = useState<string | null>(null);

  const [lessonForm, setLessonForm] = useState({
    module_id: "",
    title: "",
    video_url: "",
    content: "",
    sequence_order: 1,
    unlock_day_offset: 0,
  });
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);

  async function refresh() {
    const { data } = await supabase.from("modules").select("*, lessons(*)").order("sequence_order");
    setModules(data ?? []);
    router.refresh();
  }

  async function saveModule() {
    const payload = {
      title: modForm.title,
      description: modForm.description || null,
      sequence_order: Number(modForm.sequence_order),
    };
    if (editingModId) {
      await supabase.from("modules").update(payload).eq("id", editingModId);
    } else {
      await supabase.from("modules").insert(payload);
    }
    setModForm({ title: "", description: "", sequence_order: 1 });
    setEditingModId(null);
    refresh();
  }

  async function deleteModule(id: string) {
    if (!confirm("Excluir módulo e todas as suas aulas?")) return;
    await supabase.from("modules").delete().eq("id", id);
    refresh();
  }

  async function saveLesson() {
    if (!lessonForm.module_id) {
      alert("Selecione um módulo");
      return;
    }
    const payload = {
      module_id: lessonForm.module_id,
      title: lessonForm.title,
      video_url: lessonForm.video_url,
      content: lessonForm.content || null,
      sequence_order: Number(lessonForm.sequence_order),
      unlock_day_offset: Number(lessonForm.unlock_day_offset) || 0,
    };
    if (editingLessonId) {
      await supabase.from("lessons").update(payload).eq("id", editingLessonId);
    } else {
      await supabase.from("lessons").insert(payload);
    }
    setLessonForm({ module_id: "", title: "", video_url: "", content: "", sequence_order: 1, unlock_day_offset: 0 });
    setEditingLessonId(null);
    refresh();
  }

  async function deleteLesson(id: string) {
    if (!confirm("Excluir aula?")) return;
    await supabase.from("lessons").delete().eq("id", id);
    refresh();
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <h2 className="font-semibold">{editingModId ? "Editar módulo" : "Novo módulo"}</h2>
        </CardHeader>
        <CardBody className="space-y-3">
          <div className="grid md:grid-cols-[1fr_1fr_120px] gap-3">
            <Input placeholder="Título do módulo" value={modForm.title} onChange={(e) => setModForm({ ...modForm, title: e.target.value })} />
            <Input placeholder="Descrição" value={modForm.description} onChange={(e) => setModForm({ ...modForm, description: e.target.value })} />
            <Input type="number" placeholder="Ordem" value={modForm.sequence_order} onChange={(e) => setModForm({ ...modForm, sequence_order: Number(e.target.value) })} />
          </div>
          <div className="flex gap-2">
            <Button variant="success" onClick={saveModule}>
              <Plus className="h-4 w-4" /> {editingModId ? "Atualizar módulo" : "Criar módulo"}
            </Button>
            {editingModId && (
              <Button variant="secondary" onClick={() => { setEditingModId(null); setModForm({ title: "", description: "", sequence_order: 1 }); }}>
                Cancelar
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-semibold">{editingLessonId ? "Editar aula" : "Nova aula"}</h2>
        </CardHeader>
        <CardBody className="space-y-3">
          <select
            value={lessonForm.module_id}
            onChange={(e) => setLessonForm({ ...lessonForm, module_id: e.target.value })}
            className="w-full rounded-lg border border-border bg-card-alt px-3 py-2 text-sm"
          >
            <option value="">— Selecione um módulo —</option>
            {modules.map((m) => (
              <option key={m.id} value={m.id}>
                Módulo {m.sequence_order} — {m.title}
              </option>
            ))}
          </select>
          <div className="grid md:grid-cols-[1fr_120px_140px] gap-3">
            <Input placeholder="Título da aula" value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} />
            <Input type="number" placeholder="Ordem" value={lessonForm.sequence_order} onChange={(e) => setLessonForm({ ...lessonForm, sequence_order: Number(e.target.value) })} />
            <Input type="number" min={0} placeholder="Libera no dia (D+?)" value={lessonForm.unlock_day_offset} onChange={(e) => setLessonForm({ ...lessonForm, unlock_day_offset: Number(e.target.value) })} />
          </div>
          <Input placeholder="URL do vídeo (YouTube, Vimeo, PandaVideo)" value={lessonForm.video_url} onChange={(e) => setLessonForm({ ...lessonForm, video_url: e.target.value })} />
          <textarea
            placeholder="Conteúdo / descrição da aula"
            value={lessonForm.content}
            onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
            rows={3}
            className="w-full rounded-lg border border-border bg-card-alt px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <Button variant="success" onClick={saveLesson}>
              <Plus className="h-4 w-4" /> {editingLessonId ? "Atualizar aula" : "Criar aula"}
            </Button>
            {editingLessonId && (
              <Button variant="secondary" onClick={() => { setEditingLessonId(null); setLessonForm({ module_id: "", title: "", video_url: "", content: "", sequence_order: 1, unlock_day_offset: 0 }); }}>
                Cancelar
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      <div className="space-y-3">
        {modules.map((m) => (
          <Card key={m.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">
                    Módulo {m.sequence_order} — {m.title}
                  </h3>
                  {m.description && <p className="text-xs text-fg-muted">{m.description}</p>}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => { setEditingModId(m.id); setModForm({ title: m.title, description: m.description ?? "", sequence_order: m.sequence_order }); }}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => deleteModule(m.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardBody className="space-y-2">
              {[...(m.lessons || [])]
                .sort((a: any, b: any) => a.sequence_order - b.sequence_order)
                .map((l: any) => (
                  <div key={l.id} className="flex items-center gap-3 rounded-lg border border-border px-3 py-2 text-sm">
                    <span className="flex-1">
                      {l.sequence_order}. {l.title}
                    </span>
                    <span className="text-xs text-fg-muted">D+{l.unlock_day_offset ?? 0}</span>
                    <Button size="sm" variant="secondary" onClick={() => { setEditingLessonId(l.id); setLessonForm({ module_id: l.module_id, title: l.title, video_url: l.video_url, content: l.content ?? "", sequence_order: l.sequence_order, unlock_day_offset: l.unlock_day_offset ?? 0 }); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => deleteLesson(l.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              {(!m.lessons || m.lessons.length === 0) && (
                <p className="text-sm text-fg-muted">Nenhuma aula neste módulo.</p>
              )}
            </CardBody>
          </Card>
        ))}
        {modules.length === 0 && <p className="text-sm text-fg-muted">Nenhum módulo cadastrado.</p>}
      </div>
    </div>
  );
}
