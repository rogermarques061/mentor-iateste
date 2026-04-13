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

const tooltipStyle = { background: 'hsl(240, 12%, 9%)', border: '1px solid hsl(240, 10%, 16%)', borderRadius: '12px', fontSize: '11px' };

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
    { label: "Vendas", value: `${salesCount} vendas`, detail: `Ticket médio: ${formatCurrency(avgTicket)}`, icon: ShoppingCart, color: "#8B5CF6" },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl mb-1">Financeiro</h1>
          <p className="text-sm text-muted-foreground">Visão completa da saúde financeira</p>
        </div>
        <div className="flex gap-2">
          {["7d", "30d", "90d", "1y"].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${period === p ? 'bg-primary/20 text-primary' : 'glass text-muted-foreground hover:text-foreground'}`}>
              {p === "7d" ? "7 dias" : p === "30d" ? "30 dias" : p === "90d" ? "3 meses" : "1 ano"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="glass rounded-xl p-5 card-hover animate-fade-slide-in" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-center justify-between mb-3">
              <kpi.icon className="h-4 w-4" style={{ color: kpi.color }} strokeWidth={1.5} />
              {kpi.cta && (
                <button onClick={() => setShowWithdrawModal(true)} className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-[#F59E0B]/15 text-[#F59E0B] hover:bg-[#F59E0B]/25 transition-all">{kpi.cta}</button>
              )}
            </div>
            <div className="font-mono text-xl font-bold" style={{ color: kpi.color }}>{kpi.value}</div>
            <div className="text-[11px] text-muted-foreground mt-1">{kpi.detail}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm">Receita — Últimos 30 dias</h3>
          <div className="flex gap-3 text-[10px]">
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary" /> Bruta</span>
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-success" /> Líquida</span>
          </div>
        </div>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="brutaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(263, 70%, 58%)" stopOpacity={0.25} /><stop offset="100%" stopColor="hsl(263, 70%, 58%)" stopOpacity={0} /></linearGradient>
                <linearGradient id="liquidaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0.15} /><stop offset="100%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0} /></linearGradient>
              </defs>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'hsl(240, 8%, 55%)', fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(240, 8%, 55%)', fontSize: 11 }} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(val: number) => formatCurrency(val)} />
              <Area type="monotone" dataKey="bruta" stroke="hsl(263, 70%, 58%)" strokeWidth={2} fill="url(#brutaGrad)" />
              <Area type="monotone" dataKey="liquida" stroke="hsl(142, 70%, 45%)" strokeWidth={2} fill="url(#liquidaGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-6 pb-3 flex items-center justify-between">
          <div><h3 className="font-semibold text-sm">Transações</h3><p className="text-xs text-muted-foreground mt-0.5">Histórico de todas as vendas</p></div>
          <button className="glass rounded-xl px-3 py-1.5 text-xs flex items-center gap-1.5 hover:bg-[rgba(255,255,255,0.06)] transition-all"><Download className="h-3 w-3" /> CSV</button>
        </div>
        <div className="px-6 pb-3 flex gap-2">
          {["Todos", "Aprovado", "Pendente", "Reembolsado"].map(f => (
            <button key={f} onClick={() => setTxFilter(f)}
              className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-all ${txFilter === f ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}>{f}</button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-border/50">
                <th className="text-left text-xs text-muted-foreground font-medium px-6 py-3">#</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-6 py-3">Cliente</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-6 py-3">Produto</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-6 py-3">Método</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-6 py-3">Bruto</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-6 py-3">Taxa</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-6 py-3">Líquido</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-6 py-3">Status</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-6 py-3">Data</th>
              </tr>
            </thead>
            <tbody>
              {filteredTx.map((tx, i) => {
                const MethodIcon = methodIcons[tx.method] || CreditCard;
                return (
                  <tr key={tx.id} className="border-t border-border/30 hover:bg-accent/30 transition-colors">
                    <td className="px-6 py-3 font-mono text-[11px] text-primary">{tx.id}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-[9px] font-medium text-primary">
                          {tx.customer.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <div className="text-xs font-medium">{tx.customer.name}</div>
                          <div className="text-[10px] text-muted-foreground">{tx.customer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-xs">{tx.productName}</td>
                    <td className="px-6 py-3"><div className="flex items-center gap-1.5"><MethodIcon className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} /><span className="text-xs">{tx.method === "pix" ? "PIX" : tx.method === "card" ? "Cartão" : "Boleto"}</span></div></td>
                    <td className="px-6 py-3 font-mono text-xs text-[#F59E0B]">{formatCurrency(tx.amount)}</td>
                    <td className="px-6 py-3 font-mono text-xs text-[#F87171]">-{formatCurrency(tx.taxa)}</td>
                    <td className="px-6 py-3 font-mono text-xs text-[#34D399]">{formatCurrency(tx.liquido)}</td>
                    <td className="px-6 py-3"><span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium border ${getStatusBadge(tx.status)}`}>{statusLabels[tx.status]}</span></td>
                    <td className="px-6 py-3 text-[11px] text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString("pt-BR")} {new Date(tx.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowWithdrawModal(false)}>
          <div className="glass rounded-2xl p-6 w-full max-w-md space-y-5 animate-fade-slide-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg">Solicitar Saque</h3>
              <button onClick={() => setShowWithdrawModal(false)} className="p-1 hover:bg-[rgba(255,255,255,0.06)] rounded-lg transition-all"><X className="h-5 w-5" /></button>
            </div>
            <div className="glass rounded-xl p-4">
              <div className="text-[10px] text-muted-foreground">Saldo disponível</div>
              <div className="font-mono text-2xl font-bold text-[#F59E0B] mt-1">{formatCurrency(availableBalance)}</div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Chave PIX</label>
              <input type="text" placeholder="Digite sua chave PIX" className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Valor do saque</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-mono">R$</span>
                <input type="text" placeholder="0,00" className="w-full glass rounded-xl pl-10 pr-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono" />
              </div>
            </div>
            <button className="w-full bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-black rounded-xl py-3 text-sm font-semibold transition-all">Confirmar saque</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorFinancial;
