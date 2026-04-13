import { useState } from "react";
import { DollarSign, Clock, TrendingUp, ShoppingCart, ArrowUpRight, Download, CreditCard, Smartphone, FileText, ChevronRight, Check, X, AlertTriangle, Calendar } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const financialKpis = [
  { label: "Saldo Disponível", value: "R$ 12.480,00", detail: "Disponível para saque", icon: DollarSign, color: "#F59E0B", cta: "Sacar" },
  { label: "Saldo Pendente", value: "R$ 3.992,00", detail: "Libera em 14 dias", icon: Clock, color: "#9B9AA8" },
  { label: "Receita Total (mês)", value: "R$ 47.280,00", detail: "↑ 18% vs. mês anterior", icon: TrendingUp, color: "#34D399" },
  { label: "Vendas (mês)", value: "47 vendas", detail: "Ticket médio: R$ 1.006", icon: ShoppingCart, color: "#8B5CF6" },
];

const revenueData = [
  { day: "01", bruta: 1200, liquida: 1080 }, { day: "05", bruta: 3400, liquida: 3060 },
  { day: "10", bruta: 2800, liquida: 2520 }, { day: "15", bruta: 5600, liquida: 5040 },
  { day: "20", bruta: 4200, liquida: 3780 }, { day: "25", bruta: 6800, liquida: 6120 },
  { day: "30", bruta: 7400, liquida: 6660 },
];

const secondaryMetrics = [
  { label: "Ticket Médio", value: "R$ 1.006" },
  { label: "Taxa de Conversão", value: "14.2%" },
  { label: "LTV Médio", value: "R$ 2.340" },
  { label: "Chargeback Rate", value: "0.3%" },
  { label: "Taxa de Reembolso", value: "2.1%" },
  { label: "MRR", value: "R$ 7.332" },
  { label: "Crescimento MoM", value: "+18%" },
  { label: "Melhor dia", value: "Terça-feira" },
];

const transactions = [
  { id: "TXN-001847", client: "Carlos Mendes", email: "carlos@email.com", product: "Mentoria PATRON", method: "Cartão", methodIcon: CreditCard, brand: "Visa", bruto: 997, taxa: 49.85, liquido: 947.15, status: "Aprovado", date: "13/04/2025 14:32" },
  { id: "TXN-001846", client: "Ana Paula", email: "ana@email.com", product: "Mentoria PATRON", method: "PIX", methodIcon: Smartphone, bruto: 997, taxa: 9.97, liquido: 987.03, status: "Aprovado", date: "13/04/2025 11:18" },
  { id: "TXN-001845", client: "Juliana Costa", email: "juliana@email.com", product: "Curso Identidade", method: "Cartão", methodIcon: CreditCard, brand: "Mastercard", bruto: 199, taxa: 9.95, liquido: 189.05, status: "Aprovado", date: "12/04/2025 22:45" },
  { id: "TXN-001844", client: "Roberto Lima", email: "roberto@email.com", product: "Bundle Premium", method: "PIX", methodIcon: Smartphone, bruto: 1990, taxa: 19.90, liquido: 1970.10, status: "Pendente", date: "12/04/2025 18:03" },
  { id: "TXN-001843", client: "Fernanda Alves", email: "fernanda@email.com", product: "Mentoria PATRON", method: "Cartão", methodIcon: CreditCard, brand: "Elo", bruto: 997, taxa: 49.85, liquido: 947.15, status: "Reembolsado", date: "11/04/2025 09:12" },
  { id: "TXN-001842", client: "Marcos Junior", email: "marcos@email.com", product: "Assinatura", method: "Cartão", methodIcon: CreditCard, brand: "Visa", bruto: 47, taxa: 2.35, liquido: 44.65, status: "Aprovado", date: "11/04/2025 07:30" },
];

const withdrawals = [
  { id: "001", date: "10/04/2025", value: 2500, dest: "PIX - CPF ***123", status: "Pago", paidDate: "12/04/2025" },
  { id: "002", date: "01/04/2025", value: 1800, dest: "Banco Inter - Ag. 0001", status: "Pendente", paidDate: null },
  { id: "003", date: "25/03/2025", value: 3200, dest: "PIX - e-mail ***@email", status: "Pago", paidDate: "27/03/2025" },
];

