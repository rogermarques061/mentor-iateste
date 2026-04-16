import { useProducts } from "@/contexts/ProductsContext";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

export function Step5Checkout({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { draft, updateDraft } = useProducts();
  const co = draft.checkout;
  const setCo = (patch: Partial<typeof co>) => updateDraft({ checkout: { ...co, ...patch } });

  return (
    <div className="space-y-6 animate-fade-slide-in">
      <div className="glass rounded-2xl p-6 space-y-5">
        <h3 className="font-semibold text-sm">Checkout</h3>

        <div>
          <label className="text-xs text-muted-foreground mb-2 block">Métodos de pagamento aceitos</label>
          <div className="space-y-2">
            {[
              { k: "pix", l: "PIX" },
              { k: "card", l: "Cartão de crédito" },
              { k: "boleto", l: "Boleto bancário" },
            ].map((m) => (
              <div key={m.k} className="flex items-center justify-between glass rounded-xl px-4 py-2.5">
                <span className="text-xs">{m.l}</span>
                <Switch
                  checked={(co.methods as Record<string, boolean>)[m.k]}
                  onCheckedChange={(v) => setCo({ methods: { ...co.methods, [m.k]: v } })}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Máximo de parcelas</span>
            <span className="text-xs font-mono text-primary">{co.maxInstallments}x</span>
          </div>
          <Slider
            value={[co.maxInstallments]}
            min={1}
            max={12}
            step={1}
            onValueChange={([v]) => setCo({ maxInstallments: v })}
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Texto do botão de compra</label>
          <input
            value={co.buttonText}
            onChange={(e) => setCo({ buttonText: e.target.value })}
            className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Mensagem de garantia</label>
          <input
            value={co.guaranteeText}
            onChange={(e) => setCo({ guaranteeText: e.target.value })}
            className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
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
