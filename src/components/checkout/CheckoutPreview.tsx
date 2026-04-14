import { Shield, Check, Star, Lock, CreditCard, Smartphone, Award, Clock } from "lucide-react";
import { formatCurrency } from "@/contexts/PlatformContext";
import type { CheckoutProduct, Course } from "@/contexts/PlatformContext";

interface CheckoutPreviewProps {
  product: Partial<CheckoutProduct> & { price: number; originalPrice: number; guarantee: number; accentColor: string; name: string };
  courses: Course[];
  previewMode: "desktop" | "mobile";
}

const CheckoutPreview = ({ product, courses, previewMode }: CheckoutPreviewProps) => {
  const accent = product.accentColor || "#FFD700";
  const testimonials = product.testimonials || [];
  const isMobile = previewMode === "mobile";

  return (
    <div
      className={`bg-[#f5f5f7] text-gray-900 overflow-y-auto ${isMobile ? "max-w-[375px] mx-auto rounded-3xl border border-gray-200 shadow-2xl" : ""}`}
      style={{ fontFamily: "'DM Sans', sans-serif", maxHeight: "100%", fontSize: isMobile ? "13px" : "14px" }}
    >
      {/* Countdown bar */}
      <div className="w-full py-2 px-3 text-center text-[11px] font-semibold text-white" style={{ background: accent }}>
        <div className="flex items-center justify-center gap-1.5">
          <Clock className="h-3 w-3" />
          <span>OFERTA TERMINA EM</span>
          <span className="font-mono bg-white/20 rounded px-1.5 py-0.5 text-[10px]">00:15:42</span>
        </div>
      </div>

      <div className={`p-4 ${isMobile ? "" : "px-6"}`}>
        <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>

          {/* LEFT — Order Summary */}
          <div className={`space-y-3 ${isMobile ? "order-2" : "order-1"}`}>
            {/* Logo */}
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded flex items-center justify-center text-white text-[8px] font-bold" style={{ background: accent }}>
                {(product.name || "M")[0]}
              </div>
              <span className="text-[10px] font-semibold text-gray-600">IMPLOFY</span>
            </div>

            {/* Product card */}
            <div className="bg-white rounded-lg border border-gray-100 p-3 shadow-sm">
              <div className="flex gap-2 items-start">
                <div className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center" style={{ background: `${accent}12` }}>
                  <Award className="h-5 w-5" style={{ color: accent }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-gray-900 truncate">{product.name || "Novo Produto"}</div>
                  <div className="text-[9px] text-gray-500 mt-0.5 line-clamp-2">{product.description || "Descrição do produto"}</div>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-gray-100 space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-mono text-gray-700">{formatCurrency(product.price)}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-gray-50">
                  <span className="text-[10px] font-bold text-gray-900">Total</span>
                  <span className="text-sm font-bold font-mono" style={{ color: accent }}>{formatCurrency(product.price)}</span>
                </div>
              </div>
            </div>

            {/* Coupon */}
            <div className="bg-white rounded-lg border border-gray-100 p-2.5 shadow-sm">
              <div className="text-[9px] font-medium text-gray-500 mb-1.5">Cupom de desconto</div>
              <div className="flex gap-1.5">
                <div className="flex-1 rounded px-2 py-1.5 text-[9px] bg-gray-50 border border-gray-200 text-gray-400 font-mono">
                  CÓDIGO
                </div>
                <div className="rounded px-2.5 py-1.5 text-[9px] font-semibold text-white" style={{ background: accent }}>
                  Aplicar
                </div>
              </div>
            </div>

            {/* Security badges */}
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { icon: Lock, text: "SSL 256-bit" },
                { icon: Shield, text: "Pagamento seguro" },
                { icon: Shield, text: `Garantia ${product.guarantee}d` },
                { icon: CreditCard, text: "Acesso imediato" },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-white rounded-lg border border-gray-100 p-2 shadow-sm">
                  <b.icon className="h-3 w-3 text-gray-400 shrink-0" strokeWidth={1.5} />
                  <span className="text-[9px] font-medium text-gray-600">{b.text}</span>
                </div>
              ))}
            </div>

            {/* Reviews */}
            {testimonials.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[10px] font-semibold text-gray-700">Avaliações</div>
                {testimonials.slice(0, 3).map((t, i) => (
                  <div key={i} className="bg-white rounded-lg border border-gray-100 p-2.5 shadow-sm">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-bold text-white" style={{ background: accent }}>
                        {t.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="text-[9px] font-medium text-gray-800">{t.name}</span>
                      <div className="flex gap-px ml-auto">
                        {Array.from({ length: t.rating }).map((_, j) => (
                          <Star key={j} className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-[8px] text-gray-500">"{t.text}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — Form */}
          <div className={isMobile ? "order-1" : "order-2"}>
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
              {/* Steps tabs */}
              <div className="flex border-b border-gray-100">
                <div className="flex-1 flex items-center justify-center gap-1 py-2.5 text-[10px] font-semibold border-b-2" style={{ borderColor: accent, color: accent }}>
                  <span className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white" style={{ background: accent }}>1</span>
                  IDENTIFICAÇÃO
                </div>
                <div className="flex-1 flex items-center justify-center gap-1 py-2.5 text-[10px] font-semibold text-gray-400 border-b-2 border-transparent">
                  <span className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white bg-gray-300">2</span>
                  PAGAMENTO
                </div>
              </div>

              <div className="p-3 space-y-2.5">
                <div className="text-xs font-bold text-gray-900">Seus dados</div>

                {/* Form fields */}
                {["Nome completo", "E-mail", "Telefone", "CPF"].map(label => (
                  <div key={label}>
                    <div className="text-[9px] text-gray-600 font-medium mb-1">{label}</div>
                    <div className="rounded-md px-2.5 py-2 text-[10px] bg-white border border-gray-200 text-gray-400">
                      {label === "E-mail" ? "seu@email.com" : label === "Telefone" ? "(00) 00000-0000" : label === "CPF" ? "000.000.000-00" : "Seu nome completo"}
                    </div>
                  </div>
                ))}

                {/* CTA */}
                <div className="rounded-md py-2.5 text-center text-[10px] font-semibold text-white mt-1" style={{ background: accent }}>
                  Continuar
                </div>

                <p className="text-[7px] text-gray-400 text-center pt-1">
                  Ao finalizar, você concorda com os Termos de Uso e Política de Privacidade
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPreview;
