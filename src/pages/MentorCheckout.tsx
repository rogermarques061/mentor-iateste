import { useState } from "react";
import {
  CreditCard, Plus, Eye, Copy, Pause, Play, MoreHorizontal, ShoppingCart,
  TrendingUp, TrendingDown, Percent, ArrowRight, Check, Image, Type,
  Users, Star, Shield, Settings, Rocket, Upload, Trash2, GripVertical,
  Smartphone, FileText, ChevronDown, BarChart3, Target, Clock,
  MessageSquare, X, ChevronRight, Palette, Layout, Award
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

/* ── mock data ── */
const existingCheckouts = [
  {
    id: "1", name: "Mentoria PATRON", status: "active", type: "Pagamento único",
    price: 997, views: 2340, conversion: 24.7, sales: 578, revenue: 576366,
    thumb: null,
  },
  {
    id: "2", name: "Curso Identidade Restaurada", status: "active", type: "Pagamento único",
    price: 199, views: 4120, conversion: 12.1, sales: 499, revenue: 99301,
    thumb: null,
  },
  {
    id: "3", name: "Imersão Presencial SP", status: "draft", type: "Pagamento único",
    price: 1990, views: 0, conversion: 0, sales: 0, revenue: 0,
    thumb: null,
  },
];

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: "Ativo", color: "#34D399", bg: "rgba(52,211,153,0.15)" },
  draft: { label: "Rascunho", color: "#FBBF24", bg: "rgba(251,191,36,0.15)" },
  paused: { label: "Pausado", color: "#9B9AA8", bg: "rgba(155,154,168,0.15)" },
  archived: { label: "Arquivado", color: "#5C5B6B", bg: "rgba(91,90,107,0.15)" },
};

/* ── funnel data ── */
const funnelSteps = [
  { label: "Visitantes", value: 1000, pct: 100 },
  { label: "Rolaram até o form", value: 850, pct: 85 },
  { label: "Abriram o form", value: 600, pct: 60 },
  { label: "Preencheram dados", value: 480, pct: 48 },
  { label: "Selecionaram pagamento", value: 380, pct: 38 },
  { label: "Clicaram finalizar", value: 310, pct: 31 },
  { label: "Pagamento confirmado", value: 247, pct: 24.7 },
];

/* ── benefits default ── */
const defaultBenefits = [
  "Acesso vitalício a todo conteúdo",
  "Suporte direto com o mentor",
  "Certificado de conclusão",
  "Comunidade exclusiva",
];

const defaultFaq = [
  { q: "Quanto tempo tenho de acesso?", a: "Acesso vitalício. Você pode assistir quando quiser, quantas vezes quiser." },
  { q: "Tem garantia?", a: "Sim! Garantia incondicional de 7 dias. Se não gostar, devolvemos 100% do valor." },
  { q: "Como funciona o suporte?", a: "Você terá acesso direto ao mentor por comentários nas aulas e grupo exclusivo." },
];

const defaultTestimonials = [
  { name: "Maria Silva", role: "Empreendedora", text: "Transformou meu negócio completamente. Em 3 meses dobrei meu faturamento.", rating: 5 },
  { name: "Pedro Santos", role: "Vendedor", text: "O melhor investimento que fiz. Conteúdo prático e direto ao ponto.", rating: 5 },
  { name: "Ana Costa", role: "Consultora", text: "Recomendo para qualquer profissional que quer elevar seu nível.", rating: 5 },
];

