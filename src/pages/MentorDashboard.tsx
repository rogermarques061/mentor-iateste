import { TrendingUp, Users, DollarSign, BarChart3, AlertTriangle, Activity, ShoppingCart, CreditCard } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { usePlatform, formatCurrency, daysBetween } from "@/contexts/PlatformContext";

const tooltipStyle = {
  background: '#111111',
  border: '1px solid rgba(255,215,0,0.2)',
  borderRadius: '8px',
  fontSize: '12px',
  color: '#FFFFFF',
};

const MentorDashboard = () => {
  const { state, totalRevenue, activeStudents, studentsAtRisk, avgEngagement, avgCompletionRate, businessHealthScore, paidTransactions } = usePlatform();

  const todaySales = paidTransactions.filter(t => daysBetween(t.paidAt || t.createdAt, new Date()) === 0).length;
  const availableBalance = paidTransactions.reduce((a, t) => a + t.liquido, 0);
  const mrr = paidTransactions.filter(t => daysBetween(t.paidAt || t.createdAt, new Date()) <= 30).reduce((a, t) => a + t.amount, 0) * 0.15;

  const kpis = [
    { label: "Receita (mês)", value: formatCurrency(totalRevenue), change: "+18%", icon: DollarSign },
    { label: "MRR", value: formatCurrency(mrr), change: "+12%", icon: TrendingUp },
    { label: "Vendas Hoje", value: String(todaySales), change: `+${todaySales}`, icon: ShoppingCart },
    { label: "Saldo Disponível", value: formatCurrency(availableBalance), change: "", icon: DollarSign },
    { label: "Alunos Ativos", value: String(activeStudents), change: `de ${state.students.length}`, icon: Users },
    { label: "Risco de Churn", value: `${studentsAtRisk}`, change: "alunos", icon: AlertTriangle },
    { label: "Taxa Conclusão", value: `${avgCompletionRate}%`, change: "+3%", icon: BarChart3 },
    { label: "Score Saúde", value: String(businessHealthScore), change: "", icon: Activity },
  ];

  const riskData = [
    { name: "Baixo", value: state.students.filter(s => s.engagement.churnRisk === "low").length, color: "hsl(0, 0%, 40%)" },
    { name: "Médio", value: state.students.filter(s => s.engagement.churnRisk === "medium").length, color: "hsl(0, 0%, 60%)" },
    { name: "Alto", value: state.students.filter(s => s.engagement.churnRisk === "high" || s.engagement.churnRisk === "critical").length, color: "hsl(51, 100%, 50%)" },
  ];

  const revenueData = [
    { day: "01", receita: 1200 }, { day: "05", receita: 3400 },
    { day: "10", receita: 2800 }, { day: "15", receita: 5600 },
    { day: "20", receita: 4200 }, { day: "25", receita: 6800 },
    { day: "30", receita: 7400 },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Visão Geral</h1>
        <p className="text-sm" style={{ color: '#666666' }}>Painel executivo do seu negócio</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="glass rounded-xl p-5 animate-fade-slide-in" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255, 215, 0, 0.08)' }}>
                <kpi.icon className="h-4 w-4" style={{ color: '#FFD700', opacity: 0.7 }} strokeWidth={1.5} />
              </div>
              {kpi.change && (
                <span className="text-[11px] font-mono font-medium" style={{ color: '#FFFFFF' }}>
                  {kpi.change}
                </span>
              )}
            </div>
            <div className="text-2xl font-bold tracking-tight" style={{ color: '#FFFFFF' }}>{kpi.value}</div>
            <div className="text-xs mt-1" style={{ color: '#666666' }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Main content: Chart + Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-xl p-6">
          <div className="mb-4">
            <h3 className="text-base font-semibold" style={{ color: '#FFFFFF' }}>Transações por dia</h3>
            <p className="text-xs mt-0.5" style={{ color: '#555555' }}>Últimos 30 dias</p>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="recGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFD700" stopOpacity={0.08} />
                    <stop offset="100%" stopColor="#FFD700" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#444444', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#444444', fontSize: 11 }} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="receita" stroke="#FFD700" strokeWidth={1.5} fill="url(#recGrad)" dot={{ fill: '#FFD700', r: 3, strokeWidth: 0 }} activeDot={{ fill: '#FFD700', r: 4, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-xl p-6">
          <h3 className="text-sm font-semibold mb-4" style={{ color: '#FFFFFF' }}>Distribuição de Risco</h3>
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
              <div key={i} className="flex items-center gap-1.5 text-xs" style={{ color: '#888888' }}>
                <div className="w-2 h-2 rounded-full" style={{ background: r.color }} />
                {r.name} ({r.value})
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-sm font-semibold mb-4" style={{ color: '#FFFFFF' }}>Atividade Recente</h3>
        <div className="space-y-2">
          {state.notifications.slice(0, 8).map((item, i) => (
            <div key={item.id} className="glass rounded-xl p-3 border-l-[3px] animate-fade-slide-in" style={{
              animationDelay: `${i * 40}ms`,
              borderLeftColor: item.type === 'sale' ? '#FFD700' : item.type === 'alert' ? 'hsl(0, 84%, 60%)' : '#666666'
            }}>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: '#FFFFFF' }}>{item.title} {item.message}</span>
                <span className="text-[10px] shrink-0 ml-3" style={{ color: '#555555' }}>
                  {new Date(item.timestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
