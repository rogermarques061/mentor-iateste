import { Shield, Check, Star, Lock, CreditCard, ChevronDown, Play, Award, ChevronRight, MessageSquare } from "lucide-react";
import { formatCurrency } from "@/contexts/PlatformContext";
import type { CheckoutProduct, Course } from "@/contexts/PlatformContext";

interface CheckoutPreviewProps {
  product: Partial<CheckoutProduct> & { price: number; originalPrice: number; guarantee: number; accentColor: string; name: string };
  courses: Course[];
  previewMode: "desktop" | "mobile";
}

const CheckoutPreview = ({ product, courses, previewMode }: CheckoutPreviewProps) => {
  const accent = product.accentColor || "#8B5CF6";
  const linkedCourse = courses.find(c => c.id === product.linkedCourseId);
  const sections = product.sections || {};
  const benefits = product.benefits || [];
  const testimonials = product.testimonials || [];
  const faq = product.faq || [];

  const isMobile = previewMode === "mobile";

  return (
    <div
      className={`bg-[#050508] text-[#F1F0F5] overflow-y-auto ${isMobile ? "max-w-[375px] mx-auto rounded-3xl border border-[rgba(255,255,255,0.1)] shadow-2xl" : ""}`}
      style={{ fontFamily: "'DM Sans', sans-serif", maxHeight: "100%" }}
    >
      {/* Hero */}
      <section className="pt-10 pb-12 px-5 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] mb-5" style={{ background: `${accent}15`, color: accent }}>
          <Shield className="h-3 w-3" /> Garantia de {product.guarantee} dias
        </div>
        <h1 className="font-display text-xl md:text-2xl font-bold mb-3 leading-tight">
          {product.headline || "Seu título aparecerá aqui"}
        </h1>
        <p className="text-[#9B9AA8] text-xs mb-6">{product.subheadline || "Sua subheadline aparecerá aqui"}</p>
        <div className="flex items-center justify-center gap-3 mb-5">
          {product.originalPrice > product.price && (
            <span className="font-mono text-xs text-[#9B9AA8] line-through">{formatCurrency(product.originalPrice)}</span>
          )}
          <span className="font-mono text-2xl font-bold text-[#F59E0B]">{formatCurrency(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[rgba(52,211,153,0.15)] text-[#34D399]">
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </span>
          )}
        </div>
        <button className="inline-flex items-center gap-2 text-white rounded-xl px-6 py-3 text-sm font-semibold transition-all" style={{ background: accent, boxShadow: `0 0 20px ${accent}40` }}>
          {product.ctaText || "Quero começar agora"} <ChevronDown className="h-3.5 w-3.5" />
        </button>
        <div className="flex items-center justify-center gap-4 mt-4 text-[9px] text-[#5C5B6B]">
          <span className="flex items-center gap-1"><Lock className="h-2.5 w-2.5" /> SSL 256-bit</span>
          <span className="flex items-center gap-1"><Check className="h-2.5 w-2.5" /> Pagamento seguro</span>
          <span className="flex items-center gap-1"><Shield className="h-2.5 w-2.5" /> Garantia {product.guarantee}d</span>
        </div>
      </section>

      {/* Benefits */}
      {sections.beneficios && benefits.length > 0 && (
        <section className="py-8 px-5">
          <h2 className="font-display text-base text-center mb-5">O que você vai receber</h2>
          <div className={`grid gap-2 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
            {benefits.map((b, i) => (
              <div key={i} className="rounded-xl p-3 flex items-center gap-2 text-xs" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{ background: `${accent}20` }}>
                  <Check className="h-3 w-3" style={{ color: accent }} />
                </div>
                <span>{b}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Course content */}
      {sections.conteudo && linkedCourse && (
        <section className="py-8 px-5">
          <h2 className="font-display text-base text-center mb-5">Conteúdo do programa</h2>
          <div className="space-y-1.5">
            {linkedCourse.modules.map((m, i) => (
              <div key={i} className="rounded-xl p-3 flex items-center justify-between text-xs" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-2">
                  <Play className="h-3 w-3" style={{ color: accent }} strokeWidth={1.5} />
                  <span>{m.title}</span>
                </div>
                <span className="text-[10px] text-[#9B9AA8] font-mono">{m.lessons.length} aulas</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Testimonials */}
      {sections.depoimentos && testimonials.length > 0 && (
        <section className="py-8 px-5">
          <h2 className="font-display text-base text-center mb-5">O que dizem nossos alunos</h2>
          <div className={`grid gap-3 ${isMobile ? "grid-cols-1" : "grid-cols-3"}`}>
            {testimonials.map((t, i) => (
              <div key={i} className="rounded-xl p-4 space-y-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-3 w-3 fill-[#F59E0B] text-[#F59E0B]" />
                  ))}
                </div>
                <p className="text-[10px] text-[#9B9AA8]">"{t.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-medium" style={{ background: `${accent}20`, color: accent }}>
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="text-[10px] font-medium">{t.name}</div>
                    <div className="text-[8px] text-[#5C5B6B]">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Guarantee */}
      {sections.garantia && (
        <section className="py-8 px-5">
          <div className="rounded-xl p-6 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(52,211,153,0.15)" }}>
            <Shield className="h-8 w-8 text-[#34D399] mx-auto mb-3" strokeWidth={1.5} />
            <h3 className="font-display text-sm mb-1">Garantia de {product.guarantee} dias</h3>
            <p className="text-[10px] text-[#9B9AA8]">Se não ficar satisfeito, devolvemos 100% do seu dinheiro.</p>
          </div>
        </section>
      )}

      {/* FAQ */}
      {sections.faq && faq.length > 0 && (
        <section className="py-8 px-5">
          <h2 className="font-display text-base text-center mb-5">Perguntas frequentes</h2>
          <div className="space-y-1.5">
            {faq.map((f, i) => (
              <div key={i} className="rounded-xl p-3 text-xs" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center justify-between">
                  <span>{f.q}</span>
                  <ChevronRight className="h-3 w-3 text-[#9B9AA8]" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Checkout form preview */}
      <section className="py-8 px-5">
        <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-5"}`}>
          <div className={isMobile ? "" : "col-span-2"}>
            <div className="rounded-xl p-4 space-y-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <h3 className="text-xs font-semibold">Resumo do pedido</h3>
              <div className="flex gap-2">
                <div className="w-10 h-8 rounded-lg shrink-0 flex items-center justify-center" style={{ background: `${accent}15` }}>
                  <Award className="h-4 w-4" style={{ color: `${accent}60` }} />
                </div>
                <div>
                  <div className="text-[10px] font-medium">{product.name}</div>
                  <div className="text-[8px] text-[#9B9AA8]">{product.description}</div>
                </div>
              </div>
              <div className="border-t border-[rgba(255,255,255,0.05)] pt-2 flex justify-between">
                <span className="text-[10px] font-semibold">Total</span>
                <span className="font-mono text-sm font-bold text-[#F59E0B]">{formatCurrency(product.price)}</span>
              </div>
            </div>
          </div>
          <div className={isMobile ? "" : "col-span-3"}>
            <div className="rounded-xl p-4 space-y-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <h3 className="text-xs font-semibold">Dados de pagamento</h3>
              <div className="space-y-2">
                {["Nome completo", "E-mail", "CPF", "Telefone"].map(label => (
                  <div key={label} className="rounded-lg px-3 py-2 text-[10px] text-[#5C5B6B]" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    {label}
                  </div>
                ))}
              </div>
              <div className="flex gap-1 p-1 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                {["PIX", "Cartão", "Boleto"].map((m, i) => (
                  <div key={m} className={`flex-1 text-center py-2 rounded-md text-[10px] ${i === 0 ? "font-medium" : "text-[#5C5B6B]"}`}
                    style={i === 0 ? { background: `${accent}20`, color: accent } : undefined}>
                    {m}
                  </div>
                ))}
              </div>
              <button className="w-full rounded-lg py-2.5 text-xs font-semibold text-white" style={{ background: accent, boxShadow: `0 0 16px ${accent}30` }}>
                {product.ctaText || "Quero começar agora"} — {formatCurrency(product.price)}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-10 px-5 text-center">
        <h2 className="font-display text-base mb-3">Pronto para transformar seus resultados?</h2>
        <div className="flex items-center justify-center gap-2 mb-4">
          {product.originalPrice > product.price && <span className="font-mono text-xs text-[#9B9AA8] line-through">{formatCurrency(product.originalPrice)}</span>}
          <span className="font-mono text-xl font-bold text-[#F59E0B]">{formatCurrency(product.price)}</span>
        </div>
        <button className="inline-flex items-center gap-2 text-white rounded-xl px-6 py-3 text-sm font-semibold" style={{ background: accent, boxShadow: `0 0 20px ${accent}40` }}>
          {product.ctaText || "Quero começar agora"} <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </section>
    </div>
  );
};

export default CheckoutPreview;
