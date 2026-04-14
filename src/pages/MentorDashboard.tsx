import { useState, useEffect, useMemo } from "react";
import { Users, DollarSign, BarChart3, AlertTriangle, ShoppingCart, Calendar, CreditCard, Landmark, Receipt } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { usePlatform, formatCurrency } from "@/contexts/PlatformContext";
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
    case "today": return { from: today, to: now, label: "Hoje" };
    case "yesterday": { const y = new Date(today); y.setDate(y.getDate() - 1); return { from: y, to: today, label: "Ontem" }; }
    case "last7": { const f = new Date(today); f.setDate(f.getDate() - 6); return { from: f, to: now, label: "Últimos 7 dias" }; }
    case "last30": { const f = new Date(today); f.setDate(f.getDate() - 29); return { from: f, to: now, label: "Últimos 30 dias" }; }
    case "thisMonth": return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: now, label: "Este mês" };
    default: return { from: today, to: now, label: "Hoje" };
  }
}

/* ── Ring SVG component ── */
function ConversionRing({ percent }: { percent: number }) {
  const r = 16;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <div className="relative w-[42px] h-[42px] shrink-0">
      <svg width="42" height="42" className="-rotate-90">
        <circle cx="21" cy="21" r={r} stroke="#1E1E1E" strokeWidth="3" fill="none" />
        <circle cx="21" cy="21" r={r} stroke={percent === 0 ? '#2A2A2A' : '#FFD700'} strokeWidth="3" fill="none"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          className="transition-all duration-700" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[0.6rem] font-bold" style={{ color: '#FFFFFF' }}>
        {percent}%
      </span>
    </div>
  );
}

