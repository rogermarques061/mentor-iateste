import { useProducts } from "@/contexts/ProductsContext";
import { ChevronLeft, Check, Circle, Rocket } from "lucide-react";
import { toast } from "sonner";
import { slugify, formatBRL } from "@/lib/products-utils";

export function Step7Publish({ onBack, onPublished }: { onBack: () => void; onPublished: () => void }) {
  const { draft, publishDraft } = useProducts();
  const totalLessons = draft.course.modules.reduce((s, m) => s + m.lessons.length, 0);

  const checks = [
    { ok: !!draft.name.trim(), label: "Nome preenchido", required: true },
    { ok: draft.price > 0, label: "Preço configurado", required: true },
    { ok: draft.course.modules.length > 0, label: "Ao menos 1 módulo criado", required: true },
    { ok: totalLessons > 0, label: "Ao menos 1 aula criada", required: true },
    { ok: !!draft.thumbnail, label: "Capa do produto (recomendado)", required: false },
    { ok: !!draft.salesPage.headline, label: "Página de vendas configurada", required: false },
  ];
  const requiredOk = checks.filter((c) => c.required).every((c) => c.ok);

  const handlePublish = () => {
    const p = publishDraft();
    toast.success(`Produto publicado: ${p.name}`);
    onPublished();
  };

  return (
    <div className="space-y-6 animate-fade-slide-in">
      <div className="glass rounded-2xl p-6 space-y-5">
        <h3 className="font-semibold text-sm">Revisar e publicar</h3>

        <div className="space-y-2">
          {checks.map((c, i) => (
            <div key={i} className="flex items-center gap-3 text-xs">
              {c.ok ? (
                <Check className="h-4 w-4 text-success shrink-0" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground/40 shrink-0" />
              )}
              <span className={c.ok ? "text-foreground" : "text-muted-foreground"}>
                {c.label} {c.required && !c.ok && <span className="text-destructive ml-1">*</span>}
              </span>
            </div>
          ))}
        </div>

        <div className="glass rounded-xl p-4 space-y-2 text-xs">
          <p className="text-muted-foreground">Resumo</p>
          <p><span className="text-muted-foreground">Nome:</span> <span className="font-display">{draft.name || "—"}</span></p>
          <p><span className="text-muted-foreground">Preço:</span> <span className="font-mono">{formatBRL(draft.price)}</span></p>
          <p><span className="text-muted-foreground">Módulos:</span> {draft.course.modules.length} · <span className="text-muted-foreground">Aulas:</span> {totalLessons}</p>
          <p>
            <span className="text-muted-foreground">URL gerada:</span>{" "}
            <span className="font-mono text-primary">/checkout/{slugify(draft.name) || "—"}</span>
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="glass rounded-xl px-5 py-2.5 text-sm flex items-center gap-2 hover:bg-[rgba(255,255,255,0.06)] transition-all">
          <ChevronLeft className="h-4 w-4" /> Voltar
        </button>
        <button
          onClick={handlePublish}
          disabled={!requiredOk}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-5 py-2.5 text-sm flex items-center gap-2 glow-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Rocket className="h-4 w-4" /> Publicar
        </button>
      </div>
    </div>
  );
}
