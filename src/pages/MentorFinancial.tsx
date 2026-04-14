import { useState } from "react";
import { DollarSign, Clock, TrendingUp, ShoppingCart, ArrowUpRight, Download, CreditCard, Smartphone, FileText, X } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { usePlatform, formatCurrency, daysBetween } from "@/contexts/PlatformContext";

function getStatusBadge(status: string) {
  const styles: Record<string, string> = {
    paid: "bg-[rgba(52,211,153,0.15)] border-[rgba(52,211,153,0.4)] text-[#34D399]",
    pending: "bg-[rgba(251,191,36,0.15)] border-[rgba(251,191,36,0.4)] text-[#FBBF24]",
    refunded: "bg-[rgba(96,165,250,0.15)] border-[rgba(96,165,250,0.4)] text-[#60A5FA]",
    failed: "bg-[rgba(248,113,113,0.15)] border-[rgba(248,113,113,0.4)] text-[#F87171]",
    expired: "bg-[rgba(91,90,107,0.15)] border-[rgba(91,90,107,0.3)] text-[#5C5B6B]",
  };
  return styles[status] || styles.expired;
}

const statusLabels: Record<string, string> = { paid: "Aprovado", pending: "Pendente", refunded: "Reembolsado", failed: "Falhou", expired: "Expirado" };
const methodIcons: Record<string, typeof CreditCard> = { card: CreditCard, pix: Smartphone, boleto: FileText };

const tooltipStyle = { background: 'hsl(240, 12%, 9%)', border: '1px solid hsl(240, 10%, 16%)', borderRadius: '12px', fontSize: '13px' };

