import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Lock, Shield, CreditCard, Smartphone, FileText, Check, Copy, Clock,
  ChevronDown, X, Star, Users, Award, MessageSquare, ChevronRight,
  Play, Eye, EyeOff, AlertCircle, CheckCircle2
} from "lucide-react";

const product = {
  name: "Mentoria PATRON",
  tagline: "O programa definitivo para vendedores de alto ticket",
  description: "Transforme sua carreira em 90 dias com o método comprovado que já ajudou +500 profissionais a triplicar seus resultados.",
  price: 997,
  originalPrice: 1497,
  guarantee: 7,
  mentorName: "Marcos Costa",
  mentorBio: "Especialista em vendas de alto ticket com +15 anos de experiência. Já treinou mais de 5.000 profissionais.",
};

const installmentOptions = [
  { n: 1, value: 997, label: "1x de R$ 997,00 (sem juros)" },
  { n: 3, value: 332.33, label: "3x de R$ 332,33 (sem juros)" },
  { n: 6, value: 166.17, label: "6x de R$ 166,17 (sem juros)" },
  { n: 12, value: 89.25, label: "12x de R$ 89,25 (2,99% a.m.)" },
];

const benefits = [
  "12 módulos com +80 aulas práticas",
  "Acesso vitalício a todo conteúdo",
  "Suporte direto com o mentor",
  "Certificado de conclusão",
  "Templates e materiais exclusivos",
  "Comunidade privada de alunos",
];

const testimonials = [
  { name: "Maria Silva", role: "Empreendedora", text: "Em 3 meses dobrei meu faturamento. O melhor investimento da minha carreira.", rating: 5 },
  { name: "Pedro Santos", role: "Vendedor Senior", text: "Conteúdo prático e direto ao ponto. Resultados desde a primeira semana.", rating: 5 },
  { name: "Ana Costa", role: "Consultora", text: "Recomendo para qualquer profissional que quer elevar seu nível de atuação.", rating: 5 },
];

const faqItems = [
  { q: "Quanto tempo tenho de acesso?", a: "Acesso vitalício. Assista quando quiser, quantas vezes quiser." },
  { q: "Tem garantia?", a: "Sim! Garantia incondicional de 7 dias. Se não gostar, devolvemos 100% do valor." },
  { q: "Como funciona o suporte?", a: "Suporte direto com o mentor por comentários nas aulas e grupo exclusivo." },
  { q: "Posso parcelar?", a: "Sim! Até 12x no cartão de crédito ou à vista no PIX com desconto." },
];

const modules = [
  { name: "Módulo 1 — Fundamentos", lessons: 8 },
  { name: "Módulo 2 — Prospecção", lessons: 10 },
  { name: "Módulo 3 — Negociação", lessons: 12 },
  { name: "Módulo 4 — Fechamento", lessons: 9 },
  { name: "Módulo 5 — Pós-venda", lessons: 7 },
];

