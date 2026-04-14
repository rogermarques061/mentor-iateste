import { useState } from "react";
import { Play, Check, Shield, Lock, ChevronDown, Star, Clock, Users, Award } from "lucide-react";

const product = {
  name: "Programa PATRON",
  subtitle: "O programa definitivo para vendedores de alto ticket que querem faturar R$ 100K/mês",
  price: 997,
  originalPrice: 1497,
  installments: "12x de R$ 89,25",
  guarantee: 7,
};

const benefits = [
  "Domine a arte da venda consultiva de alto ticket",
  "Construa um pipeline previsível de clientes premium",
  "Aprenda scripts testados que convertem +30%",
  "Mentalidade e posicionamento de autoridade",
  "Acesso a comunidade exclusiva de top performers",
  "Suporte direto do mentor por 12 meses",
];

const modules = [
  { name: "Módulo 1 — Fundamentos", lessons: 8, duration: "2h 30min" },
  { name: "Módulo 2 — Prospecção", lessons: 12, duration: "4h 15min" },
  { name: "Módulo 3 — Qualificação", lessons: 10, duration: "3h 40min" },
  { name: "Módulo 4 — Apresentação", lessons: 14, duration: "5h 20min" },
  { name: "Módulo 5 — Fechamento", lessons: 11, duration: "4h 50min" },
  { name: "Módulo 6 — Pós-venda", lessons: 8, duration: "2h 45min" },
];

const testimonials = [
  { name: "Ana Silva", role: "Vendedora", text: "Em 3 meses apliquei o método e saí de R$ 15K para R$ 67K em vendas. O melhor investimento da minha carreira.", rating: 5 },
  { name: "Pedro Santos", role: "Empresário", text: "O programa transformou completamente minha equipe de vendas. ROI de 20x nos primeiros 6 meses.", rating: 5 },
  { name: "Carla Lima", role: "Consultora", text: "Antes eu tinha medo de vender. Hoje fecho contratos de R$ 50K+ com confiança total.", rating: 5 },
];

const faqs = [
  { q: "Quanto tempo tenho de acesso?", a: "Acesso vitalício a todo o conteúdo, incluindo atualizações futuras." },
  { q: "E se eu não gostar?", a: `Você tem ${product.guarantee} dias de garantia incondicional. Se não gostar, devolvemos 100% do seu investimento.` },
  { q: "Preciso de experiência prévia?", a: "Não. O programa foi desenhado para todos os níveis, do iniciante ao avançado." },
  { q: "Posso parcelar?", a: `Sim! Aceitamos em até 12x no cartão. ${product.installments}.` },
];

const ProductSalesPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />

        <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs text-primary mb-8">
            <Star className="h-3.5 w-3.5" /> Mais de 500 alunos transformados
          </div>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
            {product.name}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            {product.subtitle}
          </p>

          {/* Video placeholder */}
          <div className="glass rounded-2xl overflow-hidden aspect-video max-w-2xl mx-auto mb-10 flex items-center justify-center cursor-pointer group">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-all group-hover:scale-110">
              <Play className="h-7 w-7 text-primary ml-1" />
            </div>
          </div>

          {/* Price + CTA */}
          <div className="glass rounded-2xl p-8 max-w-md mx-auto">
            <div className="flex items-baseline justify-center gap-3 mb-2">
              <span className="font-mono text-4xl font-bold text-[#F59E0B]">R$ {product.price}</span>
              <span className="font-mono text-lg text-muted-foreground line-through">R$ {product.originalPrice}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-5">ou {product.installments}</p>
            <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-4 text-base font-semibold glow-primary transition-all">
              Quero me inscrever agora
            </button>
            <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> Pagamento seguro</span>
              <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> Garantia {product.guarantee} dias</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="font-display text-2xl text-center mb-10">O que você vai aprender</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {benefits.map((b, i) => (
            <div key={i} className="glass rounded-xl p-4 flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-success/15 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="h-3.5 w-3.5 text-success" />
              </div>
              <span className="text-sm">{b}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Modules */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="font-display text-2xl text-center mb-3">Conteúdo do programa</h2>
        <p className="text-center text-sm text-muted-foreground mb-10">
          {modules.length} módulos · {modules.reduce((a, m) => a + m.lessons, 0)} aulas · +20h de conteúdo
        </p>
        <div className="space-y-2">
          {modules.map((m, i) => (
            <div key={i} className="glass rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center font-mono text-xs text-primary font-medium">{i + 1}</div>
                <span className="text-sm font-medium">{m.name}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{m.lessons} aulas</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {m.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="font-display text-2xl text-center mb-10">O que nossos alunos dizem</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <div key={i} className="glass rounded-2xl p-5 space-y-3">
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground italic">"{t.text}"</p>
              <div>
                <div className="text-sm font-medium">{t.name}</div>
                <div className="text-[10px] text-muted-foreground">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mentor */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="glass rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 rounded-2xl bg-primary/15 flex items-center justify-center text-2xl font-display text-primary shrink-0">MC</div>
          <div>
            <h3 className="font-display text-xl mb-2">Marcos Costa</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Mentor especializado em vendas de alto ticket com +15 anos de experiência. Já ajudou mais de 500 profissionais a alcançarem faturamentos de 6 e 7 dígitos através do seu método exclusivo.
            </p>
            <div className="flex gap-4 mt-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> +500 alunos</span>
              <span className="flex items-center gap-1"><Award className="h-3.5 w-3.5" /> 15+ anos</span>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="glass rounded-2xl p-8 text-center border border-success/20">
          <Shield className="h-12 w-12 text-success mx-auto mb-4" strokeWidth={1.5} />
          <h3 className="font-display text-xl mb-3">Garantia incondicional de {product.guarantee} dias</h3>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Se dentro de {product.guarantee} dias você sentir que o programa não é para você, basta enviar um e-mail e devolvemos 100% do seu investimento. Sem perguntas.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="font-display text-2xl text-center mb-10">Perguntas frequentes</h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="glass rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <span className="text-sm font-medium">{faq.q}</span>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="font-display text-3xl mb-4">Pronto para transformar suas vendas?</h2>
        <p className="text-muted-foreground mb-8">Comece agora e tenha acesso imediato ao programa completo.</p>
        <div className="glass rounded-2xl p-8 max-w-md mx-auto">
          <div className="flex items-baseline justify-center gap-3 mb-2">
            <span className="font-mono text-4xl font-bold text-[#F59E0B]">R$ {product.price}</span>
            <span className="font-mono text-lg text-muted-foreground line-through">R$ {product.originalPrice}</span>
          </div>
          <p className="text-xs text-muted-foreground mb-5">ou {product.installments}</p>
          <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-4 text-base font-semibold glow-primary transition-all">
            Quero me inscrever agora
          </button>
        </div>
      </section>
    </div>
  );
};

export default ProductSalesPage;
