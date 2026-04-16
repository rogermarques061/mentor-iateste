import { useProducts } from "@/contexts/ProductsContext";
import { Check, ChevronLeft, FileText, DollarSign, Package, Eye, ShoppingCart, Share2 } from "lucide-react";
import { Step1Basics } from "./Step1Basics";
import { Step2Pricing } from "./Step2Pricing";
import { Step3Content } from "./Step3Content";
import { Step4SalesPage } from "./Step4SalesPage";
import { Step5Checkout } from "./Step5Checkout";
import { Step6PostPurchase } from "./Step6PostPurchase";
import { Step7Publish } from "./Step7Publish";
import { toast } from "sonner";

const editorSteps = [
  { id: 1, label: "Informações Básicas", icon: FileText },
  { id: 2, label: "Precificação", icon: DollarSign },
  { id: 3, label: "Conteúdo Vinculado", icon: Package },
  { id: 4, label: "Página de Vendas", icon: Eye },
  { id: 5, label: "Checkout", icon: ShoppingCart },
  { id: 6, label: "Pós-compra", icon: Check },
  { id: 7, label: "Publicar", icon: Share2 },
];

export function ProductEditor({ onClose }: { onClose: () => void }) {
  const { draft, currentStep, setCurrentStep, visitedSteps, markVisited, saveDraft } = useProducts();

  const goNext = () => {
    const next = Math.min(currentStep + 1, 7);
    markVisited(next);
    setCurrentStep(next);
  };
  const goBack = () => setCurrentStep(Math.max(currentStep - 1, 1));
  const goTo = (n: number) => {
    if (visitedSteps.includes(n)) setCurrentStep(n);
  };
  const handleSaveDraft = () => {
    if (!draft.name.trim()) {
      toast.error("Defina um nome antes de salvar");
      return;
    }
    const p = saveDraft();
    toast.success(`Rascunho salvo: ${p.name}`);
    onClose();
  };

  return (
    <div className="flex gap-6 max-w-7xl mx-auto">
      <div className="w-60 shrink-0 space-y-1">
        <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1 transition-all">
          <ChevronLeft className="h-3.5 w-3.5" /> Voltar aos produtos
        </button>
        <h3 className="font-display text-lg mb-2">{draft.name || "Novo Produto"}</h3>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3">
          {draft.id ? "Editando" : "Criando"}
        </p>
        <div className="h-1.5 rounded-full bg-muted mb-4 overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${(currentStep / 7) * 100}%` }}
          />
        </div>
        {editorSteps.map((s) => {
          const isVisited = visitedSteps.includes(s.id);
          const isActive = currentStep === s.id;
          const isDone = isVisited && s.id < currentStep;
          return (
            <button
              key={s.id}
              onClick={() => goTo(s.id)}
              disabled={!isVisited}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                isActive
                  ? "bg-primary/15 text-primary"
                  : isVisited
                    ? "text-muted-foreground hover:text-foreground hover:bg-[rgba(255,255,255,0.03)]"
                    : "text-muted-foreground/40 cursor-not-allowed"
              }`}
            >
              <s.icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
              <span className="text-left flex-1">{s.label}</span>
              {isDone && <Check className="h-3.5 w-3.5 text-success" />}
            </button>
          );
        })}

        <button
          onClick={handleSaveDraft}
          className="w-full mt-4 glass rounded-xl px-3 py-2.5 text-xs hover:bg-[rgba(255,255,255,0.06)] transition-all"
        >
          Salvar rascunho
        </button>
      </div>

      <div className="flex-1 min-w-0">
        {currentStep === 1 && <Step1Basics onNext={goNext} />}
        {currentStep === 2 && <Step2Pricing onNext={goNext} onBack={goBack} />}
        {currentStep === 3 && <Step3Content onNext={goNext} onBack={goBack} />}
        {currentStep === 4 && <Step4SalesPage onNext={goNext} onBack={goBack} />}
        {currentStep === 5 && <Step5Checkout onNext={goNext} onBack={goBack} />}
        {currentStep === 6 && <Step6PostPurchase onNext={goNext} onBack={goBack} />}
        {currentStep === 7 && <Step7Publish onBack={goBack} onPublished={onClose} />}
      </div>
    </div>
  );
}