const MentorCheckout = () => {
  const [view, setView] = useState<"list" | "editor" | "analytics">("list");
  const [editorStep, setEditorStep] = useState(0);
  const [selectedCheckout, setSelectedCheckout] = useState<string | null>(null);

  /* editor state */
  const [productName, setProductName] = useState("Mentoria PATRON");
  const [productDesc, setProductDesc] = useState("O programa definitivo para vendedores de alto ticket");
  const [price, setPrice] = useState("997");
  const [originalPrice, setOriginalPrice] = useState("1497");
  const [guarantee, setGuarantee] = useState(7);
  const [paymentType, setPaymentType] = useState<"single" | "recurring">("single");
  const [installments, setInstallments] = useState(true);
  const [maxInstallments, setMaxInstallments] = useState(12);
  const [accentColor, setAccentColor] = useState("#8B5CF6");
  const [theme, setTheme] = useState<"dark" | "light" | "custom">("dark");
  const [buttonStyle, setButtonStyle] = useState<"default" | "rounded" | "square">("default");
  const [headline, setHeadline] = useState("Transforme sua carreira em 90 dias");
  const [subheadline, setSubheadline] = useState("O método comprovado que já ajudou +500 profissionais a triplicar seus resultados");
  const [ctaText, setCtaText] = useState("Quero começar agora");
  const [showCountdown, setShowCountdown] = useState(false);
  const [showVagas, setShowVagas] = useState(false);
  const [vagas, setVagas] = useState("30");
  const [sections, setSections] = useState({
    paraQuem: true, beneficios: true, conteudo: true, mentor: true, garantia: true, faq: true, depoimentos: true,
  });

  const steps = [
    { icon: ShoppingCart, label: "Produto e Preço" },
    { icon: Palette, label: "Visual" },
    { icon: Layout, label: "Conteúdo" },
    { icon: Star, label: "Depoimentos" },
    { icon: CreditCard, label: "Pagamento" },
    { icon: Rocket, label: "Pós-compra" },
    { icon: Check, label: "Publicar" },
  ];

  const formatCurrency = (v: number) =>
    `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

  /* ── LIST VIEW ── */
  if (view === "list") {
    return (
      <div className="space-y-8 max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl mb-1">Checkout</h1>
            <p className="text-sm text-muted-foreground">
              {existingCheckouts.length} checkouts criados · {existingCheckouts.filter(c => c.status === "active").length} ativos
            </p>
          </div>
          <button
            onClick={() => { setView("editor"); setEditorStep(0); }}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-5 py-2.5 text-sm font-medium glow-primary transition-all flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Criar checkout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {existingCheckouts.map((ck, i) => {
            const st = statusMap[ck.status];
            return (
              <div
                key={ck.id}
                className="glass rounded-2xl overflow-hidden card-hover animate-fade-slide-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* thumb */}
                <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative">
                  <ShoppingCart className="h-8 w-8 text-primary/30" />
                  <div
                    className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-medium"
                    style={{ background: st.bg, color: st.color, border: `1px solid ${st.color}30` }}
                  >
                    {st.label}
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="font-display text-base font-semibold">{ck.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full glass mt-1 inline-block text-muted-foreground">
                      {ck.type}
                    </span>
                  </div>

                  <div className="font-mono text-xl font-bold text-[#F59E0B]">
                    {formatCurrency(ck.price)}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div className="glass rounded-lg p-2 text-center">
                      <div className="font-mono font-semibold text-sm">{ck.views.toLocaleString()}</div>
                      <div className="text-muted-foreground">Acessos</div>
                    </div>
                    <div className="glass rounded-lg p-2 text-center">
                      <div className="font-mono font-semibold text-sm">{ck.conversion}%</div>
                      <div className="text-muted-foreground">Conversão</div>
                    </div>
                    <div className="glass rounded-lg p-2 text-center">
                      <div className="font-mono font-semibold text-sm">{ck.sales}</div>
                      <div className="text-muted-foreground">Vendas</div>
                    </div>
                    <div className="glass rounded-lg p-2 text-center">
                      <div className="font-mono font-semibold text-sm text-[#F59E0B]">{formatCurrency(ck.revenue)}</div>
                      <div className="text-muted-foreground">Faturamento</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => { setSelectedCheckout(ck.id); setView("editor"); }}
                      className="flex-1 glass rounded-xl py-2 text-xs hover:bg-primary/15 text-primary transition-all"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => { setSelectedCheckout(ck.id); setView("analytics"); }}
                      className="flex-1 glass rounded-xl py-2 text-xs hover:bg-[rgba(255,255,255,0.06)] transition-all"
                    >
                      Analytics
                    </button>
                    <button className="glass rounded-xl px-3 py-2 text-xs hover:bg-[rgba(255,255,255,0.06)] transition-all">
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button className="glass rounded-xl px-3 py-2 text-xs hover:bg-[rgba(255,255,255,0.06)] transition-all">
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ── ANALYTICS VIEW ── */
  if (view === "analytics") {
    return (
      <div className="space-y-8 max-w-6xl">
        <div className="flex items-center gap-3">
          <button onClick={() => setView("list")} className="glass rounded-xl px-3 py-2 text-xs hover:bg-[rgba(255,255,255,0.06)] transition-all">
            ← Voltar
          </button>
          <div>
            <h1 className="font-display text-2xl mb-1">Analytics — Mentoria PATRON</h1>
            <p className="text-sm text-muted-foreground">Performance detalhada do checkout</p>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Acessos", value: "2.340", icon: Eye, color: "#60A5FA" },
            { label: "Checkouts iniciados", value: "1.200", icon: ShoppingCart, color: "#A78BFA" },
            { label: "Vendas", value: "578", icon: Check, color: "#34D399" },
            { label: "Faturamento", value: "R$ 576K", icon: TrendingUp, color: "#F59E0B" },
            { label: "Abandono", value: "51.8%", icon: TrendingDown, color: "#F87171" },
            { label: "Ticket médio", value: "R$ 997", icon: Target, color: "#F59E0B" },
          ].map((kpi, i) => (
            <div key={i} className="glass rounded-xl p-4 animate-fade-slide-in" style={{ animationDelay: `${i * 50}ms` }}>
              <kpi.icon className="h-4 w-4 text-muted-foreground mb-3" strokeWidth={1.5} />
              <div className="font-mono text-lg font-medium" style={{ color: kpi.color }}>{kpi.value}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Funnel */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-sm mb-6">Funil de Conversão</h3>
          <div className="space-y-3">
            {funnelSteps.map((step, i) => (
              <div key={i} className="animate-fade-slide-in" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">{step.label}</span>
                  <span className="font-mono">
                    {step.value.toLocaleString()} <span className="text-muted-foreground">({step.pct}%)</span>
                  </span>
                </div>
                <div className="h-7 rounded-lg overflow-hidden glass">
                  <div
                    className="h-full rounded-lg transition-all duration-700 ease-out"
                    style={{
                      width: `${step.pct}%`,
                      background: `linear-gradient(90deg, rgba(139,92,246,${0.15 + (step.pct / 100) * 0.4}), rgba(139,92,246,${0.1 + (step.pct / 100) * 0.25}))`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment + Installment breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-6">
            <h3 className="font-semibold text-sm mb-4">Método de Pagamento</h3>
            <div className="space-y-3">
              {[
                { method: "PIX", pct: 52, amount: "R$ 299.7K", icon: Smartphone, color: "#34D399" },
                { method: "Cartão", pct: 41, amount: "R$ 236.3K", icon: CreditCard, color: "#8B5CF6" },
                { method: "Boleto", pct: 7, amount: "R$ 40.3K", icon: FileText, color: "#FBBF24" },
              ].map((m, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${m.color}15` }}>
                    <m.icon className="h-4 w-4" style={{ color: m.color }} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>{m.method}</span>
                      <span className="font-mono text-muted-foreground">{m.pct}% · {m.amount}</span>
                    </div>
                    <div className="h-1.5 rounded-full glass overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${m.pct}%`, background: m.color }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="font-semibold text-sm mb-4">Parcelas</h3>
            <div className="space-y-2">
              {[
                { parcela: "1x à vista", qty: 89, pct: 36, revenue: "R$ 88.8K" },
                { parcela: "6x sem juros", qty: 112, pct: 45, revenue: "R$ 111.6K" },
                { parcela: "12x com juros", qty: 46, pct: 19, revenue: "R$ 45.8K" },
              ].map((p, i) => (
                <div key={i} className="glass rounded-xl p-3 flex items-center justify-between text-xs">
                  <span>{p.parcela}</span>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <span>{p.qty} vendas ({p.pct}%)</span>
                    <span className="font-mono text-[#F59E0B]">{p.revenue}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Behavior heatmap */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-sm mb-4">Insights de Comportamento</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { text: "A maioria dos usuários abandona entre CPF e Telefone", icon: Users, color: "#F87171" },
              { text: "Tempo médio na página: 3min 42s", icon: Clock, color: "#60A5FA" },
              { text: "47% dos mobile abandonam vs. 22% desktop", icon: Smartphone, color: "#FBBF24" },
              { text: "PIX converte 2.3x mais que cartão", icon: TrendingUp, color: "#34D399" },
            ].map((ins, i) => (
              <div key={i} className="glass rounded-xl p-4 flex items-start gap-3 text-xs">
                <ins.icon className="h-4 w-4 shrink-0 mt-0.5" style={{ color: ins.color }} strokeWidth={1.5} />
                <span className="text-muted-foreground">{ins.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── EDITOR VIEW ── */
  return (
    <div className="flex h-[calc(100vh-2rem)] max-h-[calc(100vh-2rem)] -m-4">
      {/* Sidebar Steps */}
      <div className="w-72 shrink-0 glass border-r border-[rgba(255,255,255,0.05)] flex flex-col">
        <div className="p-4 border-b border-[rgba(255,255,255,0.05)]">
          <button onClick={() => setView("list")} className="text-xs text-muted-foreground hover:text-foreground transition-all mb-3 flex items-center gap-1">
            ← Voltar
          </button>
          <input
            value={productName}
            onChange={e => setProductName(e.target.value)}
            className="font-display text-lg bg-transparent border-none focus:outline-none w-full"
          />
          <div className="text-[10px] text-muted-foreground mt-1">Rascunho · 42% completo</div>
          <div className="h-1 rounded-full glass mt-2 overflow-hidden">
            <div className="h-full rounded-full bg-primary/60 w-[42%] transition-all" />
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {steps.map((s, i) => (
            <button
              key={i}
              onClick={() => setEditorStep(i)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                editorStep === i
                  ? "bg-[rgba(139,92,246,0.12)] border-l-[3px] border-l-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-[rgba(255,255,255,0.03)]"
              }`}
            >
              <s.icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
              <span>{s.label}</span>
              {i < editorStep && <Check className="h-3.5 w-3.5 ml-auto text-success" />}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-[rgba(255,255,255,0.05)] space-y-2">
          <button className="w-full glass rounded-xl py-2.5 text-xs hover:bg-[rgba(255,255,255,0.06)] transition-all">
            Salvar rascunho
          </button>
          <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-2.5 text-xs font-medium glow-primary transition-all">
            Publicar checkout
          </button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-6 space-y-6">

          {/* STEP 0 — Produto e Preço */}
          {editorStep === 0 && (
            <div className="space-y-6 animate-fade-slide-in">
              <h2 className="font-display text-xl">Produto e Preço</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Nome do produto *</label>
                  <input
                    value={productName}
                    onChange={e => setProductName(e.target.value)}
                    placeholder="Ex: Mentoria Identidade Restaurada"
                    className="w-full glass rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                  <div className="text-[10px] text-muted-foreground text-right mt-1">{productName.length}/80</div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Descrição curta *</label>
                  <textarea
                    value={productDesc}
                    onChange={e => setProductDesc(e.target.value)}
                    placeholder="O que o aluno vai transformar ao entrar neste programa..."
                    className="w-full glass rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 min-h-[80px] resize-none"
                  />
                  <div className="text-[10px] text-muted-foreground text-right mt-1">{productDesc.length}/200</div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Imagem de capa</label>
                  <div className="glass rounded-xl border-2 border-dashed border-[rgba(255,255,255,0.1)] p-8 text-center hover:border-primary/30 transition-all cursor-pointer">
                    <Upload className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-xs text-muted-foreground">Arraste ou clique para fazer upload</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">JPG, PNG ou WebP · Máx. 5MB · 1200×675px</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Tipo de produto</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Curso Online", "Mentoria", "Imersão", "Bundle", "Digital", "Assinatura"].map(t => (
                      <button key={t} className="glass rounded-xl py-2.5 text-xs hover:bg-primary/15 hover:text-primary transition-all">
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="glass rounded-2xl p-5 space-y-4">
                <h3 className="font-semibold text-sm">Precificação</h3>

                <div className="flex gap-2">
                  <button
                    onClick={() => setPaymentType("single")}
                    className={`flex-1 rounded-xl py-3 text-xs font-medium transition-all ${
                      paymentType === "single" ? "bg-primary/20 text-primary border border-primary/30" : "glass"
                    }`}
                  >
                    Pagamento Único
                  </button>
                  <button
                    onClick={() => setPaymentType("recurring")}
                    className={`flex-1 rounded-xl py-3 text-xs font-medium transition-all ${
                      paymentType === "recurring" ? "bg-primary/20 text-primary border border-primary/30" : "glass"
                    }`}
                  >
                    Recorrente
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Preço (R$)</label>
                    <input
                      value={price}
                      onChange={e => setPrice(e.target.value)}
                      className="w-full glass rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono text-[#F59E0B] font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Preço original (riscado)</label>
                    <input
                      value={originalPrice}
                      onChange={e => setOriginalPrice(e.target.value)}
                      className="w-full glass rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono text-muted-foreground line-through"
                    />
                  </div>
                </div>
                {Number(originalPrice) > Number(price) && (
                  <div className="text-xs text-success flex items-center gap-1.5">
                    <Percent className="h-3 w-3" />
                    Cliente economiza {Math.round((1 - Number(price) / Number(originalPrice)) * 100)}%
                  </div>
                )}

                {/* Installments */}
                <div className="flex items-center justify-between">
                  <span className="text-xs">Habilitar parcelamento</span>
                  <button
                    onClick={() => setInstallments(!installments)}
                    className={`w-10 h-5 rounded-full transition-all ${installments ? "bg-primary" : "bg-[rgba(255,255,255,0.1)]"}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${installments ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                </div>

                {installments && (
                  <div className="glass rounded-xl p-3 space-y-2 text-xs animate-fade-slide-in">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Máx. parcelas</span>
                      <span className="font-mono">{maxInstallments}x</span>
                    </div>
                    <input
                      type="range"
                      min={2} max={12} value={maxInstallments}
                      onChange={e => setMaxInstallments(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                    <div className="font-mono text-[10px] text-muted-foreground space-y-0.5">
                      <div>1x de R$ {Number(price).toFixed(2)} (sem juros)</div>
                      <div>{maxInstallments}x de R$ {(Number(price) / maxInstallments).toFixed(2)} (sem juros)</div>
                    </div>
                  </div>
                )}

                {/* Guarantee */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Garantia</label>
                  <div className="flex gap-2">
                    {[7, 15, 30, 60].map(d => (
                      <button
                        key={d}
                        onClick={() => setGuarantee(d)}
                        className={`flex-1 rounded-xl py-2.5 text-xs font-medium transition-all ${
                          guarantee === d ? "bg-primary/20 text-primary border border-primary/30" : "glass"
                        }`}
                      >
                        {d} dias
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button onClick={() => setEditorStep(1)} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-3 text-sm font-medium glow-primary transition-all flex items-center justify-center gap-2">
                Próximo: Visual <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* STEP 1 — Personalização Visual */}
          {editorStep === 1 && (
            <div className="space-y-6 animate-fade-slide-in">
              <h2 className="font-display text-xl">Personalização Visual</h2>

              <div className="glass rounded-2xl p-5 space-y-4">
                <h3 className="font-semibold text-sm">Cor principal</h3>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={e => setAccentColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-none"
                  />
                  <input
                    value={accentColor}
                    onChange={e => setAccentColor(e.target.value)}
                    className="glass rounded-xl px-3 py-2 text-xs font-mono w-28 bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                  <div className="flex gap-1.5">
                    {["#8B5CF6", "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#EC4899"].map(c => (
                      <button
                        key={c}
                        onClick={() => setAccentColor(c)}
                        className={`w-6 h-6 rounded-full border-2 transition-all ${accentColor === c ? "border-white scale-110" : "border-transparent"}`}
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Tema</label>
                  <div className="flex gap-2">
                    {[
                      { id: "dark" as const, label: "Dark Premium" },
                      { id: "light" as const, label: "Light Clean" },
                      { id: "custom" as const, label: "Custom" },
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={`flex-1 rounded-xl py-2.5 text-xs font-medium transition-all ${
                          theme === t.id ? "bg-primary/20 text-primary border border-primary/30" : "glass"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Estilo do botão</label>
                  <div className="flex gap-2">
                    {[
                      { id: "default" as const, label: "Padrão", radius: "12px" },
                      { id: "rounded" as const, label: "Arredondado", radius: "999px" },
                      { id: "square" as const, label: "Quadrado", radius: "4px" },
                    ].map(b => (
                      <button
                        key={b.id}
                        onClick={() => setButtonStyle(b.id)}
                        className={`flex-1 py-2.5 text-xs font-medium transition-all ${
                          buttonStyle === b.id ? "text-primary-foreground" : "glass text-muted-foreground"
                        }`}
                        style={{
                          borderRadius: b.radius,
                          background: buttonStyle === b.id ? accentColor : undefined,
                        }}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className="glass rounded-xl p-4">
                  <p className="text-[10px] text-muted-foreground mb-2">Preview do botão</p>
                  <button
                    className="w-full py-3.5 text-sm font-semibold text-white transition-all"
                    style={{
                      background: accentColor,
                      borderRadius: buttonStyle === "rounded" ? "999px" : buttonStyle === "square" ? "4px" : "12px",
                      boxShadow: `0 0 20px ${accentColor}40`,
                    }}
                  >
                    {ctaText || "Quero começar agora"}
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setEditorStep(0)} className="flex-1 glass rounded-xl py-3 text-sm hover:bg-[rgba(255,255,255,0.06)] transition-all">
                  Voltar
                </button>
                <button onClick={() => setEditorStep(2)} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-3 text-sm font-medium glow-primary transition-all flex items-center justify-center gap-2">
                  Próximo <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — Conteúdo */}
          {editorStep === 2 && (
            <div className="space-y-6 animate-fade-slide-in">
              <h2 className="font-display text-xl">Conteúdo da Página</h2>

              {/* Hero */}
              <div className="glass rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm">Hero</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary">Obrigatório</span>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Headline principal</label>
                  <input
                    value={headline}
                    onChange={e => setHeadline(e.target.value)}
                    className="w-full glass rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 font-display"
                  />
                  <div className="text-[10px] text-muted-foreground text-right mt-1">{headline.length}/100</div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Subheadline</label>
                  <textarea
                    value={subheadline}
                    onChange={e => setSubheadline(e.target.value)}
                    className="w-full glass rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 min-h-[60px] resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Texto do botão CTA</label>
                  <input
                    value={ctaText}
                    onChange={e => setCtaText(e.target.value)}
                    className="w-full glass rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showVagas}
                      onChange={() => setShowVagas(!showVagas)}
                      className="accent-primary"
                    />
                    Contador de vagas
                  </label>
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showCountdown}
                      onChange={() => setShowCountdown(!showCountdown)}
                      className="accent-primary"
                    />
                    Countdown
                  </label>
                </div>
                {showVagas && (
                  <input
                    value={vagas}
                    onChange={e => setVagas(e.target.value)}
                    placeholder="Número de vagas"
                    className="glass rounded-xl px-4 py-2 text-xs bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono w-32"
                  />
                )}
              </div>

              {/* Toggleable sections */}
              {[
                { key: "paraQuem" as const, title: "Para quem é este produto", icon: Users },
                { key: "beneficios" as const, title: "O que você vai aprender", icon: Check },
                { key: "conteudo" as const, title: "Conteúdo do curso", icon: Layout },
                { key: "mentor" as const, title: "Sobre o mentor", icon: Award },
                { key: "garantia" as const, title: "Garantia", icon: Shield },
                { key: "faq" as const, title: "FAQ", icon: MessageSquare },
              ].map(sec => (
                <div key={sec.key} className="glass rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-4 w-4 text-muted-foreground/30 cursor-grab" />
                    <sec.icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                    <span className="text-sm">{sec.title}</span>
                  </div>
                  <button
                    onClick={() => setSections(p => ({ ...p, [sec.key]: !p[sec.key] }))}
                    className={`w-10 h-5 rounded-full transition-all ${sections[sec.key] ? "bg-primary" : "bg-[rgba(255,255,255,0.1)]"}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${sections[sec.key] ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                </div>
              ))}

              <div className="flex gap-3">
                <button onClick={() => setEditorStep(1)} className="flex-1 glass rounded-xl py-3 text-sm hover:bg-[rgba(255,255,255,0.06)] transition-all">
                  Voltar
                </button>
                <button onClick={() => setEditorStep(3)} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-3 text-sm font-medium glow-primary transition-all flex items-center justify-center gap-2">
                  Próximo <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — Depoimentos */}
          {editorStep === 3 && (
            <div className="space-y-6 animate-fade-slide-in">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl">Depoimentos</h2>
                <button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-4 py-2 text-xs font-medium glow-primary transition-all flex items-center gap-2">
                  <Plus className="h-3.5 w-3.5" /> Adicionar
                </button>
              </div>

              <div className="space-y-3">
                {defaultTestimonials.map((t, i) => (
                  <div key={i} className="glass rounded-xl p-4 flex items-start gap-4">
                    <GripVertical className="h-4 w-4 text-muted-foreground/30 cursor-grab mt-1 shrink-0" />
                    <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-xs font-medium text-primary shrink-0">
                      {t.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{t.name}</span>
                        <span className="text-[10px] text-muted-foreground">{t.role}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{t.text}</p>
                      <div className="flex gap-0.5 mt-2">
                        {Array.from({ length: t.rating }).map((_, j) => (
                          <Star key={j} className="h-3 w-3 fill-[#F59E0B] text-[#F59E0B]" />
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button className="p-1.5 hover:bg-[rgba(255,255,255,0.06)] rounded-lg transition-all">
                        <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                      <button className="p-1.5 hover:bg-destructive/15 rounded-lg transition-all">
                        <Trash2 className="h-3.5 w-3.5 text-destructive/60" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setEditorStep(2)} className="flex-1 glass rounded-xl py-3 text-sm hover:bg-[rgba(255,255,255,0.06)] transition-all">
                  Voltar
                </button>
                <button onClick={() => setEditorStep(4)} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-3 text-sm font-medium glow-primary transition-all flex items-center justify-center gap-2">
                  Próximo <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 — Configurações de Pagamento */}
          {editorStep === 4 && (
            <div className="space-y-6 animate-fade-slide-in">
              <h2 className="font-display text-xl">Configurações de Pagamento</h2>

              {/* Asaas connection */}
              <div className="glass rounded-2xl p-5 border border-[rgba(251,191,36,0.2)] space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#FBBF24]" />
                  <h3 className="text-sm font-medium text-[#FBBF24]">Conexão Asaas — Sandbox</h3>
                </div>
                <p className="text-xs text-muted-foreground">Conecte sua conta Asaas para processar pagamentos reais.</p>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">API Key (Sandbox)</label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      placeholder="$aact_YTU5YTE0..."
                      className="flex-1 glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono"
                    />
                    <button className="glass rounded-xl px-4 py-2.5 text-xs hover:bg-primary/15 text-primary transition-all">
                      Testar
                    </button>
                  </div>
                </div>
              </div>

              {/* Payment methods */}
              <div className="glass rounded-2xl p-5 space-y-4">
                <h3 className="font-semibold text-sm">Métodos aceitos</h3>
                {[
                  { label: "PIX", desc: "QR Code + copia-e-cola — confirmação instantânea", icon: Smartphone, enabled: true },
                  { label: "Cartão de Crédito", desc: "Visa, Mastercard, Elo, Amex — até 12x", icon: CreditCard, enabled: true },
                  { label: "Boleto Bancário", desc: "Compensação em até 3 dias úteis", icon: FileText, enabled: false },
                ].map((m, i) => (
                  <div key={i} className="glass rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <m.icon className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                      <div>
                        <div className="text-sm">{m.label}</div>
                        <div className="text-[10px] text-muted-foreground">{m.desc}</div>
                      </div>
                    </div>
                    <button className={`w-10 h-5 rounded-full transition-all ${m.enabled ? "bg-primary" : "bg-[rgba(255,255,255,0.1)]"}`}>
                      <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${m.enabled ? "translate-x-5" : "translate-x-0.5"}`} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Error handling */}
              <div className="glass rounded-2xl p-5 space-y-3">
                <h3 className="font-semibold text-sm">Tratamento de Erros — Asaas API</h3>
                <div className="space-y-2 text-[11px]">
                  {[
                    { code: "card_declined", msg: "Cartão recusado. Tente outro cartão ou PIX." },
                    { code: "insufficient_funds", msg: "Cartão sem limite. Tente outro método." },
                    { code: "invalid_cpf", msg: "CPF inválido. Verifique o número digitado." },
                    { code: "expired_card", msg: "Cartão vencido. Verifique a validade." },
                    { code: "api_error", msg: "Erro temporário. Tente novamente." },
                  ].map((e, i) => (
                    <div key={i} className="glass rounded-lg p-3 flex items-center gap-3">
                      <code className="font-mono text-[10px] text-destructive/70 shrink-0">{e.code}</code>
                      <span className="text-muted-foreground">{e.msg}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setEditorStep(3)} className="flex-1 glass rounded-xl py-3 text-sm hover:bg-[rgba(255,255,255,0.06)] transition-all">
                  Voltar
                </button>
                <button onClick={() => setEditorStep(5)} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-3 text-sm font-medium glow-primary transition-all flex items-center justify-center gap-2">
                  Próximo <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5 — Pós-compra */}
          {editorStep === 5 && (
            <div className="space-y-6 animate-fade-slide-in">
              <h2 className="font-display text-xl">Pós-compra</h2>

              <div className="glass rounded-2xl p-5 space-y-4">
                <h3 className="font-semibold text-sm">Página de sucesso</h3>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Mensagem principal</label>
                  <input
                    defaultValue="Parabéns, {{nome_aluno}}! Seu acesso está liberado 🎉"
                    className="w-full glass rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>
                <div className="flex flex-wrap gap-2 text-[10px]">
                  {["{{nome_aluno}}", "{{produto}}", "{{link_acesso}}", "{{suporte}}"].map(v => (
                    <span key={v} className="px-2 py-1 rounded-lg glass font-mono text-primary cursor-pointer hover:bg-primary/15 transition-all">
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              <div className="glass rounded-2xl p-5 space-y-4">
                <h3 className="font-semibold text-sm">E-mail de boas-vindas</h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs">Enviar automaticamente</span>
                  <button className="w-10 h-5 rounded-full bg-primary transition-all">
                    <div className="w-4 h-4 rounded-full bg-white shadow translate-x-5" />
                  </button>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Assunto</label>
                  <input
                    defaultValue="Bem-vindo(a), {{nome_aluno}}! Seu acesso ao {{produto}} está pronto"
                    className="w-full glass rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div className="glass rounded-2xl p-5 space-y-4">
                <h3 className="font-semibold text-sm">Acesso ao curso</h3>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Curso vinculado</label>
                  <select className="w-full glass rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 appearance-none">
                    <option>Mentoria PATRON</option>
                    <option>Curso Identidade Restaurada</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Tipo de acesso</label>
                  <div className="flex gap-2">
                    {["Vitalício", "Por dias", "Por meses"].map(t => (
                      <button key={t} className={`flex-1 rounded-xl py-2.5 text-xs transition-all ${t === "Vitalício" ? "bg-primary/20 text-primary border border-primary/30" : "glass"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setEditorStep(4)} className="flex-1 glass rounded-xl py-3 text-sm hover:bg-[rgba(255,255,255,0.06)] transition-all">
                  Voltar
                </button>
                <button onClick={() => setEditorStep(6)} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-3 text-sm font-medium glow-primary transition-all flex items-center justify-center gap-2">
                  Próximo <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 6 — Publicar */}
          {editorStep === 6 && (
            <div className="space-y-6 animate-fade-slide-in">
              <h2 className="font-display text-xl">Publicar Checkout</h2>

              <div className="glass rounded-2xl p-5 space-y-4">
                <h3 className="font-semibold text-sm">Checklist de publicação</h3>
                {[
                  { text: "Nome do produto preenchido", done: !!productName },
                  { text: "Preço configurado", done: !!price },
                  { text: "Headline do checkout", done: !!headline },
                  { text: "Texto do botão CTA", done: !!ctaText },
                  { text: "Método de pagamento configurado", done: true },
                  { text: "Imagem de capa (opcional)", done: false, optional: true },
                  { text: "Depoimentos adicionados (opcional)", done: true, optional: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      item.done ? "bg-success/15 text-success" : item.optional ? "glass text-muted-foreground" : "bg-destructive/15 text-destructive"
                    }`}>
                      {item.done ? <Check className="h-3 w-3" /> : <span className="text-[10px]">–</span>}
                    </div>
                    <span className={item.done ? "" : item.optional ? "text-muted-foreground" : "text-destructive/80"}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="glass rounded-2xl p-5 space-y-3">
                <h3 className="font-semibold text-sm">Link de venda</h3>
                <div className="glass rounded-xl p-3 flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground flex-1 truncate">
                    plataforma.com/p/{productName.toLowerCase().replace(/\s+/g, "-")}
                  </span>
                  <button className="shrink-0 p-2 hover:bg-[rgba(255,255,255,0.06)] rounded-lg transition-all">
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <button
                onClick={() => setView("list")}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-4 text-base font-semibold glow-primary transition-all flex items-center justify-center gap-2"
              >
                <Rocket className="h-5 w-5" /> Publicar checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorCheckout;
