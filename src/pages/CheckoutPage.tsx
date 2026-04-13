import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Lock, Shield, CreditCard, Smartphone, FileText, Check, Copy, Clock,
  ChevronDown, Star, Eye, EyeOff, AlertCircle, CheckCircle2, ChevronRight, Award, Play
} from "lucide-react";
import { usePlatform, formatCurrency } from "@/contexts/PlatformContext";

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

  // Find product by slug — must match exactly
  const product = state.products.find(p => p.slug === slug);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <div className="text-center space-y-4">
          <ShoppingCart className="h-12 w-12 text-muted-foreground/30 mx-auto" />
          <h1 className="font-display text-2xl text-[#F1F0F5]">Checkout não encontrado</h1>
          <p className="text-sm text-[#9B9AA8]">Este checkout não existe ou foi removido.</p>
          <button onClick={() => navigate("/")} className="bg-[#8B5CF6] text-white rounded-xl px-6 py-3 text-sm font-medium hover:bg-[#8B5CF6]/90 transition-all">
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  const [paymentMethod, setPaymentMethod] = useState<"card" | "pix" | "boleto">("pix");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [pixGenerated, setPixGenerated] = useState(false);
  const [pixConfirmed, setPixConfirmed] = useState(false);
  const [pixTimer, setPixTimer] = useState(1800);
  const [processing, setProcessing] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
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

  const discount = couponApplied ? 100 : 0;
  const total = product.price - discount;

  useEffect(() => {
    if (!pixGenerated || pixConfirmed) return;
    const int = setInterval(() => setPixTimer(p => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(int);
  }, [pixGenerated, pixConfirmed]);

  const formatTimer = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

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
    setCouponLoading(true);
    setTimeout(() => { setCouponApplied(true); setCoupon("LAUNCH10"); setCouponLoading(false); }, 800);
  };

  const handlePixPayment = async () => {
    setPixGenerated(true);
    try {
      const txn = await simulatePayment(
        product.id,
        { name, email, cpf, phone },
        "pix"
      );
      setPixConfirmed(true);
      setTimeout(() => navigate(`/obrigado/${txn.id}`), 1500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCardSubmit = async () => {
    setProcessing(true);
    try {
      const txn = await simulatePayment(
        product.id,
        { name, email, cpf, phone },
        "card"
      );
      navigate(`/obrigado/${txn.id}`);
    } catch (e) {
      setProcessing(false);
    }
  };

  const installmentOptions = product.installments
    ? Array.from({ length: product.maxInstallments }, (_, i) => {
        const n = i + 1;
        const val = +(total / n).toFixed(2);
        const juros = n > 6 ? " (2,99% a.m.)" : " (sem juros)";
        return { n, value: val, label: `${n}x de ${formatCurrency(val)}${juros}` };
      })
    : [{ n: 1, value: total, label: `1x de ${formatCurrency(total)}` }];

  const InputField = ({ label, value, onChange, placeholder, mono, valid, type = "text" }: {
    label: string; value: string; onChange: (v: string) => void; placeholder: string;
    mono?: boolean; valid?: boolean | null; type?: string;
  }) => (
    <div>
      <label className="text-[13px] text-[#9B9AA8] mb-1.5 block font-sans">{label}</label>
      <div className="relative">
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className={`w-full rounded-xl px-4 py-3.5 text-sm bg-[rgba(255,255,255,0.04)] border transition-all duration-200 focus:outline-none focus:ring-0 ${mono ? "font-mono" : ""} ${
            valid === true ? "border-[rgba(52,211,153,0.5)]" : valid === false ? "border-[rgba(248,113,113,0.5)]" : "border-[rgba(255,255,255,0.1)] focus:border-[#8B5CF6] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)]"
          } placeholder:text-[#5C5B6B] text-[#F1F0F5]`}
        />
        {valid === true && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#34D399]" />}
        {valid === false && value.length > 0 && <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#F87171]" />}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050508]">
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <section className="pt-12 pb-16 px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-[#A78BFA] mb-6">
            <Shield className="h-3.5 w-3.5" /> Garantia de {product.guarantee} dias
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold mb-4 leading-tight max-w-3xl mx-auto">
            {product.headline}
          </h1>
          <p className="text-[#9B9AA8] text-base md:text-lg max-w-xl mx-auto mb-8">{product.subheadline}</p>
          <div className="flex items-center justify-center gap-4 mb-8">
            {product.originalPrice > product.price && (
              <span className="font-mono text-sm text-[#9B9AA8] line-through">{formatCurrency(product.originalPrice)}</span>
            )}
            <span className="font-mono text-3xl font-bold text-[#F59E0B]">{formatCurrency(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[rgba(52,211,153,0.15)] text-[#34D399]">
                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </span>
            )}
          </div>
          <a href="#checkout" className="inline-flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white rounded-xl px-8 py-4 font-semibold transition-all glow-primary text-base" style={{ background: product.accentColor }}>
            {product.ctaText} <ChevronDown className="h-4 w-4" />
          </a>
          <div className="flex items-center justify-center gap-6 mt-6 text-[10px] text-[#5C5B6B]">
            <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> SSL 256-bit</span>
            <span className="flex items-center gap-1"><Check className="h-3 w-3" /> Pagamento seguro</span>
            <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> Garantia {product.guarantee} dias</span>
          </div>
        </section>

        {/* Benefits */}
        {product.sections.beneficios && product.benefits.length > 0 && (
          <section className="py-12 px-4">
            <h2 className="font-display text-2xl text-center mb-8">O que você vai receber</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
              {product.benefits.map((b, i) => (
                <div key={i} className="glass rounded-xl p-4 flex items-center gap-3 animate-fade-slide-in" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${product.accentColor}20` }}>
                    <Check className="h-4 w-4" style={{ color: product.accentColor }} />
                  </div>
                  <span className="text-sm">{b}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Course content */}
        {product.sections.conteudo && product.linkedCourseId && (
          <section className="py-12 px-4">
            <h2 className="font-display text-2xl text-center mb-8">Conteúdo do programa</h2>
            <div className="max-w-xl mx-auto space-y-2">
              {state.courses.find(c => c.id === product.linkedCourseId)?.modules.map((m, i) => (
                <div key={i} className="glass rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Play className="h-4 w-4" style={{ color: product.accentColor }} strokeWidth={1.5} />
                    <span className="text-sm">{m.title}</span>
                  </div>
                  <span className="text-xs text-[#9B9AA8] font-mono">{m.lessons.length} aulas</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Testimonials */}
        {product.sections.depoimentos && product.testimonials.length > 0 && (
          <section className="py-12 px-4">
            <h2 className="font-display text-2xl text-center mb-8">O que dizem nossos alunos</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {product.testimonials.map((t, i) => (
                <div key={i} className="glass rounded-2xl p-5 space-y-3">
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                    ))}
                  </div>
                  <p className="text-xs text-[#9B9AA8]">"{t.text}"</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-medium" style={{ background: `${product.accentColor}20`, color: product.accentColor }}>
                      {t.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <div className="text-xs font-medium">{t.name}</div>
                      <div className="text-[10px] text-[#5C5B6B]">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Guarantee */}
        {product.sections.garantia && (
          <section className="py-12 px-4">
            <div className="glass rounded-2xl p-8 max-w-lg mx-auto text-center border border-[rgba(52,211,153,0.15)]">
              <Shield className="h-12 w-12 text-[#34D399] mx-auto mb-4" strokeWidth={1.5} />
              <h3 className="font-display text-xl mb-2">Garantia de {product.guarantee} dias</h3>
              <p className="text-xs text-[#9B9AA8]">Se não ficar satisfeito em {product.guarantee} dias, devolvemos 100% do seu dinheiro.</p>
            </div>
          </section>
        )}

        {/* FAQ */}
        {product.sections.faq && product.faq.length > 0 && (
          <section className="py-12 px-4">
            <h2 className="font-display text-2xl text-center mb-8">Perguntas frequentes</h2>
            <div className="max-w-xl mx-auto space-y-2">
              {product.faq.map((f, i) => (
                <div key={i} className="glass rounded-xl overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full p-4 flex items-center justify-between text-sm text-left">
                    <span>{f.q}</span>
                    <ChevronRight className={`h-4 w-4 text-[#9B9AA8] transition-transform ${openFaq === i ? "rotate-90" : ""}`} />
                  </button>
                  {openFaq === i && <div className="px-4 pb-4 text-xs text-[#9B9AA8] animate-fade-slide-in">{f.a}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CHECKOUT FORM */}
        <section id="checkout" className="py-16 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-4xl mx-auto">
            {/* Left — Order Summary */}
            <div className="lg:col-span-2 space-y-4">
              <div className="glass rounded-2xl p-6 space-y-5 lg:sticky lg:top-8">
                <h2 className="font-display text-lg">Resumo do pedido</h2>
                <div className="flex gap-3">
                  <div className="w-16 h-12 rounded-xl shrink-0 flex items-center justify-center" style={{ background: `${product.accentColor}15` }}>
                    <Award className="h-6 w-6" style={{ color: `${product.accentColor}60` }} />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{product.name}</div>
                    <div className="text-[11px] text-[#9B9AA8]">{product.description}</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-[#9B9AA8]">Subtotal</span><span className="font-mono">{formatCurrency(product.price)}</span></div>
                  {couponApplied && <div className="flex justify-between text-[#34D399] animate-fade-slide-in"><span>Desconto (LAUNCH10)</span><span className="font-mono">-{formatCurrency(discount)}</span></div>}
                  <div className="border-t border-[rgba(255,255,255,0.05)] pt-2 flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-mono text-2xl font-bold text-[#F59E0B]">{formatCurrency(total)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input type="text" value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Código do cupom"
                    className="flex-1 rounded-xl px-3 py-2.5 text-sm bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] focus:outline-none focus:border-[#8B5CF6] font-mono uppercase transition-all" />
                  <button onClick={applyCoupon} disabled={couponLoading} className="rounded-xl px-4 py-2.5 text-xs text-[#8B5CF6] hover:bg-[rgba(139,92,246,0.25)] transition-all font-medium" style={{ background: `${product.accentColor}15` }}>
                    {couponLoading ? "..." : "Aplicar"}
                  </button>
                </div>
                {couponApplied && <div className="flex items-center gap-2 text-xs text-[#34D399] animate-fade-slide-in"><Check className="h-3.5 w-3.5" /> Cupom LAUNCH10 aplicado!</div>}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {[{ icon: Lock, text: "SSL 256-bit" }, { icon: Check, text: "Pagamento seguro" }, { icon: Shield, text: `Garantia ${product.guarantee} dias` }, { icon: CreditCard, text: "Acesso imediato" }].map((b, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[10px] text-[#5C5B6B]"><b.icon className="h-3 w-3" strokeWidth={1.5} /> {b.text}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — Payment Form */}
            <div className="lg:col-span-3 space-y-4">
              <div className="glass rounded-2xl p-6 space-y-5">
                <h2 className="font-display text-lg">Dados de pagamento</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InputField label="Nome completo" value={name} onChange={setName} placeholder="Seu nome completo" valid={name.length > 2 ? true : name.length > 0 ? false : null} />
                  <InputField label="E-mail" value={email} onChange={setEmail} placeholder="seu@email.com" valid={emailValid ? true : email.length > 3 ? false : null} />
                  <InputField label="CPF" value={cpf} onChange={v => setCpf(maskCpf(v))} placeholder="000.000.000-00" mono valid={cpfValid ? true : cpf.length > 3 ? false : null} />
                  <InputField label="Telefone" value={phone} onChange={v => setPhone(maskPhone(v))} placeholder="(00) 00000-0000" mono valid={phoneValid ? true : phone.length > 3 ? false : null} />
                </div>

                {/* Payment method tabs */}
                <div className="flex gap-1 rounded-xl p-1 bg-[rgba(255,255,255,0.03)]">
                  {([
                    { id: "pix" as const, label: "PIX", icon: Smartphone },
                    { id: "card" as const, label: "Cartão", icon: CreditCard },
                    { id: "boleto" as const, label: "Boleto", icon: FileText },
                  ]).map(m => (
                    <button key={m.id} onClick={() => setPaymentMethod(m.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${
                        paymentMethod === m.id ? "text-[#8B5CF6] border" : "text-[#5C5B6B] hover:text-[#9B9AA8]"
                      }`}
                      style={paymentMethod === m.id ? { background: `${product.accentColor}20`, borderColor: `${product.accentColor}30`, color: product.accentColor } : undefined}
                    >
                      <m.icon className="h-4 w-4" strokeWidth={1.5} /> {m.label}
                    </button>
                  ))}
                </div>

                {/* PIX */}
                {paymentMethod === "pix" && (
                  <div className="space-y-4 animate-fade-slide-in text-center">
                    {!pixGenerated ? (
                      <>
                        <div className="glass rounded-xl p-4 text-xs text-[#9B9AA8]">Gere o QR Code, pague pelo seu banco e o acesso é liberado automaticamente.</div>
                        <button onClick={handlePixPayment} disabled={!personalValid}
                          className={`w-full rounded-xl py-4 text-sm font-semibold transition-all ${personalValid ? "text-white glow-primary" : "bg-[rgba(255,255,255,0.05)] text-[#5C5B6B] cursor-not-allowed"}`}
                          style={personalValid ? { background: product.accentColor } : undefined}
                        >
                          Finalizar e gerar QR Code — {formatCurrency(total)}
                        </button>
                      </>
                    ) : pixConfirmed ? (
                      <div className="space-y-4 animate-fade-slide-in py-6">
                        <div className="w-16 h-16 rounded-full bg-[rgba(52,211,153,0.15)] flex items-center justify-center mx-auto">
                          <Check className="h-8 w-8 text-[#34D399]" strokeWidth={2.5} />
                        </div>
                        <h3 className="font-display text-lg text-[#34D399]">Pagamento confirmado!</h3>
                        <p className="text-xs text-[#9B9AA8]">Preparando seu acesso...</p>
                      </div>
                    ) : (
                      <div className="space-y-4 animate-fade-slide-in">
                        <div className="glass rounded-2xl p-6 inline-block mx-auto">
                          <div className="w-48 h-48 bg-white rounded-xl p-3 mx-auto">
                            <div className="w-full h-full bg-[repeating-conic-gradient(#000_0%_25%,#fff_0%_50%)] bg-[length:8px_8px] rounded-lg" />
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-[#FBBF24]">
                          <Clock className="h-4 w-4" />
                          <span className="font-mono text-sm font-medium">QR Code válido por {formatTimer(pixTimer)}</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-xs text-[#9B9AA8]">
                          <div className="w-2 h-2 rounded-full bg-[#FBBF24] animate-pulse" />
                          Aguardando pagamento...
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Card */}
                {paymentMethod === "card" && (
                  <div className="space-y-3 animate-fade-slide-in">
                    <div>
                      <label className="text-[13px] text-[#9B9AA8] mb-1.5 block">Número do cartão</label>
                      <div className="relative">
                        <input type="text" value={cardNumber} onChange={e => setCardNumber(maskCard(e.target.value))} placeholder="0000 0000 0000 0000"
                          className="w-full rounded-xl px-4 py-3.5 text-sm bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] focus:outline-none focus:border-[#8B5CF6] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] font-mono transition-all" />
                        {brand && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-medium px-2 py-0.5 rounded animate-fade-slide-in" style={{ color: product.accentColor, background: `${product.accentColor}15` }}>{brand}</span>}
                      </div>
                    </div>
                    <InputField label="Nome no cartão" value={cardName} onChange={v => setCardName(v.toUpperCase())} placeholder="Como está no cartão" />
                    <div className="grid grid-cols-2 gap-3">
                      <InputField label="Validade" value={cardExpiry} onChange={v => setCardExpiry(maskExpiry(v))} placeholder="MM/AA" mono />
                      <div>
                        <label className="text-[13px] text-[#9B9AA8] mb-1.5 block">CVV</label>
                        <div className="relative">
                          <input type={showCvv ? "text" : "password"} value={cardCvv} onChange={e => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="000"
                            className="w-full rounded-xl px-4 py-3.5 text-sm bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] focus:outline-none focus:border-[#8B5CF6] font-mono transition-all" />
                          <button onClick={() => setShowCvv(!showCvv)} className="absolute right-3 top-1/2 -translate-y-1/2">
                            {showCvv ? <EyeOff className="h-4 w-4 text-[#5C5B6B]" /> : <Eye className="h-4 w-4 text-[#5C5B6B]" />}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-[13px] text-[#9B9AA8] mb-1.5 block">Parcelas</label>
                      <select value={installment} onChange={e => setInstallment(Number(e.target.value))}
                        className="w-full rounded-xl px-4 py-3.5 text-sm bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] focus:outline-none appearance-none font-mono transition-all text-[#F1F0F5]">
                        {installmentOptions.map(o => <option key={o.n} value={o.n} className="bg-[#12121C]">{o.label}</option>)}
                      </select>
                    </div>
                    <p className="text-[10px] text-[#5C5B6B] flex items-center gap-1"><Lock className="h-3 w-3" /> Seus dados são criptografados com SSL 256-bit</p>
                    <button onClick={handleCardSubmit} disabled={!personalValid || processing}
                      className={`w-full rounded-xl py-4 text-base font-semibold transition-all mt-2 ${personalValid && !processing ? "text-white glow-primary active:scale-[0.98]" : "bg-[rgba(255,255,255,0.05)] text-[#5C5B6B] cursor-not-allowed"}`}
                      style={personalValid && !processing ? { background: product.accentColor } : undefined}
                    >
                      {processing ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processando pagamento...
                        </span>
                      ) : `Finalizar compra — ${formatCurrency(total)}`}
                    </button>
                  </div>
                )}

                {/* Boleto */}
                {paymentMethod === "boleto" && (
                  <div className="space-y-4 animate-fade-slide-in text-center">
                    <div className="glass rounded-xl p-4">
                      <p className="text-xs text-[#FBBF24] flex items-center justify-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Compensação em até 3 dias úteis</p>
                    </div>
                    <button disabled={!personalValid}
                      className={`w-full rounded-xl py-4 text-sm font-semibold transition-all ${personalValid ? "text-white glow-primary" : "bg-[rgba(255,255,255,0.05)] text-[#5C5B6B] cursor-not-allowed"}`}
                      style={personalValid ? { background: product.accentColor } : undefined}
                    >
                      Gerar boleto bancário
                    </button>
                  </div>
                )}

                <p className="text-[10px] text-[#5C5B6B] text-center">
                  Ao finalizar, você concorda com os{" "}
                  <span className="cursor-pointer hover:underline" style={{ color: product.accentColor }}>Termos de Uso</span> e{" "}
                  <span className="cursor-pointer hover:underline" style={{ color: product.accentColor }}>Política de Privacidade</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 px-4 text-center">
          <h2 className="font-display text-2xl mb-4">Pronto para transformar seus resultados?</h2>
          <div className="flex items-center justify-center gap-3 mb-6">
            {product.originalPrice > product.price && <span className="font-mono text-sm text-[#9B9AA8] line-through">{formatCurrency(product.originalPrice)}</span>}
            <span className="font-mono text-3xl font-bold text-[#F59E0B]">{formatCurrency(product.price)}</span>
          </div>
          <a href="#checkout" className="inline-flex items-center gap-2 text-white rounded-xl px-8 py-4 font-semibold transition-all glow-primary" style={{ background: product.accentColor }}>
            {product.ctaText} <ChevronRight className="h-4 w-4" />
          </a>
        </section>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3 bg-[#050508]/95 backdrop-blur-xl border-t border-[rgba(255,255,255,0.05)] z-50">
        <a href="#checkout" className="flex items-center justify-center gap-2 text-white rounded-xl py-3.5 font-semibold glow-primary w-full" style={{ background: product.accentColor }}>
          Comprar agora — {formatCurrency(total)}
        </a>
      </div>
    </div>
  );
};

export default CheckoutPage;
