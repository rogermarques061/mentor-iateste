import { useProducts } from "@/contexts/ProductsContext";
import { calcInstallments, formatBRL, parseBRLInput } from "@/lib/products-utils";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

export function Step2Pricing({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { draft, updateDraft } = useProducts();
  const installmentsRows = calcInstallments(draft.price || 0, draft.installments.max);

  return (
    <div className="space-y-6 animate-fade-slide-in">
      <div className="glass rounded-2xl p-6 space-y-5">
        <h3 className="font-semibold text-sm">Precificação</h3>

        <div>
          <label className="text-xs text-muted-foreground mb-2 block">Tipo de acesso</label>
          <div className="flex gap-2">
            {[
              { v: "single", l: "Pagamento único" },
              { v: "recurring", l: "Recorrente" },
            ].map((t) => (
              <button
                key={t.v}
                onClick={() => updateDraft({ paymentType: t.v as "single" | "recurring" })}
                className={`px-3 py-1.5 rounded-xl text-xs glass transition-all ${
                  draft.paymentType === t.v ? "bg-primary/15 text-primary ring-1 ring-primary/40" : "hover:bg-[rgba(255,255,255,0.06)]"
                }`}
              >
                {t.l}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Preço</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-mono">R$</span>
              <input
                type="text"
                value={draft.price ? draft.price.toFixed(2).replace(".", ",") : ""}
                onChange={(e) => updateDraft({ price: parseBRLInput(e.target.value) })}
                placeholder="997,00"
                className="w-full glass rounded-xl pl-10 pr-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Preço original (riscado, opcional)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-mono">R$</span>
              <input
                type="text"
                value={draft.originalPrice ? draft.originalPrice.toFixed(2).replace(".", ",") : ""}
                onChange={(e) => {
                  const v = parseBRLInput(e.target.value);
                  updateDraft({ originalPrice: v > 0 ? v : null });
                }}
                placeholder="1497,00"
                className="w-full glass rounded-xl pl-10 pr-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono"
              />
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Permitir parcelamento</span>
            <Switch
              checked={draft.installments.enabled}
              onCheckedChange={(v) => updateDraft({ installments: { ...draft.installments, enabled: v } })}
            />
          </div>
          {draft.installments.enabled && (
            <>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Máximo de parcelas</span>
                  <span className="text-xs font-mono text-primary">{draft.installments.max}x</span>
                </div>
                <Slider
                  value={[draft.installments.max]}
                  min={1}
                  max={12}
                  step={1}
                  onValueChange={([v]) => updateDraft({ installments: { ...draft.installments, max: v } })}
                />
              </div>
              <div className="text-xs text-muted-foreground space-y-1 font-mono max-h-40 overflow-auto pt-2 border-t border-[rgba(255,255,255,0.06)]">
                {installmentsRows.map((r) => (
                  <p key={r.n}>{r.label}</p>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="glass rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium">Período de garantia</span>
            <Switch
              checked={draft.guarantee.enabled}
              onCheckedChange={(v) => updateDraft({ guarantee: { ...draft.guarantee, enabled: v } })}
            />
          </div>
          {draft.guarantee.enabled && (
            <div className="flex gap-2">
              {[7, 15, 30].map((d) => (
                <button
                  key={d}
                  onClick={() => updateDraft({ guarantee: { ...draft.guarantee, days: d } })}
                  className={`px-3 py-1.5 rounded-xl text-xs glass transition-all ${
                    draft.guarantee.days === d ? "bg-primary/15 text-primary ring-1 ring-primary/40" : "hover:bg-[rgba(255,255,255,0.06)]"
                  }`}
                >
                  {d} dias
                </button>
              ))}
            </div>
          )}
        </div>

        {draft.price > 0 && (
          <div className="text-xs text-muted-foreground">
            Preço atual: <span className="font-mono text-foreground">{formatBRL(draft.price)}</span>
            {draft.originalPrice ? <> · de <span className="line-through font-mono">{formatBRL(draft.originalPrice)}</span></> : null}
          </div>
        )}
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
