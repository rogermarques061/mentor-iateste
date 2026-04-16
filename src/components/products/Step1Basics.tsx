import { useProducts } from "@/contexts/ProductsContext";
import { Image as ImageIcon, Upload, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export function Step1Basics({ onNext }: { onNext: () => void }) {
  const { draft, updateDraft } = useProducts();
  const [error, setError] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Apenas imagens PNG ou JPG");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      updateDraft({ thumbnail: reader.result as string });
      toast.success("Capa carregada");
    };
    reader.readAsDataURL(file);
  };

  const handleNext = () => {
    if (!draft.name.trim()) {
      setError(true);
      toast.error("Nome obrigatório");
      return;
    }
    setError(false);
    onNext();
  };

  return (
    <div className="space-y-6 animate-fade-slide-in">
      <div className="glass rounded-2xl p-6 space-y-5">
        <h3 className="font-semibold text-sm">Informações Básicas</h3>

        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Nome do produto *</label>
          <input
            type="text"
            value={draft.name}
            onChange={(e) => { updateDraft({ name: e.target.value }); if (error && e.target.value.trim()) setError(false); }}
            placeholder="Ex: Mentoria Identidade Restaurada"
            className={`w-full glass rounded-xl px-4 py-3 text-base bg-transparent focus:outline-none focus:ring-1 font-display ${
              error ? "ring-2 ring-destructive" : "focus:ring-primary/50"
            }`}
          />
          {error && <p className="text-xs text-destructive mt-1.5">Nome obrigatório</p>}
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Subtítulo / tagline</label>
          <input
            type="text"
            value={draft.tagline}
            onChange={(e) => updateDraft({ tagline: e.target.value })}
            placeholder="Frase curta exibida na página de vendas"
            className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Descrição completa</label>
          <textarea
            value={draft.description}
            onChange={(e) => updateDraft({ description: e.target.value })}
            className="w-full glass rounded-xl px-4 py-3 text-sm bg-transparent resize-none focus:outline-none focus:ring-1 focus:ring-primary/50 h-32"
            placeholder="Descreva o produto em detalhes..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Tipo de produto</label>
            <select
              value={draft.type}
              onChange={(e) => updateDraft({ type: e.target.value })}
              className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 appearance-none"
            >
              <option>Curso Online</option>
              <option>Mentoria</option>
              <option>Imersão Presencial</option>
              <option>Assinatura</option>
              <option>Bundle</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Categoria</label>
            <select
              value={draft.category}
              onChange={(e) => updateDraft({ category: e.target.value })}
              className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 appearance-none"
            >
              <option value="">Selecione...</option>
              <option>Vendas</option>
              <option>Marketing</option>
              <option>Liderança</option>
              <option>Desenvolvimento Pessoal</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Capa do produto</label>
          <div
            onClick={() => fileRef.current?.click()}
            className="glass rounded-xl border-dashed border-2 border-[rgba(255,255,255,0.1)] flex flex-col items-center gap-2 cursor-pointer hover:border-primary/30 transition-all overflow-hidden"
          >
            {draft.thumbnail ? (
              <img src={draft.thumbnail} alt="Capa" className="w-full max-h-64 object-cover" />
            ) : (
              <div className="p-8 flex flex-col items-center gap-2">
                <ImageIcon className="h-8 w-8 text-muted-foreground/40" strokeWidth={1.5} />
                <span className="text-xs text-muted-foreground">1200×675px recomendado · PNG ou JPG</span>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </div>
          {draft.thumbnail && (
            <button
              onClick={(e) => { e.stopPropagation(); updateDraft({ thumbnail: null }); }}
              className="text-xs text-muted-foreground hover:text-destructive mt-2"
            >
              Remover capa
            </button>
          )}
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Vídeo de apresentação (opcional)</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={draft.videoUrl}
              onChange={(e) => updateDraft({ videoUrl: e.target.value })}
              placeholder="Cole a URL do YouTube ou Vimeo"
              className="flex-1 glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
            <button
              onClick={() => toast.info("Upload de vídeo: integre seu provedor preferido")}
              className="glass rounded-xl px-4 py-2.5 text-xs flex items-center gap-2 hover:bg-[rgba(255,255,255,0.06)] transition-all"
            >
              <Upload className="h-3.5 w-3.5" /> Upload
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleNext}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-5 py-2.5 text-sm flex items-center gap-2 glow-primary transition-all"
        >
          Próximo <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
