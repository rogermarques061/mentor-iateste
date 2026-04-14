import { useState } from "react";
import { ShoppingCart, TrendingUp, TrendingDown, DollarSign, Users, BarChart3, ChevronRight, Mail, Eye, ArrowRight, CreditCard, Smartphone, FileText } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const salesKpis = [
  { label: "Vendas hoje", value: "7", change: "+3 vs. ontem", up: true, icon: ShoppingCart },
  { label: "Receita hoje", value: "R$ 4.979", change: "+28%", up: true, icon: DollarSign },
  { label: "Checkouts iniciados", value: "42", change: "Abandono: 86%", up: false, icon: BarChart3 },
  { label: "Taxa de conversão", value: "16.7%", change: "+2.1% vs. mês", up: true, icon: TrendingUp },
];

const funnelSteps = [
  { label: "Visitantes da página de vendas", value: 10000, pct: 100 },
  { label: "Iniciaram o checkout", value: 1200, pct: 12 },
  { label: "Preencheram dados pessoais", value: 950, pct: 79 },
  { label: "Chegaram ao pagamento", value: 720, pct: 76 },
  { label: "Compra concluída", value: 580, pct: 81 },
];

const productSales = [
  { name: "Programa PATRON", sales: 34, revenue: 33966, ticket: 999, conversion: 8.2, trend: "up" },
  { name: "Curso Identidade", sales: 78, revenue: 15522, ticket: 199, conversion: 12.1, trend: "stable" },
  { name: "Bundle Premium", sales: 12, revenue: 23880, ticket: 1990, conversion: 3.4, trend: "up" },
  { name: "Imersão VIP", sales: 8, revenue: 19976, ticket: 2497, conversion: 5.7, trend: "down" },
  { name: "Assinatura", sales: 156, revenue: 7332, ticket: 47, conversion: 18.4, trend: "up" },
];

const revenueByProduct = [
  { month: "Nov", "Programa PATRON": 8200, "Curso Identidade": 3800, "Bundle Premium": 5900 },
  { month: "Dez", "Programa PATRON": 10400, "Curso Identidade": 4200, "Bundle Premium": 7800 },
  { month: "Jan", "Programa PATRON": 7800, "Curso Identidade": 3600, "Bundle Premium": 3960 },
  { month: "Fev", "Programa PATRON": 9960, "Curso Identidade": 4800, "Bundle Premium": 5940 },
  { month: "Mar", "Programa PATRON": 11960, "Curso Identidade": 5100, "Bundle Premium": 7920 },
  { month: "Abr", "Programa PATRON": 13970, "Curso Identidade": 5400, "Bundle Premium": 9900 },
];

const abandonedCheckouts = [
  { email: "joao@email.com", product: "Programa PATRON", stage: "Seleção de parcelas", value: 997, time: "4min 32s" },
  { email: "maria@email.com", product: "Bundle Premium", stage: "Dados pessoais", value: 1990, time: "1min 15s" },
  { email: "pedro@email.com", product: "Curso Identidade", stage: "Pagamento", value: 199, time: "6min 08s" },
  { email: "ana@email.com", product: "Programa PATRON", stage: "Pagamento PIX", value: 997, time: "8min 22s" },
];

const tooltipStyle = {
  background: 'hsl(240, 12%, 9%)',
  border: '1px solid hsl(240, 10%, 16%)',
  borderRadius: '12px',
  fontSize: '11px',
};

function getTrendIcon(trend: string) {
  if (trend === "up") return <TrendingUp className="h-3.5 w-3.5 text-success" />;
  if (trend === "down") return <TrendingDown className="h-3.5 w-3.5 text-destructive" />;
  return <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />;
}

