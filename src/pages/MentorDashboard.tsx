import { useState, useEffect, useMemo } from "react";
import { TrendingUp, Users, DollarSign, BarChart3, AlertTriangle, Activity, ShoppingCart, Calendar } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { usePlatform, formatCurrency, daysBetween } from "@/contexts/PlatformContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const tooltipStyle = {
  background: '#111111',
  border: '1px solid rgba(255,215,0,0.2)',
  borderRadius: '8px',
  fontSize: '12px',
  color: '#FFFFFF',
};

type PeriodKey = "today" | "yesterday" | "last7" | "last30" | "thisMonth" | "custom";

function getPeriodRange(key: PeriodKey): { from: Date; to: Date; label: string } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  switch (key) {
    case "today":
      return { from: today, to: now, label: "Hoje" };
    case "yesterday": {
      const y = new Date(today);
      y.setDate(y.getDate() - 1);
      return { from: y, to: today, label: "Ontem" };
    }
    case "last7": {
      const f = new Date(today);
      f.setDate(f.getDate() - 6);
      return { from: f, to: now, label: "Últimos 7 dias" };
    }
    case "last30": {
      const f = new Date(today);
      f.setDate(f.getDate() - 29);
      return { from: f, to: now, label: "Últimos 30 dias" };
    }
    case "thisMonth":
      return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: now, label: "Este mês" };
    default:
      return { from: today, to: now, label: "Hoje" };
  }
}

