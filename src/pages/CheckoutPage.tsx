import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Lock, Shield, CreditCard, Smartphone, Check, Clock,
  AlertCircle, CheckCircle2, Star, Award, Eye, EyeOff
} from "lucide-react";
import { usePlatform, formatCurrency } from "@/contexts/PlatformContext";
import { toast } from "sonner";

const VALID_COUPONS: Record<string, number> = {
  LAUNCH10: 100,
};

const maskCpf = (v: string) => {
  const n = v.replace(/\D/g, "").slice(0, 11);
  if (n.length <= 3) return n;
  if (n.length <= 6) return `${n.slice(0, 3)}.${n.slice(3)}`;
  if (n.length <= 9) return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6)}`;
  return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6, 9)}-${n.slice(9)}`;
};

const maskPhone = (v: string) => {
  const n = v.replace(/\D/g, "").slice(0, 11);
  if (n.length <= 2) return n;
  if (n.length <= 7) return `(${n.slice(0, 2)}) ${n.slice(2)}`;
  return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
};

const maskCard = (v: string) => {
  const n = v.replace(/\D/g, "").slice(0, 16);
  return n.replace(/(.{4})/g, "$1 ").trim();
};

const maskExpiry = (v: string) => {
  const n = v.replace(/\D/g, "").slice(0, 4);
  if (n.length <= 2) return n;
  return `${n.slice(0, 2)}/${n.slice(2)}`;
};

const CheckoutPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { state, simulatePayment } = usePlatform();

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card">("pix");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [pixGenerated, setPixGenerated] = useState(false);
  const [pixConfirmed, setPixConfirmed] = useState(false);
  const [pixTimer, setPixTimer] = useState(1800);
  const [processing, setProcessing] = useState(false);
  const [showCvv, setShowCvv] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [installment, setInstallment] = useState(1);

  // Countdown timer
  const [countdown, setCountdown] = useState(15 * 60 + 42);

  const product = state.products.find(p => p.slug === slug);

  const discount = couponApplied ? (VALID_COUPONS[coupon.toUpperCase()] ?? 0) : 0;
  const total = product ? product.price - discount : 0;

  useEffect(() => {
    const int = setInterval(() => setCountdown(p => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(int);
  }, []);

  useEffect(() => {
    if (!pixGenerated || pixConfirmed) return;
    const int = setInterval(() => setPixTimer(p => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(int);
  }, [pixGenerated, pixConfirmed]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Award className="h-12 w-12 text-muted-foreground/50 mx-auto" />
          <h1 className="text-2xl font-bold text-foreground">Checkout não encontrado</h1>
          <p className="text-sm text-muted-foreground">Este checkout não existe ou foi removido.</p>
          <button onClick={() => navigate("/")} className="bg-[#FFD700] text-white rounded-lg px-6 py-3 text-sm font-medium hover:bg-[#B8860B] transition-all">
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  const formatTimer = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const cpfValid = cpf.replace(/\D/g, "").length === 11;
  const phoneValid = phone.replace(/\D/g, "").length >= 10;
  const personalValid = name.length > 2 && emailValid && cpfValid && phoneValid;

  const detectBrand = (n: string) => {
    const d = n.replace(/\D/g, "");
    if (d.startsWith("4")) return "Visa";
    if (d.startsWith("5")) return "Master";
    if (d.startsWith("6")) return "Elo";
    if (d.startsWith("3")) return "Amex";
    return null;
  };
  const brand = detectBrand(cardNumber);

  const applyCoupon = () => {
    if (!coupon.trim()) return;
    setCouponLoading(true);
    setTimeout(() => {
      const code = coupon.trim().toUpperCase();
      if (VALID_COUPONS[code] !== undefined) {
        setCouponApplied(true);
        setCoupon(code);
      } else {
        toast.error("Cupom inválido ou expirado.");
      }
      setCouponLoading(false);
    }, 800);
  };

  const handlePixPayment = async () => {
    setPixGenerated(true);
    try {
      const txn = await simulatePayment(product.id, { name, email, cpf, phone }, "pix");
      setPixConfirmed(true);
      setTimeout(() => navigate(`/obrigado/${txn.id}`), 1500);
    } catch (e) { console.error(e); }
  };

  const handleCardSubmit = async () => {
    setProcessing(true);
    try {
      const txn = await simulatePayment(product.id, { name, email, cpf, phone }, "card");
      navigate(`/obrigado/${txn.id}`);
    } catch (e) { setProcessing(false); }
  };

  const installmentOptions = product.installments
    ? Array.from({ length: product.maxInstallments }, (_, i) => {
        const n = i + 1;
        const val = +(total / n).toFixed(2);
        const juros = n > 6 ? " (2,99% a.m.)" : " (sem juros)";
        return { n, value: val, label: `${n}x de ${formatCurrency(val)}${juros}` };
      })
    : [{ n: 1, value: total, label: `1x de ${formatCurrency(total)}` }];

  const accentColor = product.accentColor || "#FFD700";

  const reviews = product.testimonials?.slice(0, 3) || [
    { name: "Ana Costa", rating: 5, text: "Transformou completamente minha forma de vender." },
    { name: "Ricardo Lima", rating: 5, text: "ROI incrível, recomendo demais!" },
    { name: "Mariana Souza", rating: 5, text: "Conteúdo direto ao ponto e aplicável." },
  ];

  const InputField = ({ label, value, onChange, placeholder, mono, valid, type = "text" }: {
    label: string; value: string; onChange: (v: string) => void; placeholder: string;
    mono?: boolean; valid?: boolean | null; type?: string;
  }) => (
    <div>
      <label className="text-[13px] text-muted-foreground mb-1.5 block font-medium">{label}</label>
      <div className="relative">
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className={`w-full rounded-lg px-4 py-3 text-sm bg-card border transition-all duration-200 focus:outline-none focus:ring-0 text-foreground placeholder:text-muted-foreground/70 ${mono ? "font-mono" : ""} ${
            valid === true ? "border-success" : valid === false ? "border-destructive" : "border-border focus:border-[#FFD700] focus:shadow-[0_0_0_3px_rgba(255,215,0,0.1)]"
          }`}
        />
        {valid === true && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-success" />}
        {valid === false && value.length > 0 && <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Countdown bar */}
      <div className="w-full py-2.5 px-4 text-center text-sm font-semibold text-white" style={{ background: accentColor }}>
        <div className="flex items-center justify-center gap-2">
          <Clock className="h-4 w-4" />
          <span>OFERTA TERMINA EM</span>
          <span className="font-mono bg-card/20 rounded px-2 py-0.5">{formatTimer(countdown)}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* LEFT — Order Summary */}
          <div className="order-2 lg:order-1 space-y-6">
            {/* Platform name */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: accentColor }}>
                {(state.settings?.platformName || "M")[0]}
              </div>
              <span className="text-sm font-semibold text-foreground/80">{state.settings?.platformName || "IMPLOFY"}</span>
            </div>

            {/* Product card */}
            <div className="bg-card rounded-xl border border-border/50 p-6 ">
              <div className="flex gap-4 items-start">
                <div className="w-16 h-16 rounded-xl shrink-0 flex items-center justify-center" style={{ background: `${accentColor}12` }}>
                  <Award className="h-8 w-8" style={{ color: accentColor }} />
                </div>
                <div className="flex-1">
                  <h1 className="text-lg font-bold text-foreground">{product.name}</h1>
                  <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/50 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-mono text-foreground/80">{formatCurrency(product.price)}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-sm text-success">
                    <span>Desconto (LAUNCH10)</span>
                    <span className="font-mono">-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-border/50">
                  <span className="text-base font-bold text-foreground">Total</span>
                  <span className="text-2xl font-bold font-mono" style={{ color: accentColor }}>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            {/* Coupon */}
            <div className="bg-card rounded-xl border border-border/50 p-4 ">
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Cupom de desconto</label>
              <div className="flex gap-2">
                <input type="text" value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Código do cupom"
                  className="flex-1 rounded-lg px-3 py-2.5 text-sm bg-[#1A1A1A] border border-border focus:outline-none focus:border-[#FFD700] font-mono uppercase transition-all text-foreground placeholder:text-muted-foreground/70" />
                <button onClick={applyCoupon} disabled={couponLoading}
                  className="rounded-lg px-4 py-2.5 text-xs font-semibold transition-all text-white" style={{ background: accentColor }}>
                  {couponLoading ? "..." : "Aplicar"}
                </button>
              </div>
              {couponApplied && <p className="flex items-center gap-1.5 text-xs text-success mt-2"><Check className="h-3.5 w-3.5" /> Cupom LAUNCH10 aplicado!</p>}
            </div>

            {/* Security badges */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Lock, text: "SSL 256-bit", sub: "Dados criptografados" },
                { icon: Shield, text: "Pagamento seguro", sub: "Ambiente protegido" },
                { icon: Shield, text: `Garantia ${product.guarantee} dias`, sub: "Dinheiro de volta" },
                { icon: CreditCard, text: "Acesso imediato", sub: "Liberado na hora" },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-2.5 bg-card rounded-xl border border-border/50 p-3 ">
                  <b.icon className="h-4 w-4 text-muted-foreground/70 shrink-0" strokeWidth={1.5} />
                  <div>
                    <div className="text-xs font-medium text-foreground/80">{b.text}</div>
                    <div className="text-[10px] text-muted-foreground/70">{b.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Reviews */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground/80">Avaliações de alunos</h3>
              {reviews.map((r, i) => (
                <div key={i} className="bg-card rounded-xl border border-border/50 p-4 ">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: accentColor }}>
                      {r.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{r.name}</div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: r.rating }).map((_, j) => (
                          <Star key={j} className="h-3 w-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">"{r.text}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Payment Form */}
          <div className="order-1 lg:order-2">
            <div className="bg-card rounded-xl border border-border/50  overflow-hidden lg:sticky lg:top-8">
              {/* Steps */}
              <div className="flex border-b border-border/50">
                <button onClick={() => setStep(1)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all border-b-2 ${
                    step === 1 ? "border-[#FFD700] text-[#FFD700]" : "border-transparent text-muted-foreground/70"
                  }`}>
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: step === 1 ? accentColor : "#d1d5db" }}>1</span>
                  IDENTIFICAÇÃO
                </button>
                <button onClick={() => personalValid && setStep(2)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all border-b-2 ${
                    step === 2 ? "border-[#FFD700] text-[#FFD700]" : "border-transparent text-muted-foreground/70"
                  }`}>
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: step === 2 ? accentColor : "#d1d5db" }}>2</span>
                  PAGAMENTO
                </button>
              </div>

              <div className="p-6">
                {/* Step 1 — Identification */}
                {step === 1 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-bold text-foreground">Seus dados</h2>
                    <InputField label="Nome completo" value={name} onChange={setName} placeholder="Seu nome completo" valid={name.length > 2 ? true : name.length > 0 ? false : null} />
                    <InputField label="E-mail" value={email} onChange={setEmail} placeholder="seu@email.com" type="email" valid={emailValid ? true : email.length > 3 ? false : null} />
                    <InputField label="Telefone" value={phone} onChange={v => setPhone(maskPhone(v))} placeholder="(00) 00000-0000" mono valid={phoneValid ? true : phone.length > 3 ? false : null} />
                    <InputField label="CPF" value={cpf} onChange={v => setCpf(maskCpf(v))} placeholder="000.000.000-00" mono valid={cpfValid ? true : cpf.length > 3 ? false : null} />
                    <button onClick={() => setStep(2)} disabled={!personalValid}
                      className={`w-full rounded-lg py-3.5 text-sm font-semibold transition-all mt-2 ${
                        personalValid ? "text-white hover:opacity-90" : "bg-gray-100 text-muted-foreground/70 cursor-not-allowed"
                      }`}
                      style={personalValid ? { background: accentColor } : undefined}>
                      Continuar
                    </button>
                  </div>
                )}

                {/* Step 2 — Payment */}
                {step === 2 && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-foreground">Pagamento</h2>
                      <button onClick={() => setStep(1)} className="text-xs font-medium hover:underline" style={{ color: accentColor }}>
                        ← Voltar
                      </button>
                    </div>

                    {/* Identified user */}
                    <div className="bg-[#1A1A1A] rounded-lg p-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: accentColor }}>
                        {name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">{name}</div>
                        <div className="text-xs text-muted-foreground">{email}</div>
                      </div>
                    </div>

                    {/* Payment method */}
                    <div className="flex gap-2">
                      {([
                        { id: "pix" as const, label: "PIX", icon: Smartphone },
                        { id: "card" as const, label: "Cartão", icon: CreditCard },
                      ]).map(m => (
                        <button key={m.id} onClick={() => setPaymentMethod(m.id)}
                          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium border transition-all ${
                            paymentMethod === m.id
                              ? "border-[#FFD700] bg-[#FFD700]/5 text-[#FFD700]"
                              : "border-border text-muted-foreground hover:border-gray-300"
                          }`}>
                          <m.icon className="h-4 w-4" strokeWidth={1.5} /> {m.label}
                        </button>
                      ))}
                    </div>

                    {/* PIX */}
                    {paymentMethod === "pix" && (
                      <div className="space-y-4 text-center">
                        {!pixGenerated ? (
                          <>
                            <div className="bg-[#1A1A1A] rounded-lg p-4 text-xs text-muted-foreground">
                              Gere o QR Code PIX, pague pelo app do seu banco e o acesso é liberado instantaneamente.
                            </div>
                            <button onClick={handlePixPayment}
                              className="w-full rounded-lg py-4 text-sm font-semibold text-white transition-all hover:opacity-90"
                              style={{ background: accentColor }}>
                              Gerar PIX — {formatCurrency(total)}
                            </button>
                          </>
                        ) : pixConfirmed ? (
                          <div className="space-y-4 py-6">
                            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                              <Check className="h-8 w-8 text-success" strokeWidth={2.5} />
                            </div>
                            <h3 className="text-lg font-bold text-success">Pagamento confirmado!</h3>
                            <p className="text-xs text-muted-foreground">Preparando seu acesso...</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="bg-[#1A1A1A] rounded-xl p-6 inline-block mx-auto">
                              <div className="w-48 h-48 bg-card rounded-xl p-3 mx-auto border border-border">
                                <div className="w-full h-full bg-[repeating-conic-gradient(#000_0%_25%,#fff_0%_50%)] bg-[length:8px_8px] rounded-lg" />
                              </div>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-warning">
                              <Clock className="h-4 w-4" />
                              <span className="font-mono text-sm font-medium">QR Code válido por {formatTimer(pixTimer)}</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/70">
                              <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
                              Aguardando pagamento...
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Card */}
                    {paymentMethod === "card" && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-[13px] text-muted-foreground mb-1.5 block font-medium">Número do cartão</label>
                          <div className="relative">
                            <input type="text" value={cardNumber} onChange={e => setCardNumber(maskCard(e.target.value))} placeholder="0000 0000 0000 0000"
                              className="w-full rounded-lg px-4 py-3 text-sm bg-card border border-border focus:outline-none focus:border-[#FFD700] focus:shadow-[0_0_0_3px_rgba(255,215,0,0.1)] font-mono transition-all text-foreground placeholder:text-muted-foreground/70" />
                            {brand && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-[#FFD700]/10 text-[#FFD700]">{brand}</span>}
                          </div>
                        </div>
                        <InputField label="Nome no cartão" value={cardName} onChange={v => setCardName(v.toUpperCase())} placeholder="Como está no cartão" />
                        <div className="grid grid-cols-2 gap-3">
                          <InputField label="Validade" value={cardExpiry} onChange={v => setCardExpiry(maskExpiry(v))} placeholder="MM/AA" mono />
                          <div>
                            <label className="text-[13px] text-muted-foreground mb-1.5 block font-medium">CVV</label>
                            <div className="relative">
                              <input type={showCvv ? "text" : "password"} value={cardCvv} onChange={e => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="000"
                                className="w-full rounded-lg px-4 py-3 text-sm bg-card border border-border focus:outline-none focus:border-[#FFD700] font-mono transition-all text-foreground placeholder:text-muted-foreground/70" />
                              <button onClick={() => setShowCvv(!showCvv)} className="absolute right-3 top-1/2 -translate-y-1/2">
                                {showCvv ? <EyeOff className="h-4 w-4 text-muted-foreground/70" /> : <Eye className="h-4 w-4 text-muted-foreground/70" />}
                              </button>
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="text-[13px] text-muted-foreground mb-1.5 block font-medium">Parcelas</label>
                          <select value={installment} onChange={e => setInstallment(Number(e.target.value))}
                            className="w-full rounded-lg px-4 py-3 text-sm bg-card border border-border focus:outline-none appearance-none font-mono transition-all text-foreground">
                            {installmentOptions.map(o => <option key={o.n} value={o.n}>{o.label}</option>)}
                          </select>
                        </div>
                        <p className="text-[10px] text-muted-foreground/70 flex items-center gap-1"><Lock className="h-3 w-3" /> Dados criptografados com SSL 256-bit</p>
                        <button onClick={handleCardSubmit} disabled={processing}
                          className={`w-full rounded-lg py-4 text-sm font-semibold transition-all mt-1 ${
                            !processing ? "text-white hover:opacity-90" : "bg-gray-100 text-muted-foreground/70 cursor-not-allowed"
                          }`}
                          style={!processing ? { background: accentColor } : undefined}>
                          {processing ? (
                            <span className="flex items-center justify-center gap-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Processando...
                            </span>
                          ) : `Finalizar compra — ${formatCurrency(total)}`}
                        </button>
                      </div>
                    )}

                    <p className="text-[10px] text-muted-foreground/70 text-center pt-2">
                      Ao finalizar, você concorda com os{" "}
                      <span className="cursor-pointer hover:underline" style={{ color: accentColor }}>Termos de Uso</span> e{" "}
                      <span className="cursor-pointer hover:underline" style={{ color: accentColor }}>Política de Privacidade</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
