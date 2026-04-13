import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard, Plus, Eye, Copy, Pause, Play, MoreHorizontal, ShoppingCart,
  TrendingUp, TrendingDown, Percent, ArrowRight, Check, Users, Star, Shield,
  Rocket, Upload, Trash2, GripVertical, Smartphone, FileText, ChevronDown,
  BarChart3, Target, Clock, MessageSquare, X, Palette, Layout, Award
} from "lucide-react";
import { usePlatform, formatCurrency } from "@/contexts/PlatformContext";
import type { CheckoutProduct } from "@/contexts/PlatformContext";

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
  published: { label: "Ativo", color: "#34D399", bg: "rgba(52,211,153,0.15)" },
  draft: { label: "Rascunho", color: "#FBBF24", bg: "rgba(251,191,36,0.15)" },
  paused: { label: "Pausado", color: "#9B9AA8", bg: "rgba(155,154,168,0.15)" },
  archived: { label: "Arquivado", color: "#5C5B6B", bg: "rgba(91,90,107,0.15)" },
};

const funnelSteps = [
  { label: "Visitantes", value: 1000, pct: 100 },
  { label: "Rolaram até o form", value: 850, pct: 85 },
  { label: "Abriram o form", value: 600, pct: 60 },
  { label: "Preencheram dados", value: 480, pct: 48 },
  { label: "Selecionaram pagamento", value: 380, pct: 38 },
  { label: "Clicaram finalizar", value: 310, pct: 31 },
  { label: "Pagamento confirmado", value: 247, pct: 24.7 },
];

const defaultTestimonials = [
  { name: "Maria Silva", role: "Empreendedora", text: "Transformou meu negócio completamente. Em 3 meses dobrei meu faturamento.", rating: 5 },
  { name: "Pedro Santos", role: "Vendedor", text: "O melhor investimento que fiz. Conteúdo prático e direto ao ponto.", rating: 5 },
  { name: "Ana Costa", role: "Consultora", text: "Recomendo para qualquer profissional que quer elevar seu nível.", rating: 5 },
];

const defaultFaq = [
  { q: "Quanto tempo tenho de acesso?", a: "Acesso vitalício. Você pode assistir quando quiser, quantas vezes quiser." },
  { q: "Tem garantia?", a: "Sim! Garantia incondicional de 7 dias. Se não gostar, devolvemos 100% do valor." },
  { q: "Como funciona o suporte?", a: "Você terá acesso direto ao mentor por comentários nas aulas e grupo exclusivo." },
];