const MentorSales = () => {
  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="font-display text-2xl mb-1">Vendas</h1>
        <p className="text-sm text-muted-foreground">Visão completa do funil de vendas e performance</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {salesKpis.map((kpi, i) => (
          <div key={i} className="glass rounded-xl p-4 card-hover animate-fade-slide-in" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-center justify-between mb-3">
              <kpi.icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
              <span className={`text-[10px] font-mono font-medium ${kpi.up ? "text-success" : "text-destructive"}`}>{kpi.change}</span>
            </div>
            <div className="font-mono text-xl font-medium">{kpi.value}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Funnel */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <h3 className="font-semibold text-sm">Funil de Vendas</h3>
        <div className="space-y-3">
          {funnelSteps.map((step, i) => (
            <div key={i} className="animate-fade-slide-in" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs">{step.label}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-medium">{step.value.toLocaleString('pt-BR')}</span>
                  {i > 0 && <span className="text-[10px] text-muted-foreground">({step.pct}%)</span>}
                </div>
              </div>
              <div className="h-8 rounded-xl bg-muted/30 overflow-hidden">
                <div
                  className="h-full rounded-xl transition-all duration-700 ease-out"
                  style={{
                    width: `${(step.value / funnelSteps[0].value) * 100}%`,
                    background: `linear-gradient(90deg, hsl(51, 100%, 50%) 0%, hsl(263, 70%, ${58 - i * 6}%) 100%)`,
                    opacity: 1 - i * 0.12,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue by Product Chart */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-semibold text-sm mb-4">Receita por Produto — Últimos 6 meses</h3>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueByProduct}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(240, 8%, 55%)', fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(240, 8%, 55%)', fontSize: 11 }} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="Programa PATRON" fill="hsl(51, 100%, 50%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Curso Identidade" fill="hsl(210, 100%, 60%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Bundle Premium" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sales by Product Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-6 pb-4">
          <h3 className="font-semibold text-sm">Vendas por Produto</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-border/50">
                <th className="text-left text-xs text-muted-foreground font-medium px-6 py-3">Produto</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-6 py-3">Vendas</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-6 py-3">Receita</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-6 py-3">Ticket Médio</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-6 py-3">Conversão</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-6 py-3">Trend</th>
              </tr>
            </thead>
            <tbody>
              {productSales.map((p, i) => (
                <tr key={i} className="border-t border-border/30 hover:bg-accent/30 transition-colors">
                  <td className="px-6 py-3.5 font-medium">{p.name}</td>
                  <td className="px-6 py-3.5 font-mono">{p.sales}</td>
                  <td className="px-6 py-3.5 font-mono text-[#F59E0B] font-medium">R$ {p.revenue.toLocaleString('pt-BR')}</td>
                  <td className="px-6 py-3.5 font-mono">R$ {p.ticket}</td>
                  <td className="px-6 py-3.5 font-mono">{p.conversion}%</td>
                  <td className="px-6 py-3.5">{getTrendIcon(p.trend)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Abandoned Checkouts */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-6 pb-4">
          <h3 className="font-semibold text-sm">Abandonos de Checkout</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Checkouts iniciados mas não concluídos</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-border/50">
                <th className="text-left text-xs text-muted-foreground font-medium px-6 py-3">Visitante</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-6 py-3">Produto</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-6 py-3">Etapa</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-6 py-3">Valor</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-6 py-3">Tempo</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-6 py-3">Ação</th>
              </tr>
            </thead>
            <tbody>
              {abandonedCheckouts.map((c, i) => (
                <tr key={i} className="border-t border-border/30 hover:bg-accent/30 transition-colors">
                  <td className="px-6 py-3.5 text-muted-foreground font-mono text-xs">{c.email}</td>
                  <td className="px-6 py-3.5">{c.product}</td>
                  <td className="px-6 py-3.5">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-warning/15 text-warning">{c.stage}</span>
                  </td>
                  <td className="px-6 py-3.5 font-mono text-[#F59E0B]">R$ {c.value}</td>
                  <td className="px-6 py-3.5 text-muted-foreground text-xs">{c.time}</td>
                  <td className="px-6 py-3.5">
                    <button className="px-2.5 py-1.5 rounded-lg text-[11px] bg-primary/20 text-primary hover:bg-primary/30 transition-all flex items-center gap-1">
                      <Mail className="h-3 w-3" /> Recuperar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MentorSales;