/* Validators */
const validateCpf = (cpf: string) => {
  const nums = cpf.replace(/\D/g, "");
  if (nums.length !== 11) return false;
  return true; // simplified
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

  /* Form fields */
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

  /* PIX countdown */
  useEffect(() => {
    if (!pixGenerated || pixConfirmed) return;
    const int = setInterval(() => setPixTimer(p => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(int);
  }, [pixGenerated, pixConfirmed]);

  /* Simulate PIX confirmation after 8s */
  useEffect(() => {
    if (!pixGenerated || pixConfirmed) return;
    const t = setTimeout(() => setPixConfirmed(true), 8000);
    return () => clearTimeout(t);
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
    setTimeout(() => {
      setCouponApplied(true);
      setCoupon("LAUNCH10");
      setCouponLoading(false);
    }, 800);
  };

  const handleCardSubmit = () => {
    setProcessing(true);
    setTimeout(() => {
      window.location.href = `/obrigado/ORD-2025-${Math.floor(Math.random() * 99999).toString().padStart(5, "0")}`;
    }, 2500);
  };

  const InputField = ({
    label, value, onChange, placeholder, mono, valid, type = "text", icon,
  }: {
    label: string; value: string; onChange: (v: string) => void; placeholder: string;
    mono?: boolean; valid?: boolean | null; type?: string; icon?: React.ReactNode;
  }) => (
    <div>
      <label className="text-[13px] text-[#9B9AA8] mb-1.5 block font-sans">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-xl px-4 py-3.5 text-sm bg-[rgba(255,255,255,0.04)] border transition-all duration-200 focus:outline-none focus:ring-0 ${
            mono ? "font-mono" : ""
          } ${
            valid === true
              ? "border-[rgba(52,211,153,0.5)] focus:border-[rgba(52,211,153,0.7)]"
              : valid === false
              ? "border-[rgba(248,113,113,0.5)] focus:border-[rgba(248,113,113,0.7)]"
              : "border-[rgba(255,255,255,0.1)] focus:border-[#8B5CF6] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)]"
          } placeholder:text-[#5C5B6B] text-[#F1F0F5]`}
        />
        {valid === true && (
          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#34D399] animate-scale-in" />
        )}
        {valid === false && value.length > 0 && (
          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#F87171]" />
        )}
        {icon && !valid && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{icon}</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050508]">
      {/* Sales Page Content */}
      <div className="max-w-5xl mx-auto">

        {/* Hero */}
        <section className="pt-12 pb-16 px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-[#A78BFA] mb-6">
            <Shield className="h-3.5 w-3.5" /> Garantia de {product.guarantee} dias
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold mb-4 leading-tight max-w-3xl mx-auto">
            {product.description}
          </h1>
          <p className="text-[#9B9AA8] text-base md:text-lg max-w-xl mx-auto mb-8">
            {product.tagline}
          </p>
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="font-mono text-sm text-[#9B9AA8] line-through">R$ {product.originalPrice.toLocaleString("pt-BR")}</span>
            <span className="font-mono text-3xl font-bold text-[#F59E0B]">R$ {product.price.toLocaleString("pt-BR")}</span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[rgba(52,211,153,0.15)] text-[#34D399]">
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </span>
          </div>
          <a href="#checkout" className="inline-flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white rounded-xl px-8 py-4 font-semibold transition-all glow-primary text-base">
            Quero começar agora <ChevronDown className="h-4 w-4" />
          </a>
          <div className="flex items-center justify-center gap-6 mt-6 text-[10px] text-[#5C5B6B]">
            <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> SSL 256-bit</span>
            <span className="flex items-center gap-1"><Check className="h-3 w-3" /> Pagamento seguro</span>
            <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> Garantia {product.guarantee} dias</span>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-12 px-4">
          <h2 className="font-display text-2xl text-center mb-8">O que você vai receber</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
            {benefits.map((b, i) => (
              <div key={i} className="glass rounded-xl p-4 flex items-center gap-3 animate-fade-slide-in" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="w-8 h-8 rounded-lg bg-[rgba(139,92,246,0.15)] flex items-center justify-center shrink-0">
                  <Check className="h-4 w-4 text-[#8B5CF6]" />
                </div>
                <span className="text-sm">{b}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Course content */}
        <section className="py-12 px-4">
          <h2 className="font-display text-2xl text-center mb-8">Conteúdo do programa</h2>
          <div className="max-w-xl mx-auto space-y-2">
            {modules.map((m, i) => (
              <div key={i} className="glass rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Play className="h-4 w-4 text-[#8B5CF6]" strokeWidth={1.5} />
                  <span className="text-sm">{m.name}</span>
                </div>
                <span className="text-xs text-[#9B9AA8] font-mono">{m.lessons} aulas</span>
              </div>
            ))}
            <div className="text-center text-xs text-[#9B9AA8] pt-2 font-mono">
              +46 aulas · 24h de conteúdo
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-12 px-4">
          <h2 className="font-display text-2xl text-center mb-8">O que dizem nossos alunos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {testimonials.map((t, i) => (
              <div key={i} className="glass rounded-2xl p-5 space-y-3">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                  ))}
                </div>
                <p className="text-xs text-[#9B9AA8]">"{t.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[rgba(139,92,246,0.15)] flex items-center justify-center text-[10px] font-medium text-[#8B5CF6]">
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

        {/* Mentor */}
        <section className="py-12 px-4">
          <div className="glass rounded-2xl p-8 max-w-2xl mx-auto flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-[rgba(139,92,246,0.15)] flex items-center justify-center text-xl font-display text-[#8B5CF6] shrink-0">
              MC
            </div>
            <div>
              <h3 className="font-display text-lg mb-1">{product.mentorName}</h3>
              <p className="text-xs text-[#9B9AA8]">{product.mentorBio}</p>
            </div>
          </div>
        </section>

        {/* Guarantee */}
        <section className="py-12 px-4">
          <div className="glass rounded-2xl p-8 max-w-lg mx-auto text-center border border-[rgba(52,211,153,0.15)]">
            <Shield className="h-12 w-12 text-[#34D399] mx-auto mb-4" strokeWidth={1.5} />
            <h3 className="font-display text-xl mb-2">Garantia de {product.guarantee} dias</h3>
            <p className="text-xs text-[#9B9AA8]">
              Se não ficar satisfeito em {product.guarantee} dias, devolvemos 100% do seu dinheiro. Sem perguntas.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 px-4">
          <h2 className="font-display text-2xl text-center mb-8">Perguntas frequentes</h2>
          <div className="max-w-xl mx-auto space-y-2">
            {faqItems.map((f, i) => (
              <div key={i} className="glass rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-4 flex items-center justify-between text-sm text-left"
                >
                  <span>{f.q}</span>
                  <ChevronRight className={`h-4 w-4 text-[#9B9AA8] transition-transform ${openFaq === i ? "rotate-90" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-xs text-[#9B9AA8] animate-fade-slide-in">
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── CHECKOUT FORM ── */}
        <section id="checkout" className="py-16 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-4xl mx-auto">
            {/* Left — Order Summary */}
            <div className="lg:col-span-2 space-y-4">
              <div className="glass rounded-2xl p-6 space-y-5 lg:sticky lg:top-8">
                <h2 className="font-display text-lg">Resumo do pedido</h2>

                <div className="flex gap-3">
                  <div className="w-16 h-12 rounded-xl bg-[rgba(139,92,246,0.1)] shrink-0 flex items-center justify-center">
                    <Award className="h-6 w-6 text-[#8B5CF6]/40" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{product.name}</div>
                    <div className="text-[11px] text-[#9B9AA8]">{product.tagline}</div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#9B9AA8]">Subtotal</span>
                    <span className="font-mono">R$ {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between text-[#34D399] animate-fade-slide-in">
                      <span>Desconto (LAUNCH10)</span>
                      <span className="font-mono">-R$ {discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-[rgba(255,255,255,0.05)] pt-2 flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-mono text-2xl font-bold text-[#F59E0B]">
                      R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Coupon */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coupon}
                    onChange={e => setCoupon(e.target.value)}
                    placeholder="Código do cupom"
                    className="flex-1 rounded-xl px-3 py-2.5 text-sm bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] focus:outline-none focus:border-[#8B5CF6] font-mono uppercase transition-all"
                  />
                  <button
                    onClick={applyCoupon}
                    disabled={couponLoading}
                    className="rounded-xl px-4 py-2.5 text-xs bg-[rgba(139,92,246,0.15)] text-[#8B5CF6] hover:bg-[rgba(139,92,246,0.25)] transition-all font-medium"
                  >
                    {couponLoading ? "..." : "Aplicar"}
                  </button>
                </div>
                {couponApplied && (
                  <div className="flex items-center gap-2 text-xs text-[#34D399] animate-fade-slide-in">
                    <Check className="h-3.5 w-3.5" /> Cupom LAUNCH10 aplicado!
                  </div>
                )}

                {/* Trust badges */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {[
                    { icon: Lock, text: "SSL 256-bit" },
                    { icon: Check, text: "Pagamento seguro" },
                    { icon: Shield, text: `Garantia ${product.guarantee} dias` },
                    { icon: CreditCard, text: "Acesso imediato" },
                  ].map((b, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[10px] text-[#5C5B6B]">
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
                  <InputField
                    label="Nome completo"
                    value={name}
                    onChange={setName}
                    placeholder="Seu nome completo"
                    valid={name.length > 2 ? true : name.length > 0 ? false : null}
                  />
                  <InputField
                    label="E-mail"
                    value={email}
                    onChange={setEmail}
                    placeholder="seu@email.com"
                    valid={emailValid ? true : email.length > 3 ? false : null}
                  />
                  <InputField
                    label="CPF"
                    value={cpf}
                    onChange={v => setCpf(maskCpf(v))}
                    placeholder="000.000.000-00"
                    mono
                    valid={cpfValid ? true : cpf.length > 3 ? false : null}
                  />
                  <InputField
                    label="Telefone"
                    value={phone}
                    onChange={v => setPhone(maskPhone(v))}
                    placeholder="(00) 00000-0000"
                    mono
                    valid={phoneValid ? true : phone.length > 3 ? false : null}
                  />
                </div>

                {/* Payment method tabs */}
                <div className="flex gap-1 rounded-xl p-1 bg-[rgba(255,255,255,0.03)]">
                  {([
                    { id: "pix" as const, label: "PIX", icon: Smartphone },
                    { id: "card" as const, label: "Cartão", icon: CreditCard },
                    { id: "boleto" as const, label: "Boleto", icon: FileText },
                  ]).map(m => (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${
                        paymentMethod === m.id
                          ? "bg-[rgba(139,92,246,0.2)] text-[#8B5CF6] border border-[rgba(139,92,246,0.3)]"
                          : "text-[#5C5B6B] hover:text-[#9B9AA8]"
                      }`}
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
                        <div className="glass rounded-xl p-4 text-xs text-[#9B9AA8]">
                          Gere o QR Code, pague pelo seu banco e o acesso é liberado automaticamente.
                        </div>
                        <button
                          onClick={() => setPixGenerated(true)}
                          disabled={!personalValid}
                          className={`w-full rounded-xl py-4 text-sm font-semibold transition-all ${
                            personalValid
                              ? "bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white glow-primary"
                              : "bg-[rgba(255,255,255,0.05)] text-[#5C5B6B] cursor-not-allowed"
                          }`}
                        >
                          Finalizar e gerar QR Code — R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
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
                        <div className="glass rounded-xl p-3 flex items-center gap-2 max-w-sm mx-auto">
                          <span className="font-mono text-[10px] text-[#9B9AA8] truncate flex-1">00020126580014BR.GOV.BCB.PIX0136abc123def456...</span>
                          <button className="shrink-0 p-1.5 hover:bg-[rgba(255,255,255,0.06)] rounded-lg transition-all">
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-xs text-[#9B9AA8]">
                          <div className="w-2 h-2 rounded-full bg-[#FBBF24] animate-pulse" />
                          Aguardando pagamento...
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Card form */}
                {paymentMethod === "card" && (
                  <div className="space-y-3 animate-fade-slide-in">
                    <div>
                      <label className="text-[13px] text-[#9B9AA8] mb-1.5 block">Número do cartão</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={e => setCardNumber(maskCard(e.target.value))}
                          placeholder="0000 0000 0000 0000"
                          className="w-full rounded-xl px-4 py-3.5 text-sm bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] focus:outline-none focus:border-[#8B5CF6] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] font-mono transition-all"
                        />
                        {brand && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-medium text-[#A78BFA] bg-[rgba(139,92,246,0.15)] px-2 py-0.5 rounded animate-fade-slide-in">
                            {brand}
                          </span>
                        )}
                      </div>
                    </div>
                    <InputField
                      label="Nome no cartão"
                      value={cardName}
                      onChange={v => setCardName(v.toUpperCase())}
                      placeholder="Como está no cartão"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <InputField
                        label="Validade"
                        value={cardExpiry}
                        onChange={v => setCardExpiry(maskExpiry(v))}
                        placeholder="MM/AA"
                        mono
                      />
                      <div>
                        <label className="text-[13px] text-[#9B9AA8] mb-1.5 block">CVV</label>
                        <div className="relative">
                          <input
                            type={showCvv ? "text" : "password"}
                            value={cardCvv}
                            onChange={e => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                            placeholder="000"
                            className="w-full rounded-xl px-4 py-3.5 text-sm bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] focus:outline-none focus:border-[#8B5CF6] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] font-mono transition-all"
                          />
                          <button
                            onClick={() => setShowCvv(!showCvv)}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                          >
                            {showCvv ? <EyeOff className="h-4 w-4 text-[#5C5B6B]" /> : <Eye className="h-4 w-4 text-[#5C5B6B]" />}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-[13px] text-[#9B9AA8] mb-1.5 block">Parcelas</label>
                      <select
                        value={installment}
                        onChange={e => setInstallment(Number(e.target.value))}
                        className="w-full rounded-xl px-4 py-3.5 text-sm bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] focus:outline-none focus:border-[#8B5CF6] appearance-none font-mono transition-all text-[#F1F0F5]"
                      >
                        {installmentOptions.map(o => (
                          <option key={o.n} value={o.n} className="bg-[#12121C]">{o.label}</option>
                        ))}
                      </select>
                    </div>

                    <p className="text-[10px] text-[#5C5B6B] flex items-center gap-1">
                      <Lock className="h-3 w-3" /> Seus dados são criptografados com SSL 256-bit
                    </p>

                    <button
                      onClick={handleCardSubmit}
                      disabled={!personalValid || processing}
                      className={`w-full rounded-xl py-4 text-base font-semibold transition-all mt-2 ${
                        personalValid && !processing
                          ? "bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white glow-primary active:scale-[0.98]"
                          : "bg-[rgba(255,255,255,0.05)] text-[#5C5B6B] cursor-not-allowed"
                      }`}
                    >
                      {processing ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processando pagamento...
                        </span>
                      ) : (
                        `Finalizar compra — R$ ${total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                      )}
                    </button>
                  </div>
                )}

                {/* Boleto */}
                {paymentMethod === "boleto" && (
                  <div className="space-y-4 animate-fade-slide-in text-center">
                    <div className="glass rounded-xl p-4">
                      <p className="text-xs text-[#FBBF24] flex items-center justify-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" /> Compensação em até 3 dias úteis
                      </p>
                    </div>
                    <button
                      disabled={!personalValid}
                      className={`w-full rounded-xl py-4 text-sm font-semibold transition-all ${
                        personalValid
                          ? "bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white glow-primary"
                          : "bg-[rgba(255,255,255,0.05)] text-[#5C5B6B] cursor-not-allowed"
                      }`}
                    >
                      Gerar boleto bancário
                    </button>
                  </div>
                )}

                <p className="text-[10px] text-[#5C5B6B] text-center">
                  Ao finalizar, você concorda com os{" "}
                  <span className="text-[#8B5CF6] cursor-pointer hover:underline">Termos de Uso</span> e{" "}
                  <span className="text-[#8B5CF6] cursor-pointer hover:underline">Política de Privacidade</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 px-4 text-center">
          <h2 className="font-display text-2xl mb-4">Pronto para transformar seus resultados?</h2>
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="font-mono text-sm text-[#9B9AA8] line-through">R$ {product.originalPrice}</span>
            <span className="font-mono text-3xl font-bold text-[#F59E0B]">R$ {product.price}</span>
          </div>
          <a href="#checkout" className="inline-flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white rounded-xl px-8 py-4 font-semibold transition-all glow-primary">
            Quero começar agora <ChevronRight className="h-4 w-4" />
          </a>
        </section>
      </div>

      {/* Mobile sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3 bg-[#050508]/95 backdrop-blur-xl border-t border-[rgba(255,255,255,0.05)] z-50">
        <a href="#checkout" className="flex items-center justify-center gap-2 bg-[#8B5CF6] text-white rounded-xl py-3.5 font-semibold glow-primary w-full">
          Comprar agora — R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </a>
      </div>
    </div>
  );
};

export default CheckoutPage;