const MentorDashboard = () => {
  const { state, totalRevenue, activeStudents, studentsAtRisk, avgCompletionRate, businessHealthScore, paidTransactions } = usePlatform();

  const [activePeriod, setActivePeriod] = useState<PeriodKey>("today");
  const [customFrom, setCustomFrom] = useState<Date | undefined>();
  const [customTo, setCustomTo] = useState<Date | undefined>();
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setClock(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  const period = useMemo(() => {
    if (activePeriod === "custom" && customFrom && customTo) {
      return {
        from: customFrom,
        to: customTo,
        label: `${format(customFrom, "dd/MM")} → ${format(customTo, "dd/MM")}`,
      };
    }
    return getPeriodRange(activePeriod);
  }, [activePeriod, customFrom, customTo]);

  const filteredTransactions = useMemo(() => {
    return paidTransactions.filter((t) => {
      const d = new Date(t.paidAt || t.createdAt);
      return d >= period.from && d <= period.to;
    });
  }, [paidTransactions, period]);

  const periodRevenue = filteredTransactions.reduce((a, t) => a + t.amount, 0);
  const periodSales = filteredTransactions.length;
  const availableBalance = filteredTransactions.reduce((a, t) => a + t.liquido, 0);
  const mrr = filteredTransactions.reduce((a, t) => a + t.amount, 0) * 0.15;

  const kpis = [
    { label: "Receita", value: formatCurrency(periodRevenue), sub: `${period.label} · ${periodSales} transações`, icon: DollarSign },
    { label: "Vendas", value: String(periodSales), sub: `${period.label} · ${periodSales} transações`, icon: ShoppingCart },
    { label: "Alunos Ativos", value: String(activeStudents), sub: `de ${state.students.length} total`, icon: Users },
    { label: "Risco de Churn", value: `${studentsAtRisk}`, sub: "alunos em risco", icon: AlertTriangle },
    { label: "Taxa Conclusão", value: `${avgCompletionRate}%`, sub: "média geral", icon: BarChart3 },
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

  const periodButtons: { key: PeriodKey; label: string }[] = [
    { key: "today", label: "Hoje" },
    { key: "yesterday", label: "Ontem" },
    { key: "last7", label: "7 dias" },
    { key: "last30", label: "30 dias" },
    { key: "thisMonth", label: "Este mês" },
  ];

  const headerBadge = activePeriod === "today"
    ? "AO VIVO — HOJE"
    : activePeriod === "yesterday"
    ? "📅 ONTEM"
    : `📅 ${period.label}`;

  const isLive = activePeriod === "today";

  return (
    <div className="space-y-6 max-w-6xl">
      {/* ── Dashboard Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            {isLive && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#FFD700' }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#FFD700' }} />
              </span>
            )}
            <span className="text-[0.65rem] font-bold tracking-[0.12em] uppercase" style={{ color: '#FFD700' }}>
              {headerBadge}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight capitalize" style={{ color: '#FFFFFF' }}>
            {format(clock, "EEEE, dd 'de' MMMM", { locale: ptBR })}
          </h1>
          <p className="text-xs mt-1" style={{ color: '#555555' }}>
            Atualizado às {format(clock, "HH:mm")} · dados em tempo real
          </p>
        </div>

        {/* ── Date Filters ── */}
        <div className="flex flex-col items-start sm:items-end gap-2.5">
          <div className="flex gap-1.5 flex-wrap sm:justify-end">
            {periodButtons.map((pb) => (
              <button
                key={pb.key}
                onClick={() => setActivePeriod(pb.key)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
                style={{
                  background: activePeriod === pb.key ? 'rgba(255,215,0,0.08)' : 'transparent',
                  border: `1px solid ${activePeriod === pb.key ? 'rgba(255,215,0,0.35)' : '#2A2A2A'}`,
                  color: activePeriod === pb.key ? '#FFD700' : '#666666',
                  fontWeight: activePeriod === pb.key ? 600 : 500,
                }}
              >
                {pb.label}
              </button>
            ))}

            <Popover>
              <PopoverTrigger asChild>
                <button
                  onClick={() => setActivePeriod("custom")}
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5"
                  style={{
                    background: activePeriod === "custom" ? 'rgba(255,215,0,0.08)' : 'transparent',
                    border: `1px solid ${activePeriod === "custom" ? 'rgba(255,215,0,0.35)' : '#2A2A2A'}`,
                    color: activePeriod === "custom" ? '#FFD700' : '#666666',
                  }}
                >
                  <Calendar className="h-3 w-3" />
                  Personalizado
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4 glass" align="end" style={{ background: '#111111', border: '1px solid #2A2A2A' }}>
                <div className="flex flex-col sm:flex-row gap-3 items-end">
                  <div className="flex flex-col gap-1">
                    <label className="text-[0.7rem] uppercase tracking-widest" style={{ color: '#555555' }}>De</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="text-xs px-3 py-2 rounded-lg text-left min-w-[130px]"
                          style={{ background: '#1A1A1A', border: '1px solid #333333', color: '#FFFFFF' }}>
                          {customFrom ? format(customFrom, "dd/MM/yyyy") : "Selecionar"}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarUI mode="single" selected={customFrom} onSelect={setCustomFrom}
                          className="p-3 pointer-events-auto" />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <span style={{ color: '#333333', paddingBottom: 8 }}>→</span>
                  <div className="flex flex-col gap-1">
                    <label className="text-[0.7rem] uppercase tracking-widest" style={{ color: '#555555' }}>Até</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="text-xs px-3 py-2 rounded-lg text-left min-w-[130px]"
                          style={{ background: '#1A1A1A', border: '1px solid #333333', color: '#FFFFFF' }}>
                          {customTo ? format(customTo, "dd/MM/yyyy") : "Selecionar"}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarUI mode="single" selected={customTo} onSelect={setCustomTo}
                          className="p-3 pointer-events-auto" />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <button
                    onClick={() => { if (customFrom && customTo) setActivePeriod("custom"); }}
                    className="px-5 py-2 rounded-lg text-xs font-bold transition-opacity hover:opacity-85"
                    style={{ background: '#FFD700', color: '#000000' }}
                  >
                    Aplicar
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="glass rounded-xl p-5 animate-fade-slide-in" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255, 215, 0, 0.08)' }}>
                <kpi.icon className="h-4 w-4" style={{ color: '#FFD700', opacity: 0.7 }} strokeWidth={1.5} />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight" style={{ color: '#FFFFFF' }}>{kpi.value}</div>
            <div className="text-xs mt-1" style={{ color: '#666666' }}>{kpi.label}</div>
            <div className="text-[0.7rem] mt-1" style={{ color: '#444444' }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-xl p-6">
          <div className="mb-4">
            <h3 className="text-base font-semibold" style={{ color: '#FFFFFF' }}>Transações por dia</h3>
            <p className="text-xs mt-0.5" style={{ color: '#555555' }}>{period.label}</p>
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

      {/* ── Activity Feed ── */}
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
