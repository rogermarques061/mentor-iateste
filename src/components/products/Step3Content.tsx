import { useProducts, Module, Lesson, LessonType } from "@/contexts/ProductsContext";
import { genId } from "@/lib/products-utils";
import { ChevronRight, ChevronLeft, Plus, Trash2, GripVertical, Video, FileText, HelpCircle, Radio, Check, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

function getYouTubeEmbed(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{6,})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}
function getVimeoEmbed(url: string): string | null {
  const m = url.match(/vimeo\.com\/(\d+)/);
  return m ? `https://player.vimeo.com/video/${m[1]}` : null;
}

export function Step3Content({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { draft, updateDraft } = useProducts();
  const [activeModuleId, setActiveModuleId] = useState<string | null>(
    draft.course.modules[0]?.id ?? null,
  );
  const [activeLessonId, setActiveLessonId] = useState<string | null>(
    draft.course.modules[0]?.lessons[0]?.id ?? null,
  );
  const [savedFlash, setSavedFlash] = useState(false);
  const draggedModule = useRef<string | null>(null);
  const draggedLesson = useRef<{ moduleId: string; lessonId: string } | null>(null);

  // saved-flash indicator
  useEffect(() => {
    setSavedFlash(true);
    const t = setTimeout(() => setSavedFlash(false), 1200);
    return () => clearTimeout(t);
  }, [draft.course]);

  const setModules = (modules: Module[]) => updateDraft({ course: { modules } });

  const addModule = () => {
    const m: Module = {
      id: genId("mod"),
      title: `Módulo ${draft.course.modules.length + 1}`,
      order: draft.course.modules.length + 1,
      lessons: [],
    };
    setModules([...draft.course.modules, m]);
    setActiveModuleId(m.id);
    setActiveLessonId(null);
  };

  const removeModule = (id: string) => {
    if (!confirm("Excluir este módulo e todas as suas aulas?")) return;
    const next = draft.course.modules.filter((m) => m.id !== id);
    setModules(next);
    if (activeModuleId === id) {
      setActiveModuleId(next[0]?.id ?? null);
      setActiveLessonId(next[0]?.lessons[0]?.id ?? null);
    }
  };

  const renameModule = (id: string, title: string) => {
    setModules(draft.course.modules.map((m) => (m.id === id ? { ...m, title } : m)));
  };

  const addLesson = (moduleId: string) => {
    const lesson: Lesson = {
      id: genId("lesson"),
      title: "Nova aula",
      type: "video",
      videoUrl: "",
      content: "",
      duration: "",
      status: "draft",
      materials: [],
    };
    setModules(
      draft.course.modules.map((m) =>
        m.id === moduleId ? { ...m, lessons: [...m.lessons, lesson] } : m,
      ),
    );
    setActiveModuleId(moduleId);
    setActiveLessonId(lesson.id);
  };

  const removeLesson = (moduleId: string, lessonId: string) => {
    if (!confirm("Excluir esta aula?")) return;
    setModules(
      draft.course.modules.map((m) =>
        m.id === moduleId ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) } : m,
      ),
    );
    if (activeLessonId === lessonId) setActiveLessonId(null);
  };

  const updateLesson = (moduleId: string, lessonId: string, patch: Partial<Lesson>) => {
    setModules(
      draft.course.modules.map((m) =>
        m.id === moduleId
          ? { ...m, lessons: m.lessons.map((l) => (l.id === lessonId ? { ...l, ...patch } : l)) }
          : m,
      ),
    );
  };

  // module drag
  const onModuleDragStart = (id: string) => (draggedModule.current = id);
  const onModuleDrop = (targetId: string) => {
    if (!draggedModule.current || draggedModule.current === targetId) return;
    const list = [...draft.course.modules];
    const fromIdx = list.findIndex((m) => m.id === draggedModule.current);
    const toIdx = list.findIndex((m) => m.id === targetId);
    const [moved] = list.splice(fromIdx, 1);
    list.splice(toIdx, 0, moved);
    setModules(list.map((m, i) => ({ ...m, order: i + 1 })));
    draggedModule.current = null;
  };

  // lesson drag (within same module)
  const onLessonDrop = (moduleId: string, targetLessonId: string) => {
    if (!draggedLesson.current || draggedLesson.current.moduleId !== moduleId) return;
    if (draggedLesson.current.lessonId === targetLessonId) return;
    setModules(
      draft.course.modules.map((m) => {
        if (m.id !== moduleId) return m;
        const list = [...m.lessons];
        const fromIdx = list.findIndex((l) => l.id === draggedLesson.current!.lessonId);
        const toIdx = list.findIndex((l) => l.id === targetLessonId);
        const [moved] = list.splice(fromIdx, 1);
        list.splice(toIdx, 0, moved);
        return { ...m, lessons: list };
      }),
    );
    draggedLesson.current = null;
  };

  const activeModule = draft.course.modules.find((m) => m.id === activeModuleId) ?? null;
  const activeLesson = activeModule?.lessons.find((l) => l.id === activeLessonId) ?? null;

  return (
    <div className="space-y-4 animate-fade-slide-in">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Conteúdo do curso</h3>
        <span className={`text-xs transition-opacity ${savedFlash ? "text-success opacity-100" : "text-muted-foreground opacity-50"}`}>
          {savedFlash ? "✓ Salvo automaticamente" : "Sincronizado"}
        </span>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Modules sidebar */}
        <div className="col-span-4 glass rounded-2xl p-4 space-y-2 max-h-[600px] overflow-auto">
          <button
            onClick={addModule}
            className="w-full glass rounded-xl px-3 py-2.5 text-xs flex items-center justify-center gap-2 hover:bg-primary/15 hover:text-primary transition-all border border-dashed border-[rgba(255,255,255,0.1)]"
          >
            <Plus className="h-3.5 w-3.5" /> Adicionar módulo
          </button>

          {draft.course.modules.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-6">
              Nenhum módulo. Crie o primeiro acima.
            </p>
          )}

          {draft.course.modules.map((m) => (
            <div
              key={m.id}
              draggable
              onDragStart={() => onModuleDragStart(m.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onModuleDrop(m.id)}
              className={`rounded-xl p-2 transition-all ${
                activeModuleId === m.id ? "bg-primary/10 ring-1 ring-primary/30" : "hover:bg-[rgba(255,255,255,0.04)]"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50 cursor-grab shrink-0" />
                <input
                  value={m.title}
                  onChange={(e) => renameModule(m.id, e.target.value)}
                  onClick={() => setActiveModuleId(m.id)}
                  className="flex-1 bg-transparent text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary/40 rounded px-1.5 py-1 min-w-0"
                />
                <button onClick={() => removeModule(m.id)} className="text-muted-foreground hover:text-destructive p-1">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>

              <div className="ml-4 mt-1 space-y-0.5">
                {m.lessons.map((l) => (
                  <div
                    key={l.id}
                    draggable
                    onDragStart={() => (draggedLesson.current = { moduleId: m.id, lessonId: l.id })}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => onLessonDrop(m.id, l.id)}
                    onClick={() => { setActiveModuleId(m.id); setActiveLessonId(l.id); }}
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs cursor-pointer transition-all ${
                      activeLessonId === l.id ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-[rgba(255,255,255,0.04)]"
                    }`}
                  >
                    {l.type === "video" && <Video className="h-3 w-3 shrink-0" />}
                    {l.type === "text" && <FileText className="h-3 w-3 shrink-0" />}
                    {l.type === "quiz" && <HelpCircle className="h-3 w-3 shrink-0" />}
                    {l.type === "live" && <Radio className="h-3 w-3 shrink-0" />}
                    <span className="truncate flex-1">{l.title}</span>
                    {l.status === "published" && <Check className="h-3 w-3 text-success" />}
                  </div>
                ))}
                <button
                  onClick={() => addLesson(m.id)}
                  className="w-full text-[11px] text-muted-foreground hover:text-primary flex items-center gap-1 px-2 py-1 transition-all"
                >
                  <Plus className="h-3 w-3" /> Adicionar aula
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Lesson editor */}
        <div className="col-span-8 glass rounded-2xl p-6 min-h-[400px]">
          {!activeLesson && (
            <div className="h-full flex items-center justify-center text-center text-xs text-muted-foreground">
              {draft.course.modules.length === 0
                ? "Crie um módulo para começar"
                : "Selecione ou crie uma aula"}
            </div>
          )}

          {activeLesson && activeModule && (
            <LessonEditor
              moduleId={activeModule.id}
              lesson={activeLesson}
              onChange={(patch) => updateLesson(activeModule.id, activeLesson.id, patch)}
              onDelete={() => removeLesson(activeModule.id, activeLesson.id)}
            />
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="glass rounded-xl px-5 py-2.5 text-sm flex items-center gap-2 hover:bg-[rgba(255,255,255,0.06)] transition-all">
          <ChevronLeft className="h-4 w-4" /> Voltar
        </button>
        <button onClick={onNext} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-5 py-2.5 text-sm flex items-center gap-2 glow-primary transition-all">
          Próximo <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function LessonEditor({
  moduleId,
  lesson,
  onChange,
  onDelete,
}: {
  moduleId: string;
  lesson: Lesson;
  onChange: (patch: Partial<Lesson>) => void;
  onDelete: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const embedUrl = getYouTubeEmbed(lesson.videoUrl) ?? getVimeoEmbed(lesson.videoUrl);

  const handleMaterial = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      onChange({
        materials: [...lesson.materials, { id: genId("mat"), name: file.name, data: reader.result as string }],
      });
      toast.success("Material adicionado");
    };
    reader.readAsDataURL(file);
  };

  const types: { v: LessonType; l: string; i: typeof Video }[] = [
    { v: "video", l: "Vídeo", i: Video },
    { v: "text", l: "Texto", i: FileText },
    { v: "quiz", l: "Quiz", i: HelpCircle },
    { v: "live", l: "Live", i: Radio },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <input
          value={lesson.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className="bg-transparent text-base font-display font-medium focus:outline-none focus:ring-1 focus:ring-primary/40 rounded px-2 py-1 flex-1"
        />
        <button onClick={onDelete} className="text-muted-foreground hover:text-destructive p-2">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div>
        <label className="text-xs text-muted-foreground mb-2 block">Tipo</label>
        <div className="flex gap-2">
          {types.map((t) => (
            <button
              key={t.v}
              onClick={() => onChange({ type: t.v })}
              className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
                lesson.type === t.v ? "bg-primary/15 text-primary ring-1 ring-primary/40" : "glass hover:bg-[rgba(255,255,255,0.06)]"
              }`}
            >
              <t.i className="h-3 w-3" /> {t.l}
            </button>
          ))}
        </div>
      </div>

      {lesson.type === "video" && (
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">URL do vídeo (YouTube/Vimeo)</label>
            <input
              value={lesson.videoUrl}
              onChange={(e) => onChange({ videoUrl: e.target.value })}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
          {embedUrl && (
            <div className="aspect-video rounded-xl overflow-hidden glass">
              <iframe src={embedUrl} className="w-full h-full" allowFullScreen title="preview" />
            </div>
          )}
        </div>
      )}

      {lesson.type === "text" && (
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Conteúdo (markdown simples)</label>
          <textarea
            value={lesson.content}
            onChange={(e) => onChange({ content: e.target.value })}
            placeholder="**negrito** _itálico_ - lista"
            className="w-full glass rounded-xl px-4 py-3 text-sm bg-transparent resize-none focus:outline-none focus:ring-1 focus:ring-primary/50 h-48 font-mono"
          />
        </div>
      )}

      {lesson.type === "quiz" && (
        <p className="text-xs text-muted-foreground glass rounded-xl p-4">
          Editor de quiz: descreva as perguntas no campo abaixo (uma por linha).
          <textarea
            value={lesson.content}
            onChange={(e) => onChange({ content: e.target.value })}
            className="w-full mt-3 glass rounded-xl px-4 py-3 text-sm bg-transparent resize-none focus:outline-none focus:ring-1 focus:ring-primary/50 h-32"
          />
        </p>
      )}

      {lesson.type === "live" && (
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">URL da live</label>
          <input
            value={lesson.videoUrl}
            onChange={(e) => onChange({ videoUrl: e.target.value })}
            placeholder="Link da transmissão"
            className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Duração</label>
          <input
            value={lesson.duration}
            onChange={(e) => onChange({ duration: e.target.value })}
            placeholder="12:30"
            className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Status</label>
          <div className="flex items-center gap-3 glass rounded-xl px-4 py-2.5">
            <Switch
              checked={lesson.status === "published"}
              onCheckedChange={(v) => onChange({ status: v ? "published" : "draft" })}
            />
            <span className="text-xs">{lesson.status === "published" ? "Publicado" : "Rascunho"}</span>
          </div>
        </div>
      </div>

      <div>
        <label className="text-xs text-muted-foreground mb-1.5 block">Materiais extras</label>
        <button
          onClick={() => fileRef.current?.click()}
          className="glass rounded-xl px-3 py-2 text-xs flex items-center gap-2 hover:bg-[rgba(255,255,255,0.06)] transition-all"
        >
          <Upload className="h-3.5 w-3.5" /> Adicionar material
        </button>
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleMaterial(e.target.files[0])}
        />
        {lesson.materials.length > 0 && (
          <div className="mt-2 space-y-1">
            {lesson.materials.map((m) => (
              <div key={m.id} className="flex items-center justify-between glass rounded-lg px-3 py-2 text-xs">
                <span className="truncate">{m.name}</span>
                <button
                  onClick={() => onChange({ materials: lesson.materials.filter((x) => x.id !== m.id) })}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
