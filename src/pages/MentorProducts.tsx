import { useState } from "react";
import { toast } from "sonner";
import { Plus, Package, Eye, Copy, Share2, MoreHorizontal, Edit, Archive, TrendingUp, ShoppingCart, DollarSign, Image, Video, FileText, ChevronRight, Check, X, Upload, GripVertical } from "lucide-react";

const products = [
  {
    id: "1", name: "Programa PATRON", subtitle: "Mentoria de alto ticket para vendedores", type: "Mentoria", status: "Publicado",
    price: 997, originalPrice: 1497, sales: 34, revenue: 33966, conversion: 8.2,
    thumbnail: null, slug: "IMPLOFY-patron",
  },
  {
    id: "2", name: "Curso Identidade Restaurada", subtitle: "Descubra seu potencial interior", type: "Curso", status: "Publicado",
    price: 199, originalPrice: null, sales: 78, revenue: 15522, conversion: 12.1,
    thumbnail: null, slug: "identidade-restaurada",
  },
  {
    id: "3", name: "Bundle Premium Completo", subtitle: "Todos os cursos + IMPLOFY", type: "Bundle", status: "Rascunho",
    price: 1990, originalPrice: 2990, sales: 12, revenue: 23880, conversion: 3.4,
    thumbnail: null, slug: "bundle-premium",
  },
  {
    id: "4", name: "Imersão Presencial VIP", subtitle: "2 dias intensivos de transformação", type: "Imersão", status: "Publicado",
    price: 2497, originalPrice: null, sales: 8, revenue: 19976, conversion: 5.7,
    thumbnail: null, slug: "imersao-vip",
  },
  {
    id: "5", name: "Assinatura Mensal Comunidade", subtitle: "Acesso à comunidade e lives exclusivas", type: "Assinatura", status: "Publicado",
    price: 47, originalPrice: null, sales: 156, revenue: 7332, conversion: 18.4,
    thumbnail: null, slug: "assinatura-comunidade",
  },
];

const filters = ["Todos", "Publicados", "Rascunho", "Arquivados", "Gratuitos", "Pagos"];

function getStatusBadge(status: string) {
  if (status === "Publicado") return "bg-success/15 text-success border border-success/30";
  if (status === "Rascunho") return "bg-warning/15 text-warning border border-warning/30";
  return "bg-muted/30 text-muted-foreground border border-muted/30";
}

function getTypePill(type: string) {
  const colors: Record<string, string> = {
    Curso: "bg-primary/15 text-primary",
    Mentoria: "bg-[rgba(255,215,0,0.2)] text-[#FFD700]",
    Imersão: "bg-info/15 text-info",
    Assinatura: "bg-success/15 text-success",
    Bundle: "bg-warning/15 text-warning",
  };
  return colors[type] || "bg-muted text-muted-foreground";
}

// Editor step components
const editorSteps = [
  { id: 1, label: "Informações Básicas", icon: FileText },
  { id: 2, label: "Precificação", icon: DollarSign },
  { id: 3, label: "Conteúdo Vinculado", icon: Package },
  { id: 4, label: "Página de Vendas", icon: Eye },
  { id: 5, label: "Checkout", icon: ShoppingCart },
  { id: 6, label: "Pós-compra", icon: Check },
  { id: 7, label: "Publicar", icon: Share2 },
];

