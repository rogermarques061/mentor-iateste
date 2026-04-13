import { TrendingUp, TrendingDown, Users, DollarSign, BarChart3, AlertTriangle, Activity, ShoppingCart, Target } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const kpis = [
  { label: "Receita (mês)", value: "R$ 47.2K", change: "+18%", up: true, icon: DollarSign, color: "#F59E0B" },
  { label: "MRR", value: "R$ 7.3K", change: "+12%", up: true, icon: TrendingUp, color: "#34D399" },
  { label: "Vendas Hoje", value: "7", change: "+3", up: true, icon: ShoppingCart, color: "#8B5CF6" },
  { label: "Saldo Disponível", value: "R$ 12.4K", change: "", up: true, icon: DollarSign, color: "#F59E0B" },
  { label: "Alunos Ativos", value: "1.247", change: "+12%", up: true, icon: Users },
  { label: "Risco de Churn", value: "8.4%", change: "-2%", up: false, icon: AlertTriangle },
  { label: "Taxa Conclusão", value: "62%", change: "+3%", up: true, icon: BarChart3 },
  { label: "Score Saúde", value: "84", change: "+5", up: true, icon: Activity },
];

const revenueEngagementData = [
  { day: "01", receita: 1200, engajamento: 78 }, { day: "05", receita: 3400, engajamento: 82 },
  { day: "10", receita: 2800, engajamento: 75 }, { day: "15", receita: 5600, engajamento: 90 },
  { day: "20", receita: 4200, engajamento: 88 }, { day: "25", receita: 6800, engajamento: 95 },
  { day: "30", receita: 7400, engajamento: 91 },
];

const riskData = [
  { name: "Baixo", value: 72, color: "hsl(142, 70%, 45%)" },
  { name: "Médio", value: 20, color: "hsl(38, 92%, 50%)" },
  { name: "Alto", value: 8, color: "hsl(0, 72%, 51%)" },
];

const activityFeed = [
  { text: "Nova venda! Carlos comprou Mentoria PATRON", value: "R$ 997,00", time: "há 12min", type: "sale" },
  { text: "Alerta: João sem acesso há 7 dias", value: "Risco alto", time: "há 1h", type: "alert" },
  { text: "Badge desbloqueada por Maria: Módulo Completo", value: "", time: "há 2h", type: "badge" },
  { text: "Saque de R$ 2.500 aprovado", value: "", time: "ontem", type: "withdraw" },
  { text: "Ana Silva completou 90% do programa", value: "Oportunidade de upsell", time: "há 3h", type: "upsell" },
  { text: "Nova venda! Juliana comprou Curso Identidade", value: "R$ 199,00", time: "há 5h", type: "sale" },
];

function getFeedColor(type: string) {
  if (type === "sale") return "border-l-[#F59E0B]";
  if (type === "alert") return "border-l-destructive";
  if (type === "badge") return "border-l-primary";
  if (type === "upsell") return "border-l-success";
  return "border-l-info";
}

const tooltipStyle = {
  background: 'hsl(240, 12%, 9%)',
  border: '1px solid hsl(240, 10%, 16%)',
  borderRadius: '8px',
  fontSize: '12px',
};

const MentorDashboard = () => {
  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="font-display text-2xl mb-1">Visão Geral</h1>
        <p className="text-sm text-muted-foreground">Painel executivo do seu negócio de mentoria</p>
      </div>

      {/* KPIs — 2 rows */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className="glass rounded-xl p-4 card-hover animate-fade-slide-in"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <kpi.icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
              {kpi.change && (
                <span className={`text-[10px] font-mono font-medium flex items-center gap-0.5 ${
                  kpi.up ? "text-success" : "text-destructive"
                }`}>
                  {kpi.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {kpi.change}
                </span>
              )}
            </div>
            <div className="font-mono text-xl font-medium" style={kpi.color ? { color: kpi.color } : undefined}>{kpi.value}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Health Score + Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue + Engagement Chart */}
        <div className="lg:col-span-2 glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Receita × Engajamento — 30 dias</h3>
            <div className="flex gap-3 text-[10px]">
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: '#F59E0B' }} /> Receita</span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary" /> Engajamento</span>
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueEngagementData}>
                <defs>
                  <linearGradient id="recGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'hsl(240, 8%, 55%)', fontSize: 11 }} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: 'hsl(240, 8%, 55%)', fontSize: 11 }} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: 'hsl(240, 8%, 55%)', fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area yAxisId="left" type="monotone" dataKey="receita" stroke="#F59E0B" strokeWidth={2} fill="url(#recGrad)" />
                <Line yAxisId="right" type="monotone" dataKey="engajamento" stroke="hsl(263, 70%, 58%)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="glass rounded-xl p-6">
          <h3 className="font-semibold text-sm mb-4">Distribuição de Risco</h3>
          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value">
                  {riskData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {riskData.map((r, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full" style={{ background: r.color }} />
                {r.name} ({r.value}%)
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-semibold text-sm mb-4">Atividade Recente</h3>
        <div className="space-y-2">
          {activityFeed.map((item, i) => (
            <div key={i} className={`glass rounded-xl p-3 border-l-[3px] ${getFeedColor(item.type)} animate-fade-slide-in`} style={{ animationDelay: `${i * 40}ms` }}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <span className="text-xs">{item.text}</span>
                  {item.value && <span className="ml-2 font-mono text-xs font-medium text-[#F59E0B]">{item.value}</span>}
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0 ml-3">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