const MentorDashboard = () => {
  const { state, paidTransactions } = usePlatform();

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
      return { from: customFrom, to: customTo, label: `${format(customFrom, "dd/MM")} → ${format(customTo, "dd/MM")}` };
    }
    return getPeriodRange(activePeriod);
  }, [activePeriod, customFrom, customTo]);

  const filtered = useMemo(() => {
    return paidTransactions.filter((t) => {
      const d = new Date(t.paidAt || t.createdAt);
      return d >= period.from && d <= period.to;
    });
  }, [paidTransactions, period]);

  const periodRevenue = filtered.reduce((a, t) => a + t.amount, 0);
  const periodSales = filtered.length;
  const ticketMedio = periodSales > 0 ? periodRevenue / periodSales : 0;

  const metrics = [
    { label: "Vendas", value: formatCurrency(periodRevenue), icon: DollarSign },
    { label: "Total de transações", value: String(periodSales), icon: ShoppingCart },
    { label: "Ticket médio", value: formatCurrency(ticketMedio), icon: BarChart3 },
    { label: "Vendas por Pix", value: formatCurrency(0), icon: Landmark },
    { label: "Vendas por cartão", value: formatCurrency(0), icon: CreditCard },
    { label: "Vendas por boleto", value: formatCurrency(0), icon: Receipt },
  ];

  const conversions = [
    { label: "Conversão por PIX", percent: 100 },
    { label: "Conversão por boleto", percent: 100 },
    { label: "Chargebacks", percent: 0 },
  ];

  const topProducts = state.products?.slice(0, 5) || [];

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

  const isLive = activePeriod === "today";
  const headerBadge = isLive ? "AO VIVO — HOJE" : activePeriod === "yesterday" ? "📅 ONTEM" : `📅 ${period.label}`;

  return (
    <div className="flex flex-col gap-4 max-w-[1600px]">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            {isLive && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#FFD700' }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#FFD700' }} />
              </span>
            )}
            <span className="text-[0.65rem] font-bold tracking-[0.12em] uppercase" style={{ color: '#FFD700' }}>{headerBadge}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight capitalize" style={{ color: '#FFFFFF' }}>
            {format(clock, "EEEE, dd 'de' MMMM", { locale: ptBR })}
          </h1>
          <p className="text-xs mt-1" style={{ color: '#555555' }}>Atualizado às {format(clock, "HH:mm")} · dados em tempo real</p>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-2.5">
          <div className="flex gap-1.5 flex-wrap sm:justify-end">
            {periodButtons.map((pb) => (
              <button key={pb.key} onClick={() => setActivePeriod(pb.key)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
                style={{
                  background: activePeriod === pb.key ? 'rgba(255,215,0,0.08)' : 'transparent',
                  border: `1px solid ${activePeriod === pb.key ? 'rgba(255,215,0,0.35)' : '#2A2A2A'}`,
                  color: activePeriod === pb.key ? '#FFD700' : '#666666',
                  fontWeight: activePeriod === pb.key ? 600 : 500,
                }}>
                {pb.label}
              </button>
            ))}
            <Popover>
              <PopoverTrigger asChild>
                <button onClick={() => setActivePeriod("custom")}
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5"
                  style={{
                    background: activePeriod === "custom" ? 'rgba(255,215,0,0.08)' : 'transparent',
                    border: `1px solid ${activePeriod === "custom" ? 'rgba(255,215,0,0.35)' : '#2A2A2A'}`,
                    color: activePeriod === "custom" ? '#FFD700' : '#666666',
                  }}>
                  <Calendar className="h-3 w-3" /> Personalizado
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4" align="end" style={{ background: '#111111', border: '1px solid #2A2A2A' }}>
                <div className="flex flex-col sm:flex-row gap-3 items-end">
                  <div className="flex flex-col gap-1">
                    <label className="text-[0.7rem] uppercase tracking-widest" style={{ color: '#555555' }}>De</label>
                    <Popover><PopoverTrigger asChild>
                      <button className="text-xs px-3 py-2 rounded-lg text-left min-w-[130px]" style={{ background: '#1A1A1A', border: '1px solid #333333', color: '#FFFFFF' }}>
                        {customFrom ? format(customFrom, "dd/MM/yyyy") : "Selecionar"}
                      </button>
                    </PopoverTrigger><PopoverContent className="w-auto p-0" align="start">
                      <CalendarUI mode="single" selected={customFrom} onSelect={setCustomFrom} className="p-3 pointer-events-auto" />
                    </PopoverContent></Popover>
                  </div>
                  <span style={{ color: '#333333', paddingBottom: 8 }}>→</span>
                  <div className="flex flex-col gap-1">
                    <label className="text-[0.7rem] uppercase tracking-widest" style={{ color: '#555555' }}>Até</label>
                    <Popover><PopoverTrigger asChild>
                      <button className="text-xs px-3 py-2 rounded-lg text-left min-w-[130px]" style={{ background: '#1A1A1A', border: '1px solid #333333', color: '#FFFFFF' }}>
                        {customTo ? format(customTo, "dd/MM/yyyy") : "Selecionar"}
                      </button>
                    </PopoverTrigger><PopoverContent className="w-auto p-0" align="start">
                      <CalendarUI mode="single" selected={customTo} onSelect={setCustomTo} className="p-3 pointer-events-auto" />
                    </PopoverContent></Popover>
                  </div>
                  <button onClick={() => { if (customFrom && customTo) setActivePeriod("custom"); }}
                    className="px-5 py-2 rounded-lg text-xs font-bold transition-opacity hover:opacity-85"
                    style={{ background: '#FFD700', color: '#000000' }}>Aplicar</button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* ── TOP ROW: Metrics left | Chart right ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] xl:grid-cols-[360px_1fr] gap-4">
        {/* Metrics column */}
        <div className="flex flex-col gap-2">
          {metrics.map((m, i) => (
            <div key={i} className="glass rounded-[10px] px-5 py-4 flex items-center justify-between animate-fade-slide-in hover:translate-x-0.5 transition-transform"
              style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex flex-col gap-0.5">
                <span className="text-[0.72rem]" style={{ color: '#666666' }}>{m.label}</span>
                <span className="text-[1.35rem] font-bold tracking-tight leading-tight" style={{ color: '#FFFFFF' }}>{m.value}</span>
                <span className="text-[0.65rem]" style={{ color: '#3A3A3A' }}>{period.label}</span>
              </div>
              <div className="w-[34px] h-[34px] rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'rgba(255,215,0,0.07)', border: '1px solid rgba(255,215,0,0.12)' }}>
                <m.icon className="h-4 w-4" style={{ color: '#FFD700', opacity: 0.75 }} strokeWidth={1.5} />
              </div>
            </div>
          ))}
        </div>

        {/* Chart panel */}
        <div className="glass rounded-xl p-6 flex flex-col min-h-[420px]">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="text-base font-semibold" style={{ color: '#FFFFFF' }}>Transações por dia</h3>
              <p className="text-xs mt-0.5" style={{ color: '#555555' }}>{period.label}</p>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="recGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFD700" stopOpacity={0.08} />
                    <stop offset="100%" stopColor="#FFD700" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#444444', fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#444444', fontSize: 10 }} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="receita" stroke="#FFD700" strokeWidth={1.5} fill="url(#recGrad)"
                  dot={{ fill: '#FFD700', r: 3, strokeWidth: 0 }} activeDot={{ fill: '#FFD700', r: 4, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW: Products left | Conversions right ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
        {/* Products panel */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold" style={{ color: '#FFFFFF' }}>Produtos mais vendidos</h3>
            <span className="text-xs cursor-pointer transition-colors hover:text-primary" style={{ color: '#555555' }}>Ver todos</span>
          </div>
          {topProducts.length > 0 ? (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b" style={{ borderColor: '#1A1A1A' }}>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono w-5" style={{ color: '#444444' }}>#{i + 1}</span>
                    <span className="text-sm" style={{ color: '#FFFFFF' }}>{p.name}</span>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: '#FFFFFF' }}>{formatCurrency(p.price)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm" style={{ color: '#444444' }}>Nenhum produto cadastrado ainda.</p>
          )}
        </div>

        {/* Conversions column */}
        <div className="flex flex-col gap-2">
          {conversions.map((c, i) => (
            <div key={i} className="glass rounded-[10px] px-5 py-4 flex items-center justify-between">
              <span className="text-[0.82rem]" style={{ color: '#888888' }}>{c.label}</span>
              <ConversionRing percent={c.percent} />
            </div>
          ))}
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
