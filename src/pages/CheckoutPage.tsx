import { useState } from "react";
import { Lock, Shield, CreditCard, Smartphone, FileText, Check, Copy, Clock, ChevronDown, X } from "lucide-react";

const product = {
  name: "Mentoria PATRON",
  description: "O programa definitivo para vendedores de alto ticket",
  price: 997,
  originalPrice: 1497,
  guarantee: 7,
};

const installmentOptions = [
  { n: 1, value: 997, label: "1x de R$ 997,00 (sem juros)" },
  { n: 3, value: 332.33, label: "3x de R$ 332,33 (sem juros)" },
  { n: 6, value: 166.17, label: "6x de R$ 166,17 (sem juros)" },
  { n: 12, value: 89.25, label: "12x de R$ 89,25 (2,99% a.m.)" },
];

const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "pix" | "boleto">("card");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [pixGenerated, setPixGenerated] = useState(false);

  const discount = couponApplied ? 100 : 0;
  const total = product.price - discount;

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left — Order Summary */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass rounded-2xl p-6 space-y-5">
            <h2 className="font-display text-lg">Resumo do pedido</h2>

            <div className="flex gap-3">
              <div className="w-16 h-12 rounded-xl bg-primary/10 shrink-0" />
              <div>
                <div className="text-sm font-medium">{product.name}</div>
                <div className="text-[11px] text-muted-foreground">{product.description}</div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-mono">R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              {couponApplied && (
                <div className="flex justify-between text-success">
                  <span>Desconto (LAUNCH10)</span>
                  <span className="font-mono">-R$ {discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-[rgba(255,255,255,0.05)] pt-2 flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-mono text-2xl font-bold text-[#F59E0B]">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Coupon */}
            <div className="flex gap-2">
              <input
                type="text"
                value={coupon}
                onChange={e => setCoupon(e.target.value)}
                placeholder="Código do cupom"
                className="flex-1 glass rounded-xl px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono uppercase"
              />
              <button
                onClick={() => { setCouponApplied(true); setCoupon("LAUNCH10"); }}
                className="glass rounded-xl px-4 py-2 text-xs hover:bg-primary/15 text-primary transition-all"
              >
                Aplicar
              </button>
            </div>
            {couponApplied && (
              <div className="flex items-center gap-2 text-xs text-success animate-fade-slide-in">
                <Check className="h-3.5 w-3.5" /> Cupom LAUNCH10 aplicado!
              </div>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              {[
                { icon: Lock, text: "SSL 256-bit" },
                { icon: Check, text: "Pagamento seguro" },
                { icon: Shield, text: `Garantia ${product.guarantee} dias` },
                { icon: CreditCard, text: "Dados protegidos" },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <b.icon className="h-3 w-3" strokeWidth={1.5} /> {b.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Payment Form */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass rounded-2xl p-6 space-y-5">
            <h2 className="font-display text-lg">Dados de pagamento</h2>

            {/* Personal info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Nome completo</label>
                <input type="text" placeholder="Seu nome" className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">E-mail</label>
                <input type="email" placeholder="seu@email.com" className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">CPF</label>
                <input type="text" placeholder="000.000.000-00" className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Telefone</label>
                <input type="text" placeholder="(00) 00000-0000" className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono" />
              </div>
            </div>

            {/* Payment method tabs */}
            <div className="flex gap-1 glass rounded-xl p-1">
              {([
                { id: "card" as const, label: "Cartão", icon: CreditCard },
                { id: "pix" as const, label: "PIX", icon: Smartphone },
                { id: "boleto" as const, label: "Boleto", icon: FileText },
              ]).map(m => (
                <button
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    paymentMethod === m.id ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <m.icon className="h-4 w-4" strokeWidth={1.5} /> {m.label}
                </button>
              ))}
            </div>

            {/* Card form */}
            {paymentMethod === "card" && (
              <div className="space-y-3 animate-fade-slide-in">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Número do cartão</label>
                  <div className="relative">
                    <input type="text" placeholder="0000 0000 0000 0000" className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono" />
                    <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Nome no cartão</label>
                  <input type="text" placeholder="Como está no cartão" className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Validade</label>
                    <input type="text" placeholder="MM/AA" className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">CVV</label>
                    <input type="text" placeholder="000" className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Parcelas</label>
                  <select className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 appearance-none font-mono">
                    {installmentOptions.map(o => (
                      <option key={o.n} value={o.n}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* PIX */}
            {paymentMethod === "pix" && (
              <div className="space-y-4 animate-fade-slide-in text-center">
                {!pixGenerated ? (
                  <button
                    onClick={() => setPixGenerated(true)}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-3 text-sm font-medium glow-primary transition-all"
                  >
                    Gerar QR Code PIX
                  </button>
                ) : (
                  <div className="space-y-4 animate-fade-slide-in">
                    <div className="glass rounded-2xl p-6 inline-block mx-auto">
                      <div className="w-48 h-48 bg-white rounded-xl p-3 mx-auto">
                        <div className="w-full h-full bg-[repeating-conic-gradient(#000_0%_25%,#fff_0%_50%)] bg-[length:8px_8px] rounded-lg" />
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-warning">
                      <Clock className="h-4 w-4" />
                      <span className="font-mono text-sm font-medium">QR Code válido por 29:47</span>
                    </div>
                    <div className="glass rounded-xl p-3 flex items-center gap-2 max-w-sm mx-auto">
                      <span className="font-mono text-[10px] text-muted-foreground truncate flex-1">00020126580014BR.GOV.BCB.PIX0136abc123...</span>
                      <button className="shrink-0 p-1.5 hover:bg-[rgba(255,255,255,0.06)] rounded-lg transition-all">
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
                      Aguardando pagamento...
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Boleto */}
            {paymentMethod === "boleto" && (
              <div className="space-y-4 animate-fade-slide-in text-center">
                <div className="glass rounded-xl p-4">
                  <p className="text-xs text-warning flex items-center justify-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> Compensação em até 3 dias úteis
                  </p>
                </div>
                <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-3 text-sm font-medium glow-primary transition-all">
                  Gerar boleto bancário
                </button>
              </div>
            )}

            {/* Submit */}
            {paymentMethod === "card" && (
              <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-4 text-base font-semibold glow-primary transition-all">
                Finalizar compra — R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </button>
            )}

            <p className="text-[10px] text-muted-foreground text-center">
              Ao finalizar, você concorda com os <span className="text-primary cursor-pointer hover:underline">Termos de Uso</span> e <span className="text-primary cursor-pointer hover:underline">Política de Privacidade</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
