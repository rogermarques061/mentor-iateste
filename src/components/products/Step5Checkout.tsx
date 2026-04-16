import { ChevronRight, ChevronLeft } from "lucide-react";
import MentorCheckout from "@/pages/MentorCheckout";

export function Step5Checkout({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <div className="space-y-6 animate-fade-slide-in">
      {/*
        Reaproveita o editor de checkout global em modo "embedded":
        - Sem painel de preview à direita (largura total)
        - Conectado ao produto em edição via ProductsContext
          (todos os campos hidratam a partir do draft atual e
          mudanças locais são sincronizadas de volta no draft)
      */}
      <div className="glass rounded-2xl overflow-hidden">
        <MentorCheckout embedded />
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="glass rounded-xl px-5 py-2.5 text-sm flex items-center gap-2 hover:bg-[rgba(255,255,255,0.06)] transition-all"
        >
          <ChevronLeft className="h-4 w-4" /> Voltar
        </button>
        <button
          onClick={onNext}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-5 py-2.5 text-sm flex items-center gap-2 glow-primary transition-all"
        >
          Próximo <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