function getStatusBadge(status: string) {
  const styles: Record<string, string> = {
    "Aprovado": "bg-[rgba(52,211,153,0.15)] border-[rgba(52,211,153,0.4)] text-[#34D399]",
    "Pendente": "bg-[rgba(251,191,36,0.15)] border-[rgba(251,191,36,0.4)] text-[#FBBF24]",
    "Reembolsado": "bg-[rgba(96,165,250,0.15)] border-[rgba(96,165,250,0.4)] text-[#60A5FA]",
    "Contestado": "bg-[rgba(248,113,113,0.15)] border-[rgba(248,113,113,0.4)] text-[#F87171]",
    "Cancelado": "bg-[rgba(91,90,107,0.15)] border-[rgba(91,90,107,0.3)] text-[#5C5B6B]",
    "Pago": "bg-[rgba(52,211,153,0.15)] border-[rgba(52,211,153,0.4)] text-[#34D399]",
  };
  return styles[status] || styles["Cancelado"];
}

const tooltipStyle = {
  background: 'hsl(240, 12%, 9%)',
  border: '1px solid hsl(240, 10%, 16%)',
  borderRadius: '12px',
  fontSize: '11px',
};

const MentorFinancial = () => {
  const [period, setPeriod] = useState("30d");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [txFilter, setTxFilter] = useState("Todos");

  const filteredTx = transactions.filter(t => txFilter === "Todos" || t.status === txFilter);

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl mb-1">Financeiro</h1>
          <p className="text-sm text-muted-foreground">Visão completa da saúde financeira do negócio</p>
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

      {/* Financial KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {financialKpis.map((kpi, i) => (
          <div key={i} className="glass rounded-xl p-5 card-hover animate-fade-slide-in" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-center justify-between mb-3">
              <kpi.icon className="h-4 w-4" style={{ color: kpi.color }} strokeWidth={1.5} />
              {kpi.cta && (
                <button onClick={() => setShowWithdrawModal(true)} className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-[#F59E0B]/15 text-[#F59E0B] hover:bg-[#F59E0B]/25 transition-all">
                  {kpi.cta}
                </button>
              )}
            </div>
            <div className="font-mono text-xl font-bold" style={{ color: kpi.color }}>{kpi.value}</div>
            <div className="text-[11px] text-muted-foreground mt-1">{kpi.detail}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
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
                <linearGradient id="brutaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(263, 70%, 58%)" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="hsl(263, 70%, 58%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="liquidaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'hsl(240, 8%, 55%)', fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(240, 8%, 55%)', fontSize: 11 }} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(val: number) => `R$ ${val.toLocaleString('pt-BR')}`} />
              <Area type="monotone" dataKey="bruta" stroke="hsl(263, 70%, 58%)" strokeWidth={2} fill="url(#brutaGrad)" />
              <Area type="monotone" dataKey="liquida" stroke="hsl(142, 70%, 45%)" strokeWidth={2} fill="url(#liquidaGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {secondaryMetrics.map((m, i) => (
          <div key={i} className="glass rounded-xl p-4 animate-fade-slide-in" style={{ animationDelay: `${i * 40}ms` }}>
            <div className="text-[10px] text-muted-foreground">{m.label}</div>
            <div className="font-mono text-lg font-medium mt-1">{m.value}</div>
          </div>
        ))}
      </div>

      {/* Transactions */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-6 pb-3 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm">Transações</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Histórico detalhado de todas as vendas</p>
          </div>
          <button className="glass rounded-xl px-3 py-1.5 text-xs flex items-center gap-1.5 hover:bg-[rgba(255,255,255,0.06)] transition-all">
            <Download className="h-3 w-3" /> CSV
          </button>
        </div>
        <div className="px-6 pb-3 flex gap-2">
          {["Todos", "Aprovado", "Pendente", "Reembolsado"].map(f => (
            <button key={f} onClick={() => setTxFilter(f)}
              className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-all ${txFilter === f ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
              {f}
            </button>
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
              {filteredTx.map((tx, i) => (
                <tr key={i} className="border-t border-border/30 hover:bg-accent/30 transition-colors cursor-pointer">
                  <td className="px-6 py-3 font-mono text-[11px] text-primary">{tx.id}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-[9px] font-medium text-primary">
                        {tx.client.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <div className="text-xs font-medium">{tx.client}</div>
                        <div className="text-[10px] text-muted-foreground">{tx.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-xs">{tx.product}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-1.5">
                      <tx.methodIcon className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
                      <span className="text-xs">{tx.method}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 font-mono text-xs text-[#F59E0B]">R$ {tx.bruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td className="px-6 py-3 font-mono text-xs text-[#F87171]">-R$ {tx.taxa.toFixed(2)}</td>
                  <td className="px-6 py-3 font-mono text-xs text-[#34D399]">R$ {tx.liquido.toFixed(2)}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium border ${getStatusBadge(tx.status)}`}>{tx.status}</span>
                  </td>
                  <td className="px-6 py-3 text-[11px] text-muted-foreground">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Withdrawals */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Histórico de Saques</h3>
          <button onClick={() => setShowWithdrawModal(true)} className="bg-[#F59E0B]/20 text-[#F59E0B] rounded-xl px-4 py-2 text-xs font-medium hover:bg-[#F59E0B]/30 transition-all flex items-center gap-1.5">
            <ArrowUpRight className="h-3.5 w-3.5" /> Solicitar saque
          </button>
        </div>

        <div className="glass rounded-xl p-5 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-muted-foreground">Saldo disponível para saque</div>
            <div className="font-mono text-3xl font-bold text-[#F59E0B] mt-1">R$ 12.480,00</div>
            <div className="text-[10px] text-muted-foreground mt-1">Saldo bloqueado: R$ 3.992,00 (libera em 14 dias úteis)</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left text-xs text-muted-foreground font-medium py-3">#</th>
                <th className="text-left text-xs text-muted-foreground font-medium py-3">Data</th>
                <th className="text-left text-xs text-muted-foreground font-medium py-3">Valor</th>
                <th className="text-left text-xs text-muted-foreground font-medium py-3">Destino</th>
                <th className="text-left text-xs text-muted-foreground font-medium py-3">Status</th>
                <th className="text-left text-xs text-muted-foreground font-medium py-3">Pagamento</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w, i) => (
                <tr key={i} className="border-b border-border/20">
                  <td className="py-3 font-mono text-[11px] text-muted-foreground">{w.id}</td>
                  <td className="py-3 text-xs">{w.date}</td>
                  <td className="py-3 font-mono text-sm text-[#F59E0B] font-medium">R$ {w.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td className="py-3 text-xs text-muted-foreground">{w.dest}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium border ${getStatusBadge(w.status)}`}>{w.status}</span>
                  </td>
                  <td className="py-3 text-xs text-muted-foreground">{w.paidDate || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowWithdrawModal(false)}>
          <div className="glass rounded-2xl p-6 w-full max-w-md space-y-5 animate-fade-slide-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg">Solicitar Saque</h3>
              <button onClick={() => setShowWithdrawModal(false)} className="p-1 hover:bg-[rgba(255,255,255,0.06)] rounded-lg transition-all">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Método de recebimento</label>
              <select className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 appearance-none">
                <option>PIX</option><option>Conta Corrente</option><option>Conta Poupança</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Tipo de chave PIX</label>
              <select className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 appearance-none">
                <option>CPF</option><option>E-mail</option><option>Telefone</option><option>Chave aleatória</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Chave PIX</label>
              <input type="text" placeholder="Digite sua chave PIX" className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50" />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Valor do saque</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-mono">R$</span>
                  <input type="text" placeholder="0,00" className="w-full glass rounded-xl pl-10 pr-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono" />
                </div>
                <button className="glass rounded-xl px-3 py-2.5 text-xs hover:bg-[rgba(255,255,255,0.06)] transition-all">Sacar tudo</button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">Saldo disponível: R$ 12.480,00 · Mínimo: R$ 20,00</p>
            </div>

            <div className="glass rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Valor do saque</span>
                <span className="font-mono">R$ 12.480,00</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Taxa</span>
                <span className="font-mono text-[#34D399]">R$ 0,00</span>
              </div>
              <div className="border-t border-[rgba(255,255,255,0.05)] pt-2 flex justify-between text-sm">
                <span className="font-medium">Você receberá</span>
                <span className="font-mono font-bold text-[#F59E0B]">R$ 12.480,00</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Prazo: até 2 dias úteis</p>
            </div>

            <button className="w-full bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-black rounded-xl py-3 text-sm font-medium transition-all">
              Confirmar saque
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorFinancial;
