import { useState } from "react";
import { toast } from "sonner";
import { Plus, Package, Eye, Copy, MoreHorizontal, Edit, TrendingUp, ShoppingCart, DollarSign } from "lucide-react";
import { useProducts, Product } from "@/contexts/ProductsContext";
import { ProductEditor } from "@/components/products/ProductEditor";
import { formatBRL } from "@/lib/products-utils";

const filters = ["Todos", "Publicados", "Rascunho", "Arquivados", "Gratuitos", "Pagos"];

function statusLabel(p: Product) {
  if (p.status === "published") return "Publicado";
  if (p.status === "draft") return "Rascunho";
  return "Arquivado";
}
function getStatusBadge(status: Product["status"]) {
  if (status === "published") return "bg-success/15 text-success border border-success/30";
  if (status === "draft") return "bg-warning/15 text-warning border border-warning/30";
  return "bg-muted/30 text-muted-foreground border border-muted/30";
}
function getTypePill(type: string) {
  const colors: Record<string, string> = {
    Curso: "bg-primary/15 text-primary",
    "Curso Online": "bg-primary/15 text-primary",
    Mentoria: "bg-[rgba(255,215,0,0.2)] text-[#FFD700]",
    Imersão: "bg-info/15 text-info",
    "Imersão Presencial": "bg-info/15 text-info",
    Assinatura: "bg-success/15 text-success",
    Bundle: "bg-warning/15 text-warning",
  };
  return colors[type] || "bg-muted text-muted-foreground";
}

const MentorProducts = () => {
  const { products, resetDraft, loadProductIntoDraft, deleteProduct } = useProducts();
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [view, setView] = useState<"list" | "editor">("list");

  const filteredProducts = products.filter((p) => {
    if (activeFilter === "Todos") return true;
    if (activeFilter === "Publicados") return p.status === "published";
    if (activeFilter === "Rascunho") return p.status === "draft";
    if (activeFilter === "Arquivados") return p.status === "archived";
    if (activeFilter === "Pagos") return p.price > 0;
    if (activeFilter === "Gratuitos") return p.price === 0;
    return true;
  });

  const totalRevenue = products.reduce((s, p) => s + p.analytics.revenue, 0);
  const totalSales = products.reduce((s, p) => s + p.analytics.sales, 0);
  const publishedCount = products.filter((p) => p.status === "published").length;
  const avgConversion = products.length
    ? products.reduce((s, p) => s + p.analytics.conversionRate, 0) / products.length
    : 0;

  const handleCreate = () => {
    resetDraft();
    setView("editor");
  };
  const handleEdit = (id: string) => {
    loadProductIntoDraft(id);
    setView("editor");
  };
  const handleCopyLink = (p: Product) => {
    const url = `${window.location.origin}${p.url}`;
    navigator.clipboard?.writeText(url).then(
      () => toast.success("Link copiado! ✅"),
      () => toast.error("Não foi possível copiar"),
    );
  };
  const handleView = (p: Product) => {
    window.open(p.url, "_blank");
  };
  const handleDelete = (p: Product) => {
    if (confirm(`Excluir "${p.name}"?`)) {
      deleteProduct(p.id);
      toast.success("Produto excluído");
    }
  };

  if (view === "editor") {
    return <ProductEditor onClose={() => setView("list")} />;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl mb-1">Produtos</h1>
          <p className="text-sm text-muted-foreground">Gerencie seus cursos, mentorias e bundles</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-4 py-2.5 text-sm flex items-center gap-2 glow-primary transition-all"
        >
          <Plus className="h-4 w-4" /> Novo Produto
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Receita total", value: formatBRL(totalRevenue), icon: DollarSign },
          { label: "Vendas", value: totalSales.toString(), icon: ShoppingCart },
          { label: "Publicados", value: publishedCount.toString(), icon: Package },
          { label: "Conversão média", value: `${avgConversion.toFixed(1)}%`, icon: TrendingUp },
        ].map((k) => (
          <div key={k.label} className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">{k.label}</span>
              <k.icon className="h-4 w-4 text-muted-foreground/60" strokeWidth={1.5} />
            </div>
            <p className="font-display text-2xl">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-xs transition-all ${
              activeFilter === f
                ? "bg-primary/15 text-primary ring-1 ring-primary/40"
                : "glass hover:bg-[rgba(255,255,255,0.06)]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <Package className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" strokeWidth={1.5} />
          <p className="text-sm text-muted-foreground mb-4">Nenhum produto neste filtro</p>
          <button
            onClick={handleCreate}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-4 py-2 text-xs inline-flex items-center gap-2 glow-primary"
          >
            <Plus className="h-3.5 w-3.5" /> Criar produto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {filteredProducts.map((p) => {
            const totalLessons = p.course.modules.reduce((s, m) => s + m.lessons.length, 0);
            return (
              <div key={p.id} className="glass rounded-2xl overflow-hidden hover:ring-1 hover:ring-primary/30 transition-all group">
                <div className="aspect-video bg-muted/30 relative overflow-hidden">
                  {p.thumbnail ? (
                    <img src={p.thumbnail} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-info/5">
                      <Package className="h-10 w-10 text-muted-foreground/40" strokeWidth={1.5} />
                    </div>
                  )}
                  <span className={`absolute top-3 right-3 text-[10px] px-2 py-1 rounded-full ${getStatusBadge(p.status)}`}>
                    {statusLabel(p)}
                  </span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full inline-block mb-1 ${getTypePill(p.type)}`}>{p.type}</span>
                      <h3 className="font-display text-sm truncate">{p.name}</h3>
                      <p className="text-xs text-muted-foreground truncate">{p.tagline}</p>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => handleDelete(p)}
                        className="text-muted-foreground hover:text-destructive p-1"
                        title="Excluir"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-lg">{formatBRL(p.price)}</span>
                    {p.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through font-mono">{formatBRL(p.originalPrice)}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{p.course.modules.length} módulos · {totalLessons} aulas</span>
                    <span className="font-mono">{p.analytics.sales} vendas</span>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-[rgba(255,255,255,0.06)]">
                    <button
                      onClick={() => handleEdit(p.id)}
                      className="flex-1 glass rounded-lg px-2 py-1.5 text-[11px] flex items-center justify-center gap-1 hover:bg-primary/15 hover:text-primary transition-all"
                    >
                      <Edit className="h-3 w-3" /> Editar
                    </button>
                    <button
                      onClick={() => handleView(p)}
                      className="flex-1 glass rounded-lg px-2 py-1.5 text-[11px] flex items-center justify-center gap-1 hover:bg-[rgba(255,255,255,0.06)] transition-all"
                    >
                      <Eye className="h-3 w-3" /> Ver
                    </button>
                    <button
                      onClick={() => handleCopyLink(p)}
                      className="glass rounded-lg px-2 py-1.5 text-[11px] flex items-center justify-center gap-1 hover:bg-[rgba(255,255,255,0.06)] transition-all"
                      title="Copiar link"
                    >
                      <Copy className="h-3 w-3" />
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
};

export default MentorProducts;