const MentorCheckout = () => {
  const navigate = useNavigate();
  const { state, createCheckout, updateCheckout, publishCheckout } = usePlatform();
  const products = state.products;

  const [view, setView] = useState<"list" | "editor" | "analytics">("list");
  const [editorStep, setEditorStep] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [analyticsId, setAnalyticsId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [justPublished, setJustPublished] = useState<string | null>(null);

  /* editor state */
  const [productName, setProductName] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [price, setPrice] = useState("997");
  const [originalPrice, setOriginalPrice] = useState("1497");
  const [guarantee, setGuarantee] = useState(7);
  const [paymentType, setPaymentType] = useState<"single" | "recurring">("single");
  const [installments, setInstallments] = useState(true);
  const [maxInstallments, setMaxInstallments] = useState(12);
  const [accentColor, setAccentColor] = useState("#8B5CF6");
  const [buttonStyle, setButtonStyle] = useState<"default" | "rounded" | "square">("default");
  const [headline, setHeadline] = useState("");
  const [subheadline, setSubheadline] = useState("");
  const [ctaText, setCtaText] = useState("Quero começar agora");
  const [showCountdown, setShowCountdown] = useState(false);
  const [showVagas, setShowVagas] = useState(false);
  const [vagas, setVagas] = useState("30");
  const [linkedCourseId, setLinkedCourseId] = useState<string | null>(null);
  const [productType, setProductType] = useState("Curso Online");
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

  const loadEditorFromProduct = (p: CheckoutProduct) => {
    setProductName(p.name);
    setProductDesc(p.description);
    setPrice(String(p.price));
    setOriginalPrice(String(p.originalPrice));
    setGuarantee(p.guarantee);
    setPaymentType(p.paymentType);
    setInstallments(p.installments);
    setMaxInstallments(p.maxInstallments);
    setAccentColor(p.accentColor);
    setHeadline(p.headline);
    setSubheadline(p.subheadline);
    setCtaText(p.ctaText);
    setLinkedCourseId(p.linkedCourseId);
    setProductType(p.type);
    setSections(p.sections as any);
  };

  const getEditorData = (): Partial<CheckoutProduct> => ({
    name: productName,
    description: productDesc,
    headline,
    subheadline,
    ctaText,
    price: Number(price) || 0,
    originalPrice: Number(originalPrice) || 0,
    guarantee,
    accentColor,
    type: productType,
    linkedCourseId,
    paymentType,
    installments,
    maxInstallments,
    sections: sections as any,
    testimonials: defaultTestimonials,
    faq: defaultFaq,
    benefits: ["Acesso vitalício a todo conteúdo", "Suporte direto com o mentor", "Certificado de conclusão", "Comunidade exclusiva"],
  });

  const handleCreateNew = () => {
    setProductName("Novo Checkout");
    setProductDesc("");
    setPrice("997");
    setOriginalPrice("1497");
    setGuarantee(7);
    setHeadline("Transforme sua carreira em 90 dias");
    setSubheadline("O método comprovado que já ajudou centenas de profissionais");
    setCtaText("Quero começar agora");
    setLinkedCourseId(state.courses[0]?.id || null);
    setProductType("Curso Online");
    setEditingId(null);
    setEditorStep(0);
    setView("editor");
  };

  const handleEditExisting = (p: CheckoutProduct) => {
    loadEditorFromProduct(p);
    setEditingId(p.id);
    setEditorStep(0);
    setView("editor");
  };

  const handleSaveDraft = () => {
    const data = getEditorData();
    if (editingId) {
      updateCheckout(editingId, data);
    } else {
      const created = createCheckout(data);
      setEditingId(created.id);
    }
  };

  const handlePublish = () => {
    let id = editingId;
    if (!id) {
      const created = createCheckout(getEditorData());
      id = created.id;
      setEditingId(id);
    } else {
      updateCheckout(id, getEditorData());
    }
    const url = publishCheckout(id);
    setJustPublished(url);
  };

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/checkout/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(slug);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleViewCheckout = (slug: string) => {
    window.open(`/checkout/${slug}`, "_blank");
  };

  const editingProduct = editingId ? products.find(p => p.id === editingId) : null;
  const completionPct = [productName, price, headline, ctaText].filter(Boolean).length / 4 * 100;

  /* ── LIST VIEW ── */
  if (view === "list") {
    const published = products.filter(p => p.status === "published");
    return (
      <div className="space-y-8 max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl mb-1">Checkout</h1>
            <p className="text-sm text-muted-foreground">
              {products.length} checkouts criados · {published.length} ativos
            </p>
          </div>
          <button
            onClick={handleCreateNew}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-5 py-2.5 text-sm font-medium glow-primary transition-all flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Criar checkout
          </button>
        </div>

        {products.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center animate-fade-slide-in">
            <ShoppingCart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="font-display text-xl mb-2">Nenhum checkout criado ainda</h2>
            <p className="text-sm text-muted-foreground mb-6">Crie seu primeiro checkout em minutos e comece a vender.</p>
            <button
              onClick={handleCreateNew}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 py-3 text-sm font-medium glow-primary transition-all"
            >
              Criar meu primeiro checkout
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {products.map((ck, i) => {
              const st = statusMap[ck.status] || statusMap.draft;
              return (
                <div
                  key={ck.id}
                  className="glass rounded-2xl overflow-hidden card-hover animate-fade-slide-in"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
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
                        <div className="font-mono font-semibold text-sm">{ck.analytics.visits.toLocaleString()}</div>
                        <div className="text-muted-foreground">Acessos</div>
                      </div>
                      <div className="glass rounded-lg p-2 text-center">
                        <div className="font-mono font-semibold text-sm">{ck.analytics.conversionRate}%</div>
                        <div className="text-muted-foreground">Conversão</div>
                      </div>
                      <div className="glass rounded-lg p-2 text-center">
                        <div className="font-mono font-semibold text-sm">{ck.analytics.sales}</div>
                        <div className="text-muted-foreground">Vendas</div>
                      </div>
                      <div className="glass rounded-lg p-2 text-center">
                        <div className="font-mono font-semibold text-sm text-[#F59E0B]">{formatCurrency(ck.analytics.revenue)}</div>
                        <div className="text-muted-foreground">Faturamento</div>
                      </div>
                    </div>

                    {/* Checkout URL */}
                    {ck.status === "published" && (
                      <div className="glass rounded-lg p-2 flex items-center gap-2">
                        <span className="font-mono text-[10px] text-muted-foreground truncate flex-1">
                          /checkout/{ck.slug}
                        </span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditExisting(ck)}
                        className="flex-1 glass rounded-xl py-2 text-xs hover:bg-primary/15 text-primary transition-all"
                      >
                        Editar
                      </button>
                      {ck.status === "published" && (
                        <button
                          onClick={() => handleViewCheckout(ck.slug)}
                          className="flex-1 glass rounded-xl py-2 text-xs hover:bg-[rgba(52,211,153,0.1)] text-[#34D399] transition-all flex items-center justify-center gap-1"
                        >
                          <Eye className="h-3 w-3" /> Ver
                        </button>
                      )}
                      <button
                        onClick={() => handleCopyLink(ck.slug)}
                        className="glass rounded-xl px-3 py-2 text-xs hover:bg-[rgba(255,255,255,0.06)] transition-all"
                        title="Copiar link"
                      >
                        {copiedId === ck.slug ? <Check className="h-3.5 w-3.5 text-[#34D399]" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                      <button
                        onClick={() => { setAnalyticsId(ck.id); setView("analytics"); }}
                        className="glass rounded-xl px-3 py-2 text-xs hover:bg-[rgba(255,255,255,0.06)] transition-all"
                        title="Analytics"
                      >
                        <BarChart3 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  /* ── ANALYTICS VIEW ── */
  if (view === "analytics") {
    const product = products.find(p => p.id === analyticsId) || products[0];
    if (!product) return <div className="text-muted-foreground text-center py-20">Nenhum checkout para analisar.</div>;
    const an = product.analytics;
    return (
      <div className="space-y-8 max-w-6xl">
        <div className="flex items-center gap-3">
          <button onClick={() => setView("list")} className="glass rounded-xl px-3 py-2 text-xs hover:bg-[rgba(255,255,255,0.06)] transition-all">← Voltar</button>
          <div>
            <h1 className="font-display text-2xl mb-1">Analytics — {product.name}</h1>
            <p className="text-sm text-muted-foreground">Performance detalhada do checkout</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Acessos", value: an.visits.toLocaleString(), icon: Eye, color: "#60A5FA" },
            { label: "Checkouts iniciados", value: an.checkoutsStarted.toLocaleString(), icon: ShoppingCart, color: "#A78BFA" },
            { label: "Vendas", value: String(an.sales), icon: Check, color: "#34D399" },
            { label: "Faturamento", value: formatCurrency(an.revenue), icon: TrendingUp, color: "#F59E0B" },
            { label: "Abandono", value: an.checkoutsStarted ? `${(100 - an.conversionRate).toFixed(1)}%` : "0%", icon: TrendingDown, color: "#F87171" },
            { label: "Ticket médio", value: an.sales ? formatCurrency(an.revenue / an.sales) : "R$ 0", icon: Target, color: "#F59E0B" },
          ].map((kpi, i) => (
            <div key={i} className="glass rounded-xl p-4 animate-fade-slide-in" style={{ animationDelay: `${i * 50}ms` }}>
              <kpi.icon className="h-4 w-4 text-muted-foreground mb-3" strokeWidth={1.5} />
              <div className="font-mono text-lg font-medium" style={{ color: kpi.color }}>{kpi.value}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{kpi.label}</div>
            </div>
          ))}
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-sm mb-6">Funil de Conversão</h3>
          <div className="space-y-3">
            {funnelSteps.map((step, i) => (
              <div key={i} className="animate-fade-slide-in" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">{step.label}</span>
                  <span className="font-mono">{step.value.toLocaleString()} <span className="text-muted-foreground">({step.pct}%)</span></span>
                </div>
                <div className="h-7 rounded-lg overflow-hidden glass">
                  <div className="h-full rounded-lg transition-all duration-700 ease-out"
                    style={{ width: `${step.pct}%`, background: `linear-gradient(90deg, rgba(139,92,246,${0.15 + (step.pct / 100) * 0.4}), rgba(139,92,246,${0.1 + (step.pct / 100) * 0.25}))` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-6">
            <h3 className="font-semibold text-sm mb-4">Método de Pagamento</h3>
            <div className="space-y-3">
              {[
                { method: "PIX", pct: 52, icon: Smartphone, color: "#34D399" },
                { method: "Cartão", pct: 41, icon: CreditCard, color: "#8B5CF6" },
                { method: "Boleto", pct: 7, icon: FileText, color: "#FBBF24" },
              ].map((m, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${m.color}15` }}>
                    <m.icon className="h-4 w-4" style={{ color: m.color }} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>{m.method}</span>
                      <span className="font-mono text-muted-foreground">{m.pct}%</span>
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
            <h3 className="font-semibold text-sm mb-4">Insights</h3>
            <div className="space-y-2">
              {[
                { text: "Maioria abandona entre CPF e Telefone", icon: Users, color: "#F87171" },
                { text: "Tempo médio na página: 3min 42s", icon: Clock, color: "#60A5FA" },
                { text: "47% mobile abandonam vs. 22% desktop", icon: Smartphone, color: "#FBBF24" },
                { text: "PIX converte 2.3x mais que cartão", icon: TrendingUp, color: "#34D399" },
              ].map((ins, i) => (
                <div key={i} className="glass rounded-xl p-3 flex items-start gap-3 text-xs">
                  <ins.icon className="h-4 w-4 shrink-0 mt-0.5" style={{ color: ins.color }} strokeWidth={1.5} />
                  <span className="text-muted-foreground">{ins.text}</span>
                </div>
              ))}
            </div>
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
          <button onClick={() => setView("list")} className="text-xs text-muted-foreground hover:text-foreground transition-all mb-3 flex items-center gap-1">← Voltar</button>
          <input value={productName} onChange={e => setProductName(e.target.value)} className="font-display text-lg bg-transparent border-none focus:outline-none w-full" />
          <div className="text-[10px] text-muted-foreground mt-1">{editingProduct?.status === "published" ? "Publicado" : "Rascunho"} · {Math.round(completionPct)}% completo</div>
          <div className="h-1 rounded-full glass mt-2 overflow-hidden">
            <div className="h-full rounded-full bg-primary/60 transition-all" style={{ width: `${completionPct}%` }} />
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {steps.map((s, i) => (
            <button key={i} onClick={() => setEditorStep(i)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                editorStep === i ? "bg-[rgba(139,92,246,0.12)] border-l-[3px] border-l-primary text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-[rgba(255,255,255,0.03)]"
              }`}>
              <s.icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
              <span>{s.label}</span>
              {i < editorStep && <Check className="h-3.5 w-3.5 ml-auto text-success" />}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-[rgba(255,255,255,0.05)] space-y-2">
          <button onClick={handleSaveDraft} className="w-full glass rounded-xl py-2.5 text-xs hover:bg-[rgba(255,255,255,0.06)] transition-all">
            Salvar rascunho
          </button>
          <button onClick={handlePublish} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-2.5 text-xs font-medium glow-primary transition-all">
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
                  <input value={productName} onChange={e => setProductName(e.target.value)} placeholder="Ex: Mentoria Identidade Restaurada"
                    className="w-full glass rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50" />
                  <div className="text-[10px] text-muted-foreground text-right mt-1">{productName.length}/80</div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Descrição curta *</label>
                  <textarea value={productDesc} onChange={e => setProductDesc(e.target.value)} placeholder="O que o aluno vai transformar..."
                    className="w-full glass rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 min-h-[80px] resize-none" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Tipo de produto</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Curso Online", "Mentoria", "Imersão", "Bundle", "Digital", "Assinatura"].map(t => (
                      <button key={t} onClick={() => setProductType(t)}
                        className={`glass rounded-xl py-2.5 text-xs transition-all ${productType === t ? "bg-primary/20 text-primary border border-primary/30" : "hover:bg-primary/15 hover:text-primary"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Curso vinculado</label>
                  <select value={linkedCourseId || ""} onChange={e => setLinkedCourseId(e.target.value || null)}
                    className="w-full glass rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 appearance-none">
                    <option value="">Nenhum</option>
                    {state.courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </div>
              </div>

              {/* Pricing */}
              <div className="glass rounded-2xl p-5 space-y-4">
                <h3 className="font-semibold text-sm">Precificação</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Preço (R$)</label>
                    <input value={price} onChange={e => setPrice(e.target.value)}
                      className="w-full glass rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono text-[#F59E0B] font-semibold" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Preço original (riscado)</label>
                    <input value={originalPrice} onChange={e => setOriginalPrice(e.target.value)}
                      className="w-full glass rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono text-muted-foreground line-through" />
                  </div>
                </div>
                {Number(originalPrice) > Number(price) && (
                  <div className="text-xs text-success flex items-center gap-1.5">
                    <Percent className="h-3 w-3" /> Cliente economiza {Math.round((1 - Number(price) / Number(originalPrice)) * 100)}%
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs">Habilitar parcelamento</span>
                  <button onClick={() => setInstallments(!installments)} className={`w-10 h-5 rounded-full transition-all ${installments ? "bg-primary" : "bg-[rgba(255,255,255,0.1)]"}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${installments ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                </div>

                {installments && (
                  <div className="glass rounded-xl p-3 space-y-2 text-xs animate-fade-slide-in">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Máx. parcelas</span><span className="font-mono">{maxInstallments}x</span>
                    </div>
                    <input type="range" min={2} max={12} value={maxInstallments} onChange={e => setMaxInstallments(Number(e.target.value))} className="w-full accent-primary" />
                    <div className="font-mono text-[10px] text-muted-foreground space-y-0.5">
                      <div>1x de R$ {Number(price).toFixed(2)} (sem juros)</div>
                      <div>{maxInstallments}x de R$ {(Number(price) / maxInstallments).toFixed(2)} (sem juros)</div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Garantia</label>
                  <div className="flex gap-2">
                    {[7, 15, 30, 60].map(d => (
                      <button key={d} onClick={() => setGuarantee(d)}
                        className={`flex-1 rounded-xl py-2.5 text-xs font-medium transition-all ${guarantee === d ? "bg-primary/20 text-primary border border-primary/30" : "glass"}`}>
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

          {/* STEP 1 — Visual */}
          {editorStep === 1 && (
            <div className="space-y-6 animate-fade-slide-in">
              <h2 className="font-display text-xl">Personalização Visual</h2>
              <div className="glass rounded-2xl p-5 space-y-4">
                <h3 className="font-semibold text-sm">Cor principal</h3>
                <div className="flex items-center gap-3">
                  <input type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-none" />
                  <input value={accentColor} onChange={e => setAccentColor(e.target.value)} className="glass rounded-xl px-3 py-2 text-xs font-mono w-28 bg-transparent focus:outline-none" />
                  <div className="flex gap-1.5">
                    {["#8B5CF6", "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#EC4899"].map(c => (
                      <button key={c} onClick={() => setAccentColor(c)} className={`w-6 h-6 rounded-full border-2 transition-all ${accentColor === c ? "border-white scale-110" : "border-transparent"}`} style={{ background: c }} />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Estilo do botão</label>
                  <div className="flex gap-2">
                    {([{ id: "default" as const, label: "Padrão", radius: "12px" }, { id: "rounded" as const, label: "Arredondado", radius: "999px" }, { id: "square" as const, label: "Quadrado", radius: "4px" }]).map(b => (
                      <button key={b.id} onClick={() => setButtonStyle(b.id)}
                        className={`flex-1 py-2.5 text-xs font-medium transition-all ${buttonStyle === b.id ? "text-primary-foreground" : "glass text-muted-foreground"}`}
                        style={{ borderRadius: b.radius, background: buttonStyle === b.id ? accentColor : undefined }}>
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="glass rounded-xl p-4">
                  <p className="text-[10px] text-muted-foreground mb-2">Preview do botão</p>
                  <button className="w-full py-3.5 text-sm font-semibold text-white transition-all"
                    style={{ background: accentColor, borderRadius: buttonStyle === "rounded" ? "999px" : buttonStyle === "square" ? "4px" : "12px", boxShadow: `0 0 20px ${accentColor}40` }}>
                    {ctaText || "Quero começar agora"}
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setEditorStep(0)} className="flex-1 glass rounded-xl py-3 text-sm hover:bg-[rgba(255,255,255,0.06)] transition-all">Voltar</button>
                <button onClick={() => setEditorStep(2)} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-3 text-sm font-medium glow-primary transition-all flex items-center justify-center gap-2">Próximo <ArrowRight className="h-4 w-4" /></button>
              </div>
            </div>
          )}

          {/* STEP 2 — Conteúdo */}
          {editorStep === 2 && (
            <div className="space-y-6 animate-fade-slide-in">
              <h2 className="font-display text-xl">Conteúdo da Página</h2>
              <div className="glass rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm">Hero</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary">Obrigatório</span>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Headline principal</label>
                  <input value={headline} onChange={e => setHeadline(e.target.value)} className="w-full glass rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 font-display" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Subheadline</label>
                  <textarea value={subheadline} onChange={e => setSubheadline(e.target.value)} className="w-full glass rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 min-h-[60px] resize-none" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Texto do botão CTA</label>
                  <input value={ctaText} onChange={e => setCtaText(e.target.value)} className="w-full glass rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50" />
                </div>
              </div>

              {([
                { key: "paraQuem" as const, title: "Para quem é este produto", icon: Users },
                { key: "beneficios" as const, title: "O que você vai aprender", icon: Check },
                { key: "conteudo" as const, title: "Conteúdo do curso", icon: Layout },
                { key: "mentor" as const, title: "Sobre o mentor", icon: Award },
                { key: "garantia" as const, title: "Garantia", icon: Shield },
                { key: "faq" as const, title: "FAQ", icon: MessageSquare },
              ]).map(sec => (
                <div key={sec.key} className="glass rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-4 w-4 text-muted-foreground/30 cursor-grab" />
                    <sec.icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                    <span className="text-sm">{sec.title}</span>
                  </div>
                  <button onClick={() => setSections(p => ({ ...p, [sec.key]: !p[sec.key] }))}
                    className={`w-10 h-5 rounded-full transition-all ${sections[sec.key] ? "bg-primary" : "bg-[rgba(255,255,255,0.1)]"}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${sections[sec.key] ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                </div>
              ))}

              <div className="flex gap-3">
                <button onClick={() => setEditorStep(1)} className="flex-1 glass rounded-xl py-3 text-sm hover:bg-[rgba(255,255,255,0.06)] transition-all">Voltar</button>
                <button onClick={() => setEditorStep(3)} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-3 text-sm font-medium glow-primary transition-all flex items-center justify-center gap-2">Próximo <ArrowRight className="h-4 w-4" /></button>
              </div>
            </div>
          )}

          {/* STEP 3 — Depoimentos */}
          {editorStep === 3 && (
            <div className="space-y-6 animate-fade-slide-in">
              <h2 className="font-display text-xl">Depoimentos</h2>
              <div className="space-y-3">
                {defaultTestimonials.map((t, i) => (
                  <div key={i} className="glass rounded-xl p-4 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-xs font-medium text-primary shrink-0">
                      {t.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{t.name}</div>
                      <div className="text-[10px] text-muted-foreground">{t.role}</div>
                      <p className="text-xs text-muted-foreground mt-1">"{t.text}"</p>
                      <div className="flex gap-0.5 mt-1">
                        {Array.from({ length: t.rating }).map((_, j) => <Star key={j} className="h-3 w-3 fill-[#F59E0B] text-[#F59E0B]" />)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setEditorStep(2)} className="flex-1 glass rounded-xl py-3 text-sm hover:bg-[rgba(255,255,255,0.06)] transition-all">Voltar</button>
                <button onClick={() => setEditorStep(4)} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-3 text-sm font-medium glow-primary transition-all flex items-center justify-center gap-2">Próximo <ArrowRight className="h-4 w-4" /></button>
              </div>
            </div>
          )}

          {/* STEP 4 — Pagamento */}
          {editorStep === 4 && (
            <div className="space-y-6 animate-fade-slide-in">
              <h2 className="font-display text-xl">Configurações de Pagamento</h2>
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
              <div className="flex gap-3">
                <button onClick={() => setEditorStep(3)} className="flex-1 glass rounded-xl py-3 text-sm hover:bg-[rgba(255,255,255,0.06)] transition-all">Voltar</button>
                <button onClick={() => setEditorStep(5)} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-3 text-sm font-medium glow-primary transition-all flex items-center justify-center gap-2">Próximo <ArrowRight className="h-4 w-4" /></button>
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
                  <input defaultValue="Parabéns, {{nome_aluno}}! Seu acesso está liberado 🎉"
                    className="w-full glass rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50" />
                </div>
              </div>
              <div className="glass rounded-2xl p-5 space-y-4">
                <h3 className="font-semibold text-sm">Curso vinculado</h3>
                <select value={linkedCourseId || ""} onChange={e => setLinkedCourseId(e.target.value || null)}
                  className="w-full glass rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 appearance-none">
                  <option value="">Nenhum</option>
                  {state.courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setEditorStep(4)} className="flex-1 glass rounded-xl py-3 text-sm hover:bg-[rgba(255,255,255,0.06)] transition-all">Voltar</button>
                <button onClick={() => setEditorStep(6)} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-3 text-sm font-medium glow-primary transition-all flex items-center justify-center gap-2">Próximo <ArrowRight className="h-4 w-4" /></button>
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
                  { text: "Preço configurado", done: !!price && Number(price) > 0 },
                  { text: "Headline do checkout", done: !!headline },
                  { text: "Texto do botão CTA", done: !!ctaText },
                  { text: "Método de pagamento configurado", done: true },
                  { text: "Curso vinculado", done: !!linkedCourseId },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${item.done ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}>
                      {item.done ? <Check className="h-3 w-3" /> : <span className="text-[10px]">–</span>}
                    </div>
                    <span className={item.done ? "" : "text-destructive/80"}>{item.text}</span>
                  </div>
                ))}
              </div>

              {justPublished ? (
                <div className="glass rounded-2xl p-5 space-y-4 border border-[rgba(52,211,153,0.3)] animate-fade-slide-in">
                  <div className="flex items-center gap-2 text-[#34D399]">
                    <Check className="h-4 w-4" />
                    <h3 className="font-semibold text-sm">Checkout publicado com sucesso! 🚀</h3>
                  </div>
                  <div className="glass rounded-xl p-3 flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground flex-1 truncate">
                      {window.location.origin}{justPublished}
                    </span>
                    <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}${justPublished}`); }}
                      className="shrink-0 p-2 hover:bg-[rgba(255,255,255,0.06)] rounded-lg transition-all">
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => window.open(justPublished, "_blank")}
                      className="flex-1 glass rounded-xl py-3 text-sm hover:bg-[rgba(52,211,153,0.1)] text-[#34D399] transition-all flex items-center justify-center gap-2">
                      <Eye className="h-4 w-4" /> Visualizar checkout
                    </button>
                    <button onClick={() => setView("list")}
                      className="flex-1 glass rounded-xl py-3 text-sm hover:bg-[rgba(255,255,255,0.06)] transition-all">
                      Voltar à lista
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="glass rounded-2xl p-5 space-y-3">
                    <h3 className="font-semibold text-sm">Link de venda (preview)</h3>
                    <div className="glass rounded-xl p-3 flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground flex-1 truncate">
                        {window.location.origin}/checkout/{productName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "-").substring(0, 60)}
                      </span>
                    </div>
                  </div>

                  <button onClick={handlePublish}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-4 text-base font-semibold glow-primary transition-all flex items-center justify-center gap-2">
                    <Rocket className="h-5 w-5" /> Publicar checkout
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorCheckout;
