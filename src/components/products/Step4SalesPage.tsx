import { useProducts } from "@/contexts/ProductsContext";
import { genId, formatBRL } from "@/lib/products-utils";
import { ChevronRight, ChevronLeft, Plus, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export function Step4SalesPage({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { draft, updateDraft } = useProducts();
  const sp = draft.salesPage;

  const setSp = (patch: Partial<typeof sp>) => updateDraft({ salesPage: { ...sp, ...patch } });

  return (
    <div className="space-y-6 animate-fade-slide-in">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-7 glass rounded-2xl p-6 space-y-5">
          <h3 className="font-semibold text-sm">Página de Vendas</h3>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Headline principal</label>
            <input
              value={sp.headline}
              onChange={(e) => setSp({ headline: e.target.value })}
              placeholder="Transforme sua mentoria em uma máquina de vendas"
              className="w-full glass rounded-xl px-4 py-3 text-base bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 font-display"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Subheadline</label>
            <input
              value={sp.subheadline}
              onChange={(e) => setSp({ subheadline: e.target.value })}
              placeholder="Descrição complementar"
              className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Texto do botão CTA</label>
            <input
              value={sp.ctaText}
              onChange={(e) => setSp({ ctaText: e.target.value })}
              className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>

          <div className="glass rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Mostrar seção de benefícios</span>
              <Switch checked={sp.showBenefits} onCheckedChange={(v) => setSp({ showBenefits: v })} />
            </div>
            {sp.showBenefits && (
              <div className="space-y-2">
                {sp.benefits.map((b, i) => (
                  <div key={b.id} className="flex gap-2">
                    <input
                      value={b.text}
                      onChange={(e) => setSp({ benefits: sp.benefits.map((x) => (x.id === b.id ? { ...x, text: e.target.value } : x)) })}
                      placeholder={`Benefício ${i + 1}`}
                      className="flex-1 glass rounded-lg px-3 py-2 text-xs bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50"
                    />
                    <button
                      onClick={() => setSp({ benefits: sp.benefits.filter((x) => x.id !== b.id) })}
                      className="text-muted-foreground hover:text-destructive p-2"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setSp({ benefits: [...sp.benefits, { id: genId("ben"), text: "" }] })}
                  className="text-xs text-primary flex items-center gap-1 hover:underline"
                >
                  <Plus className="h-3 w-3" /> Adicionar benefício
                </button>
              </div>
            )}
          </div>

          <div className="glass rounded-xl p-4 flex items-center justify-between">
            <span className="text-xs font-medium">Mostrar seção de garantia</span>
            <Switch checked={sp.showGuarantee} onCheckedChange={(v) => setSp({ showGuarantee: v })} />
          </div>

          <div className="glass rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Mostrar FAQ</span>
              <Switch checked={sp.showFaq} onCheckedChange={(v) => setSp({ showFaq: v })} />
            </div>
            {sp.showFaq && (
              <div className="space-y-2">
                {sp.faq.map((f) => (
                  <div key={f.id} className="space-y-1.5 glass rounded-lg p-2">
                    <div className="flex gap-2">
                      <input
                        value={f.q}
                        onChange={(e) => setSp({ faq: sp.faq.map((x) => (x.id === f.id ? { ...x, q: e.target.value } : x)) })}
                        placeholder="Pergunta"
                        className="flex-1 bg-transparent text-xs focus:outline-none focus:ring-1 focus:ring-primary/40 rounded px-2 py-1.5 font-medium"
                      />
                      <button onClick={() => setSp({ faq: sp.faq.filter((x) => x.id !== f.id) })} className="text-muted-foreground hover:text-destructive p-1">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <textarea
                      value={f.a}
                      onChange={(e) => setSp({ faq: sp.faq.map((x) => (x.id === f.id ? { ...x, a: e.target.value } : x)) })}
                      placeholder="Resposta"
                      className="w-full bg-transparent text-xs text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 rounded px-2 py-1.5 resize-none h-14"
                    />
                  </div>
                ))}
                <button
                  onClick={() => setSp({ faq: [...sp.faq, { id: genId("faq"), q: "", a: "" }] })}
                  className="text-xs text-primary flex items-center gap-1 hover:underline"
                >
                  <Plus className="h-3 w-3" /> Adicionar pergunta
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Preview */}
        <div className="col-span-5 glass rounded-2xl p-6 sticky top-4 self-start max-h-[80vh] overflow-auto">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3">Preview</p>
          {draft.thumbnail && <img src={draft.thumbnail} alt="" className="w-full rounded-xl mb-4" />}
          <h2 className="font-display text-xl mb-2">{sp.headline || draft.name || "Sua headline aqui"}</h2>
          <p className="text-xs text-muted-foreground mb-4">{sp.subheadline || draft.tagline || "Subheadline complementar"}</p>
          <button className="bg-primary text-primary-foreground rounded-xl px-4 py-2.5 text-xs glow-primary">
            {sp.ctaText} · {formatBRL(draft.price)}
          </button>
          {sp.showBenefits && sp.benefits.length > 0 && (
            <ul className="mt-4 space-y-1.5 text-xs">
              {sp.benefits.map((b) => <li key={b.id}>✓ {b.text || "—"}</li>)}
            </ul>
          )}
          {sp.showGuarantee && draft.guarantee.enabled && (
            <p className="mt-4 text-xs text-success">🛡 Garantia de {draft.guarantee.days} dias</p>
          )}
          {sp.showFaq && sp.faq.length > 0 && (
            <div className="mt-4 space-y-2">
              {sp.faq.map((f) => (
                <details key={f.id} className="text-xs glass rounded-lg p-2">
                  <summary className="cursor-pointer font-medium">{f.q || "Pergunta"}</summary>
                  <p className="mt-1.5 text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
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
