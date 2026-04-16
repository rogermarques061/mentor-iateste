import { useProducts } from "@/contexts/ProductsContext";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export function Step6PostPurchase({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { draft, updateDraft } = useProducts();
  const pp = draft.postPurchase;
  const setPp = (patch: Partial<typeof pp>) => updateDraft({ postPurchase: { ...pp, ...patch } });

  return (
    <div className="space-y-6 animate-fade-slide-in">
      <div className="glass rounded-2xl p-6 space-y-5">
        <h3 className="font-semibold text-sm">Pós-compra</h3>

        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Mensagem da página de sucesso</label>
          <textarea
            value={pp.successMessage}
            onChange={(e) => setPp({ successMessage: e.target.value })}
            className="w-full glass rounded-xl px-4 py-3 text-sm bg-transparent resize-none focus:outline-none focus:ring-1 focus:ring-primary/50 h-24"
          />
        </div>

        <div className="glass rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Redirecionar para URL externa</span>
            <Switch checked={pp.redirectEnabled} onCheckedChange={(v) => setPp({ redirectEnabled: v })} />
          </div>
          {pp.redirectEnabled && (
            <input
              value={pp.redirectUrl}
              onChange={(e) => setPp({ redirectUrl: e.target.value })}
              placeholder="https://..."
              className="w-full glass rounded-lg px-3 py-2 text-xs bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          )}
        </div>

        <div className="glass rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Enviar e-mail automático</span>
            <Switch checked={pp.emailEnabled} onCheckedChange={(v) => setPp({ emailEnabled: v })} />
          </div>
          {pp.emailEnabled && (
            <textarea
              value={pp.welcomeEmail}
              onChange={(e) => setPp({ welcomeEmail: e.target.value })}
              placeholder="Texto do e-mail de boas-vindas"
              className="w-full glass rounded-lg px-3 py-2 text-xs bg-transparent resize-none focus:outline-none focus:ring-1 focus:ring-primary/50 h-24"
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