const MentorFinancial = () => {
  const { state, totalRevenue, paidTransactions } = usePlatform();
  const [period, setPeriod] = useState("30d");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [txFilter, setTxFilter] = useState("Todos");

  const availableBalance = paidTransactions.reduce((a, t) => a + t.liquido, 0);
  const pendingBalance = state.transactions.filter(t => t.status === "pending").reduce((a, t) => a + t.amount, 0);
  const salesCount = paidTransactions.length;
  const avgTicket = salesCount > 0 ? totalRevenue / salesCount : 0;

  const filteredTx = state.transactions.filter(t => {
    if (txFilter === "Todos") return true;
    const filterMap: Record<string, string> = { "Aprovado": "paid", "Pendente": "pending", "Reembolsado": "refunded" };
    return t.status === filterMap[txFilter];
  });

  const revenueData = [
    { day: "01", bruta: 1200, liquida: 1080 }, { day: "05", bruta: 3400, liquida: 3060 },
    { day: "10", bruta: 2800, liquida: 2520 }, { day: "15", bruta: 5600, liquida: 5040 },
    { day: "20", bruta: 4200, liquida: 3780 }, { day: "25", bruta: 6800, liquida: 6120 },
    { day: "30", bruta: totalRevenue * 0.15, liquida: totalRevenue * 0.13 },
  ];

  const kpis = [
    { label: "Saldo Disponível", value: formatCurrency(availableBalance), detail: "Disponível para saque", icon: DollarSign, color: "#F59E0B", cta: "Sacar" },
    { label: "Saldo Pendente", value: formatCurrency(pendingBalance), detail: "Em processamento", icon: Clock, color: "#9B9AA8" },
    { label: "Receita Total", value: formatCurrency(totalRevenue), detail: `${salesCount} vendas realizadas`, icon: TrendingUp, color: "#34D399" },
    { label: "Vendas", value: `${salesCount} vendas`, detail: `Ticket médio: ${formatCurrency(avgTicket)}`, icon: ShoppingCart, color: "#FFD700" },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[24px] sm:text-[28px] font-[800] tracking-tight mb-1">Financeiro</h1>
          <p className="text-[13px] sm:text-[14px] font-semibold text-muted-foreground">Visão completa da saúde financeira</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {["7d", "30d", "90d", "1y"].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 sm:px-4 py-2 rounded-lg text-[13px] sm:text-[14px] font-bold transition-all ${period === p ? 'bg-primary/20 text-primary' : 'glass text-muted-foreground hover:text-foreground'}`}>
              {p === "7d" ? "7 dias" : p === "30d" ? "30 dias" : p === "90d" ? "3 meses" : "1 ano"}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {kpis.map((kpi, i) => (
          <div key={i} className="glass rounded-[16px] p-5 sm:p-6 card-hover animate-fade-slide-in" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-center justify-between mb-3">
              <kpi.icon className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: kpi.color }} strokeWidth={1.5} />
              {kpi.cta && (
                <button onClick={() => setShowWithdrawModal(true)} className="text-[13px] font-bold px-3.5 py-1.5 rounded-lg bg-[#F59E0B]/15 text-[#F59E0B] hover:bg-[#F59E0B]/25 transition-all">{kpi.cta}</button>
              )}
            </div>
            <div className="font-mono text-[22px] sm:text-[26px] font-[800]" style={{ color: kpi.color }}>{kpi.value}</div>
            <div className="text-[12px] sm:text-[13px] font-semibold text-muted-foreground mt-1">{kpi.detail}</div>
            <div className="text-[12px] font-semibold text-muted-foreground mt-0.5">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="glass rounded-[16px] p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <h3 className="font-bold text-[16px] sm:text-[18px]">Receita — Últimos 30 dias</h3>
          <div className="flex gap-3 text-[13px] font-bold">
            <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-primary" /> Bruta</span>
            <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-success" /> Líquida</span>
          </div>
        </div>
        <div className="h-[200px] sm:h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="brutaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(51, 100%, 50%)" stopOpacity={0.25} /><stop offset="100%" stopColor="hsl(51, 100%, 50%)" stopOpacity={0} /></linearGradient>
                <linearGradient id="liquidaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0.15} /><stop offset="100%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0} /></linearGradient>
              </defs>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'hsl(240, 8%, 55%)', fontSize: 13, fontWeight: 600 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(240, 8%, 55%)', fontSize: 13, fontWeight: 600 }} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(val: number) => formatCurrency(val)} />
              <Area type="monotone" dataKey="bruta" stroke="hsl(51, 100%, 50%)" strokeWidth={2} fill="url(#brutaGrad)" />
              <Area type="monotone" dataKey="liquida" stroke="hsl(142, 70%, 45%)" strokeWidth={2} fill="url(#liquidaGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transactions */}
      <div className="glass rounded-[16px] overflow-hidden">
        <div className="p-5 sm:p-7 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div><h3 className="font-bold text-[16px] sm:text-[18px]">Transações</h3><p className="text-[13px] font-semibold text-muted-foreground mt-0.5">Histórico de todas as vendas</p></div>
          <button className="glass rounded-xl px-4 py-2 text-[13px] font-bold flex items-center gap-1.5 hover:bg-[rgba(255,255,255,0.06)] transition-all self-start"><Download className="h-4 w-4" /> CSV</button>
        </div>
        <div className="px-5 sm:px-7 pb-4 flex gap-2 flex-wrap">
          {["Todos", "Aprovado", "Pendente", "Reembolsado"].map(f => (
            <button key={f} onClick={() => setTxFilter(f)}
              className={`px-3 sm:px-4 py-2 rounded-lg text-[13px] sm:text-[14px] font-bold transition-all ${txFilter === f ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}>{f}</button>
          ))}
        </div>

        {/* Mobile: Card view */}
        <div className="block md:hidden px-4 pb-4 space-y-3">
          {filteredTx.map((tx, i) => {
            const MethodIcon = methodIcons[tx.method] || CreditCard;
            return (
              <div key={tx.id} className="glass rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[13px] font-bold text-primary">{tx.id}</span>
                  <span className={`px-3 py-1 rounded-full text-[12px] font-bold border ${getStatusBadge(tx.status)}`}>{statusLabels[tx.status]}</span>
                </div>
                <div className="text-[15px] font-bold">{tx.customer.name}</div>
                <div className="text-[13px] text-muted-foreground">{tx.productName}</div>
                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div><div className="text-[11px] text-muted-foreground">Bruto</div><div className="font-mono text-[14px] font-bold text-[#F59E0B]">{formatCurrency(tx.amount)}</div></div>
                  <div><div className="text-[11px] text-muted-foreground">Taxa</div><div className="font-mono text-[14px] font-bold text-[#F87171]">-{formatCurrency(tx.taxa)}</div></div>
                  <div><div className="text-[11px] text-muted-foreground">Líquido</div><div className="font-mono text-[14px] font-bold text-[#34D399]">{formatCurrency(tx.liquido)}</div></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="border-t border-border/50">
                <th className="text-left text-[13px] font-bold tracking-[0.03em] text-muted-foreground px-5 py-3.5">#</th>
                <th className="text-left text-[13px] font-bold tracking-[0.03em] text-muted-foreground px-5 py-3.5">Cliente</th>
                <th className="text-left text-[13px] font-bold tracking-[0.03em] text-muted-foreground px-5 py-3.5 hidden lg:table-cell">Produto</th>
                <th className="text-left text-[13px] font-bold tracking-[0.03em] text-muted-foreground px-5 py-3.5 hidden lg:table-cell">Método</th>
                <th className="text-left text-[13px] font-bold tracking-[0.03em] text-muted-foreground px-5 py-3.5">Bruto</th>
                <th className="text-left text-[13px] font-bold tracking-[0.03em] text-muted-foreground px-5 py-3.5 hidden xl:table-cell">Taxa</th>
                <th className="text-left text-[13px] font-bold tracking-[0.03em] text-muted-foreground px-5 py-3.5">Líquido</th>
                <th className="text-left text-[13px] font-bold tracking-[0.03em] text-muted-foreground px-5 py-3.5">Status</th>
                <th className="text-left text-[13px] font-bold tracking-[0.03em] text-muted-foreground px-5 py-3.5 hidden lg:table-cell">Data</th>
              </tr>
            </thead>
            <tbody>
              {filteredTx.map((tx, i) => {
                const MethodIcon = methodIcons[tx.method] || CreditCard;
                return (
                  <tr key={tx.id} className="border-t border-border/30 hover:bg-accent/30 transition-colors min-h-[60px]">
                    <td className="px-5 py-4 font-mono text-[13px] font-bold text-primary">{tx.id}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-[12px] font-bold text-primary shrink-0">
                          {tx.customer.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[15px] font-bold truncate">{tx.customer.name}</div>
                          <div className="text-[13px] font-medium text-muted-foreground truncate">{tx.customer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[14px] font-semibold hidden lg:table-cell">{tx.productName}</td>
                    <td className="px-5 py-4 hidden lg:table-cell"><div className="flex items-center gap-1.5"><MethodIcon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} /><span className="text-[13px] font-semibold">{tx.method === "pix" ? "PIX" : tx.method === "card" ? "Cartão" : "Boleto"}</span></div></td>
                    <td className="px-5 py-4 font-mono text-[15px] font-bold text-[#F59E0B]">{formatCurrency(tx.amount)}</td>
                    <td className="px-5 py-4 font-mono text-[15px] font-bold text-[#F87171] hidden xl:table-cell">-{formatCurrency(tx.taxa)}</td>
                    <td className="px-5 py-4 font-mono text-[15px] font-bold text-[#34D399]">{formatCurrency(tx.liquido)}</td>
                    <td className="px-5 py-4"><span className={`px-3 py-1 rounded-full text-[12px] font-bold border ${getStatusBadge(tx.status)}`}>{statusLabels[tx.status]}</span></td>
                    <td className="px-5 py-4 text-[13px] font-semibold text-muted-foreground hidden lg:table-cell">{new Date(tx.createdAt).toLocaleDateString("pt-BR")} {new Date(tx.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowWithdrawModal(false)}>
          <div className="glass rounded-[16px] p-5 sm:p-7 w-full max-w-md space-y-5 animate-fade-slide-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] sm:text-[20px] font-bold">Solicitar Saque</h3>
              <button onClick={() => setShowWithdrawModal(false)} className="p-1 hover:bg-[rgba(255,255,255,0.06)] rounded-lg transition-all"><X className="h-5 w-5" /></button>
            </div>
            <div className="glass rounded-xl p-5">
              <div className="text-[13px] font-semibold text-muted-foreground">Saldo disponível</div>
              <div className="font-mono text-[24px] sm:text-[28px] font-[800] text-[#F59E0B] mt-1">{formatCurrency(availableBalance)}</div>
            </div>
            <div>
              <label className="text-[13px] font-semibold text-muted-foreground mb-1.5 block">Chave PIX</label>
              <input type="text" placeholder="Digite sua chave PIX" className="w-full glass rounded-xl px-5 py-3 text-[15px] font-medium bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50" />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-muted-foreground mb-1.5 block">Valor do saque</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-muted-foreground font-mono font-bold">R$</span>
                <input type="text" placeholder="0,00" className="w-full glass rounded-xl pl-12 pr-4 py-3 text-[15px] font-medium bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono" />
              </div>
            </div>
            <button className="w-full bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-black rounded-xl py-3 text-[15px] font-bold transition-all">Confirmar saque</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorFinancial;