const MentorProducts = () => {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [view, setView] = useState<"list" | "editor">("list");
  const [editorStep, setEditorStep] = useState(1);

  const filteredProducts = products.filter(p => {
    if (activeFilter === "Todos") return true;
    if (activeFilter === "Publicados") return p.status === "Publicado";
    if (activeFilter === "Rascunho") return p.status === "Rascunho";
    if (activeFilter === "Pagos") return p.price > 0;
    if (activeFilter === "Gratuitos") return p.price === 0;
    return false;
  });

  if (view === "editor") {
    return (
      <div className="flex gap-6 max-w-6xl mx-auto">
        {/* Editor Sidebar */}
        <div className="w-56 shrink-0 space-y-1">
          <button onClick={() => setView("list")} className="text-xs text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1 transition-all">
            ← Voltar aos produtos
          </button>
          <h3 className="font-display text-lg mb-4">Novo Produto</h3>
          <div className="h-1.5 rounded-full bg-muted mb-4 overflow-hidden">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(editorStep / 7) * 100}%` }} />
          </div>
          {editorSteps.map(s => (
            <button key={s.id} onClick={() => setEditorStep(s.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                editorStep === s.id ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-[rgba(255,255,255,0.03)]'
              }`}>
              <s.icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
              <span>{s.label}</span>
              {editorStep > s.id && <Check className="h-3.5 w-3.5 ml-auto text-success" />}
            </button>
          ))}
        </div>

        {/* Editor Content */}
        <div className="flex-1 space-y-6">
          {editorStep === 1 && (
            <div className="space-y-6 animate-fade-slide-in">
              <div className="glass rounded-2xl p-6 space-y-5">
                <h3 className="font-semibold text-sm">Informações Básicas</h3>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Nome do produto</label>
                  <input type="text" placeholder="Ex: Mentoria Identidade Restaurada" className="w-full glass rounded-xl px-4 py-3 text-base bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 font-display" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Subtítulo / tagline</label>
                  <input type="text" placeholder="Frase curta exibida na página de vendas" className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Descrição completa</label>
                  <textarea className="w-full glass rounded-xl px-4 py-3 text-sm bg-transparent resize-none focus:outline-none focus:ring-1 focus:ring-primary/50 h-32" placeholder="Descreva o produto em detalhes..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Tipo de produto</label>
                    <select className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 appearance-none">
                      <option>Curso Online</option><option>Mentoria</option><option>Imersão Presencial</option>
                      <option>Assinatura</option><option>Bundle</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Categoria</label>
                    <select className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 appearance-none">
                      <option>Vendas</option><option>Marketing</option><option>Liderança</option><option>Desenvolvimento Pessoal</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Capa do produto</label>
                  <div className="glass rounded-xl p-8 border-dashed border-2 border-[rgba(255,255,255,0.1)] flex flex-col items-center gap-2 cursor-pointer hover:border-primary/30 transition-all">
                    <Image className="h-8 w-8 text-muted-foreground/40" strokeWidth={1.5} />
                    <span className="text-xs text-muted-foreground">1200×675px recomendado · PNG ou JPG</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Vídeo de apresentação (opcional)</label>
                  <div className="flex gap-3">
                    <input type="text" placeholder="Cole a URL do YouTube ou Vimeo" className="flex-1 glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50" />
                    <button className="glass rounded-xl px-4 py-2.5 text-xs flex items-center gap-2 hover:bg-[rgba(255,255,255,0.06)] transition-all">
                      <Upload className="h-3.5 w-3.5" /> Upload
                    </button>
                  </div>
                </div>
              </div>
              <button onClick={() => setEditorStep(2)} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-5 py-2.5 text-sm flex items-center gap-2 glow-primary transition-all ml-auto">
                Próximo <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {editorStep === 2 && (
            <div className="space-y-6 animate-fade-slide-in">
              <div className="glass rounded-2xl p-6 space-y-5">
                <h3 className="font-semibold text-sm">Precificação</h3>
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Tipo de acesso</label>
                  <div className="flex gap-2 flex-wrap">
                    {["Pago (único)", "Parcelado", "Assinatura", "Gratuito", "Pay-what-you-want"].map(t => (
                      <button key={t} className="px-3 py-1.5 rounded-xl text-xs glass hover:bg-primary/15 hover:text-primary transition-all">{t}</button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Preço original</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-mono">R$</span>
                      <input type="text" placeholder="997,00" className="w-full glass rounded-xl pl-10 pr-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Preço promocional (opcional)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-mono">R$</span>
                      <input type="text" placeholder="797,00" className="w-full glass rounded-xl pl-10 pr-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono" />
                    </div>
                  </div>
                </div>
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium">Permitir parcelamento</span>
                    <div className="w-9 h-5 rounded-full bg-primary/30 flex items-center px-0.5 cursor-pointer">
                      <div className="w-4 h-4 rounded-full bg-primary translate-x-4 transition-transform" />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1 font-mono">
                    <p>1x de R$ 997,00 (sem juros)</p>
                    <p>6x de R$ 166,17 (sem juros)</p>
                    <p>12x de R$ 89,25 (2,99% a.m.)</p>
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-6 space-y-4">
                <h3 className="font-semibold text-sm">Cupons de desconto</h3>
                <div className="flex gap-3">
                  <input type="text" placeholder="Código do cupom" className="flex-1 glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono uppercase" />
                  <input type="text" placeholder="% ou R$" className="w-24 glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono" />
                  <button className="bg-primary/20 text-primary rounded-xl px-4 py-2.5 text-xs hover:bg-primary/30 transition-all">Criar</button>
                </div>
              </div>

              <div className="glass rounded-2xl p-6 space-y-4">
                <h3 className="font-semibold text-sm">Upsell e Order Bump</h3>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Order bump (produto adicional no checkout)</label>
                  <select className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 appearance-none">
                    <option>Selecione um produto...</option>
                    {products.map(p => <option key={p.id}>{p.name} — R$ {p.price}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Upsell pós-compra</label>
                  <select className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 appearance-none">
                    <option>Selecione um produto...</option>
                    {products.map(p => <option key={p.id}>{p.name} — R$ {p.price}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button onClick={() => setEditorStep(1)} className="glass rounded-xl px-5 py-2.5 text-sm hover:bg-[rgba(255,255,255,0.06)] transition-all">Voltar</button>
                <button onClick={() => setEditorStep(3)} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-5 py-2.5 text-sm flex items-center gap-2 glow-primary transition-all">
                  Próximo <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {editorStep === 3 && (
            <div className="space-y-6 animate-fade-slide-in">
              <div className="glass rounded-2xl p-6 space-y-5">
                <h3 className="font-semibold text-sm">Conteúdo Vinculado</h3>
                <p className="text-xs text-muted-foreground">Vincule cursos existentes ao produto. O acesso será liberado automaticamente após a confirmação do pagamento.</p>
                <div className="space-y-2">
                  {["Vendas de Alto Ticket", "Marketing Digital Avançado"].map((c, i) => (
                    <div key={i} className="glass rounded-xl p-4 flex items-center gap-4">
                      <div className="w-12 h-8 rounded-lg bg-primary/10" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{c}</div>
                        <div className="text-[10px] text-muted-foreground">8 módulos · 42 aulas</div>
                      </div>
                      <button className="text-xs text-destructive hover:underline">Remover</button>
                    </div>
                  ))}
                </div>
                <button className="glass rounded-xl px-4 py-2.5 text-xs flex items-center gap-2 hover:bg-[rgba(255,255,255,0.06)] transition-all">
                  <Plus className="h-3.5 w-3.5" /> Vincular curso
                </button>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Tipo de acesso</label>
                    <select className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 appearance-none">
                      <option>Acesso vitalício</option><option>Acesso por dias</option><option>Acesso por meses</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Período de garantia</label>
                    <div className="flex items-center gap-2">
                      <input type="number" defaultValue={7} className="w-20 glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono" />
                      <span className="text-xs text-muted-foreground">dias</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setEditorStep(2)} className="glass rounded-xl px-5 py-2.5 text-sm hover:bg-[rgba(255,255,255,0.06)] transition-all">Voltar</button>
                <button onClick={() => setEditorStep(4)} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-5 py-2.5 text-sm flex items-center gap-2 glow-primary transition-all">
                  Próximo <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {editorStep === 4 && (
            <div className="space-y-6 animate-fade-slide-in">
              <div className="glass rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Página de Vendas</h3>
                  <button className="glass rounded-xl px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-[rgba(255,255,255,0.06)] transition-all">
                    <Eye className="h-3.5 w-3.5" /> Visualizar
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">Arraste para reordenar as seções da página de vendas.</p>
                <div className="space-y-2">
                  {["Hero (Título + CTA + Vídeo)", "Para quem é este produto", "O que você vai aprender", "Conteúdo do curso", "Depoimentos", "Sobre o mentor", "Garantia", "FAQ", "CTA Final"].map((sec, i) => (
                    <div key={i} className="glass rounded-xl p-3 flex items-center gap-3 cursor-grab hover:border-primary/30 transition-all">
                      <GripVertical className="h-4 w-4 text-muted-foreground/40" />
                      <span className="text-sm flex-1">{sec}</span>
                      <button className="text-[10px] text-primary hover:underline">Editar</button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setEditorStep(3)} className="glass rounded-xl px-5 py-2.5 text-sm hover:bg-[rgba(255,255,255,0.06)] transition-all">Voltar</button>
                <button onClick={() => setEditorStep(5)} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-5 py-2.5 text-sm flex items-center gap-2 glow-primary transition-all">
                  Próximo <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {editorStep === 5 && (
            <div className="space-y-6 animate-fade-slide-in">
              <div className="glass rounded-2xl p-6 space-y-4">
                <h3 className="font-semibold text-sm">Configurações do Checkout</h3>
                <div className="space-y-3">
                  {["Aceitar Cartão de Crédito", "Aceitar PIX", "Aceitar Boleto"].map((t, i) => (
                    <div key={i} className="flex items-center justify-between py-2">
                      <span className="text-sm">{t}</span>
                      <div className={`w-9 h-5 rounded-full flex items-center px-0.5 cursor-pointer transition-all ${i < 2 ? 'bg-primary/30' : 'bg-muted'}`}>
                        <div className={`w-4 h-4 rounded-full transition-transform ${i < 2 ? 'bg-primary translate-x-4' : 'bg-muted-foreground translate-x-0'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setEditorStep(4)} className="glass rounded-xl px-5 py-2.5 text-sm hover:bg-[rgba(255,255,255,0.06)] transition-all">Voltar</button>
                <button onClick={() => setEditorStep(6)} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-5 py-2.5 text-sm flex items-center gap-2 glow-primary transition-all">
                  Próximo <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {editorStep === 6 && (
            <div className="space-y-6 animate-fade-slide-in">
              <div className="glass rounded-2xl p-6 space-y-5">
                <h3 className="font-semibold text-sm">Pós-compra</h3>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Mensagem da página de sucesso</label>
                  <textarea className="w-full glass rounded-xl px-4 py-3 text-sm bg-transparent resize-none focus:outline-none focus:ring-1 focus:ring-primary/50 h-20" defaultValue="Bem-vindo(a)! Seu acesso já está liberado. Aproveite ao máximo sua jornada!" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">URL de redirecionamento (opcional)</label>
                  <input type="text" placeholder="https://..." className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50" />
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm">Enviar acesso automático por e-mail</span>
                  <div className="w-9 h-5 rounded-full bg-primary/30 flex items-center px-0.5 cursor-pointer">
                    <div className="w-4 h-4 rounded-full bg-primary translate-x-4 transition-transform" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Upsell na página de sucesso</label>
                  <select className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 appearance-none">
                    <option>Nenhum</option>
                    {products.map(p => <option key={p.id}>{p.name} — R$ {p.price}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setEditorStep(5)} className="glass rounded-xl px-5 py-2.5 text-sm hover:bg-[rgba(255,255,255,0.06)] transition-all">Voltar</button>
                <button onClick={() => setEditorStep(7)} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-5 py-2.5 text-sm flex items-center gap-2 glow-primary transition-all">
                  Próximo <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {editorStep === 7 && (
            <div className="space-y-6 animate-fade-slide-in">
              <div className="glass rounded-2xl p-6 space-y-5">
                <h3 className="font-semibold text-sm">Checklist de Publicação</h3>
                <div className="space-y-3">
                  {[
                    { label: "Nome preenchido", done: true },
                    { label: "Preço configurado", done: true },
                    { label: "Curso vinculado", done: true },
                    { label: "Página de vendas criada", done: true },
                    { label: "Vídeo de apresentação", done: false, optional: true },
                    { label: "Depoimentos adicionados", done: false, optional: true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-lg flex items-center justify-center ${item.done ? 'bg-success/20' : 'bg-muted/50'}`}>
                        {item.done ? <Check className="h-3 w-3 text-success" /> : <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />}
                      </div>
                      <span className={`text-sm ${item.done ? '' : 'text-muted-foreground'}`}>{item.label}</span>
                      {item.optional && <span className="text-[10px] text-muted-foreground">(opcional)</span>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-2xl p-6 space-y-4">
                <h3 className="font-semibold text-sm">Link de venda</h3>
                <div className="flex items-center gap-3">
                  <div className="flex-1 glass rounded-xl px-4 py-2.5 text-sm font-mono text-muted-foreground">
                    plataforma.com/p/IMPLOFY-patron
                  </div>
                  <button onClick={() => { navigator.clipboard.writeText("plataforma.com/p/IMPLOFY-patron"); toast.success("Link copiado!"); }} className="glass rounded-xl p-2.5 hover:bg-[rgba(255,255,255,0.06)] transition-all" title="Copiar">
                    <Copy className="h-4 w-4" />
                  </button>
                  <button onClick={() => toast.info("Compartilhando link...")} className="glass rounded-xl p-2.5 hover:bg-[rgba(255,255,255,0.06)] transition-all" title="Compartilhar">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button onClick={() => setEditorStep(6)} className="glass rounded-xl px-5 py-2.5 text-sm hover:bg-[rgba(255,255,255,0.06)] transition-all">Voltar</button>
                <button onClick={() => toast.success("🚀 Produto publicado com sucesso!")} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 py-2.5 text-sm font-medium glow-primary transition-all">
                  🚀 Publicar produto
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl mb-1">Produtos</h1>
          <p className="text-sm text-muted-foreground">{products.length} produtos · {products.filter(p => p.status === "Publicado").length} publicados</p>
        </div>
        <button onClick={() => { setView("editor"); setEditorStep(1); }} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-5 py-2.5 text-sm flex items-center gap-2 glow-primary transition-all">
          <Plus className="h-4 w-4" /> Criar produto
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {filters.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeFilter === f ? 'bg-primary/20 text-primary' : 'glass text-muted-foreground hover:text-foreground'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product, i) => (
          <div key={product.id} className="glass rounded-2xl overflow-hidden card-hover animate-fade-slide-in" style={{ animationDelay: `${i * 60}ms` }}>
            {/* Thumbnail */}
            <div className="h-36 bg-gradient-to-br from-primary/20 via-[rgba(255,215,0,0.1)] to-transparent flex items-center justify-center">
              <Package className="h-10 w-10 text-primary/30" strokeWidth={1} />
            </div>

            <div className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium ${getStatusBadge(product.status)}`}>{product.status}</span>
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium ${getTypePill(product.type)}`}>{product.type}</span>
              </div>

              <div>
                <h3 className="font-semibold text-sm">{product.name}</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">{product.subtitle}</p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-xl font-[800] text-[#F59E0B]">R$ {product.price.toLocaleString('pt-BR')}</span>
                {product.originalPrice && (
                  <span className="text-xs text-muted-foreground line-through">R$ {product.originalPrice.toLocaleString('pt-BR')}</span>
                )}
              </div>

              <div className="flex items-center gap-4 pt-2 border-t border-[rgba(255,255,255,0.05)]">
                <div className="text-center flex-1">
                  <div className="text-sm font-[800]">{product.sales}</div>
                  <div className="text-[10px] text-muted-foreground">vendas</div>
                </div>
                <div className="text-center flex-1">
                  <div className="text-sm font-[800] text-[#F59E0B]">R$ {(product.revenue / 1000).toFixed(1)}K</div>
                  <div className="text-[10px] text-muted-foreground">receita</div>
                </div>
                <div className="text-center flex-1">
                  <div className="text-sm font-[800]">{product.conversion}%</div>
                  <div className="text-[10px] text-muted-foreground">conversão</div>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button onClick={() => { setView("editor"); setEditorStep(1); }} className="flex-1 glass rounded-xl py-2 text-xs flex items-center justify-center gap-1.5 hover:bg-[rgba(255,255,255,0.06)] transition-all">
                  <Edit className="h-3 w-3" /> Editar
                </button>
                <button onClick={() => toast.info("Abrindo página de vendas...")} className="glass rounded-xl px-3 py-2 hover:bg-[rgba(255,255,255,0.06)] transition-all" title="Ver página">
                  <Eye className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => toast.info("Mais opções em breve!")} className="glass rounded-xl px-3 py-2 hover:bg-[rgba(255,255,255,0.06)] transition-all" title="Mais">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MentorProducts;
