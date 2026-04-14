import { useState } from "react";
import { Download, FileText } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const engagementOverTime = [
  { day: "01", value: 78 }, { day: "05", value: 82 }, { day: "10", value: 75 },
  { day: "15", value: 90 }, { day: "20", value: 88 }, { day: "25", value: 72 }, { day: "30", value: 64 },
];

const engagementDistribution = [
  { range: "0-20", count: 8 }, { range: "21-40", count: 15 }, { range: "41-60", count: 32 },
  { range: "61-80", count: 45 }, { range: "81-100", count: 27 },
];

const progressByModule = [
  { name: "Mod 1: Fundamentos", completion: 92 },
  { name: "Mod 2: Prospecção", completion: 78 },
  { name: "Mod 3: Técnicas", completion: 45 },
  { name: "Mod 4: Negociação", completion: 32 },
  { name: "Mod 5: Fechamento", completion: 18 },
  { name: "Mod 6: Pós-venda", completion: 8 },
];

const churnData = [
  { month: "Out", rate: 5.2 }, { month: "Nov", rate: 4.8 }, { month: "Dez", rate: 6.1 },
  { month: "Jan", rate: 7.3 }, { month: "Fev", rate: 8.0 }, { month: "Mar", rate: 8.4 },
];

const riskOverTime = [
  { month: "Jan", baixo: 75, medio: 18, alto: 7 },
  { month: "Fev", baixo: 72, medio: 20, alto: 8 },
  { month: "Mar", baixo: 68, medio: 22, alto: 10 },
];

const levelDistribution = [
  { name: "Iniciante", value: 35, color: "hsl(240,8%,55%)" },
  { name: "Aprendiz", value: 28, color: "hsl(51,100%,50%)" },
  { name: "Praticante", value: 20, color: "hsl(210,100%,60%)" },
  { name: "Avançado", value: 12, color: "hsl(142,70%,45%)" },
  { name: "Expert", value: 4, color: "hsl(38,92%,50%)" },
  { name: "Mestre", value: 1, color: "hsl(0,72%,51%)" },
];

const topStudents = [
  { name: "Ana Silva", xp: 8420, engagement: 95 },
  { name: "Lucas Ferreira", xp: 7850, engagement: 91 },
  { name: "Carla Lima", xp: 6920, engagement: 88 },
  { name: "Fernando Alves", xp: 5440, engagement: 82 },
  { name: "Pedro Santos", xp: 4210, engagement: 72 },
];

const bottomStudents = [
  { name: "Beatriz Rocha", engagement: 18 },
  { name: "João Oliveira", engagement: 28 },
  { name: "Maria Costa", engagement: 45 },
];

const tooltipStyle = {
  background: 'hsl(240, 12%, 9%)',
  border: '1px solid hsl(240, 10%, 16%)',
  borderRadius: '12px',
  fontSize: '11px',
};

const MentorReports = () => {
  const [activeTab, setActiveTab] = useState("engagement");
  const tabs = [
    { id: "engagement", label: "Engajamento" },
    { id: "progress", label: "Progresso" },
    { id: "churn", label: "Churn & Retenção" },
    { id: "gamification", label: "Gamificação" },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl mb-1">Relatórios</h1>
          <p className="text-sm text-muted-foreground">Analytics avançado do seu negócio</p>
        </div>
        <button className="glass rounded-xl px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-[rgba(255,255,255,0.06)] transition-all">
          <FileText className="h-4 w-4" strokeWidth={1.5} /> Gerar relatório completo
        </button>
      </div>

      <div className="flex gap-1 glass rounded-xl p-1">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === t.id ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Engagement */}
      {activeTab === "engagement" && (
        <div className="space-y-6 animate-fade-slide-in">
          <div className="flex gap-2 items-center">
            <span className="text-xs text-muted-foreground">Período:</span>
            {["30 dias", "60 dias", "90 dias"].map(p => (
              <button key={p} className={`px-3 py-1 rounded-lg text-xs ${p === "30 dias" ? "bg-primary/20 text-primary" : "glass text-muted-foreground hover:text-foreground"} transition-all`}>{p}</button>
            ))}
            <button className="ml-auto glass rounded-lg px-3 py-1.5 text-xs flex items-center gap-1.5 hover:bg-[rgba(255,255,255,0.06)] transition-all">
              <Download className="h-3 w-3" strokeWidth={1.5} /> Exportar
            </button>
          </div>
          <div className="glass rounded-2xl p-6">
            <h3 className="font-semibold text-sm mb-4">Engajamento médio da turma</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={engagementOverTime}>
                  <defs>
                    <linearGradient id="engGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(51,100%,50%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(51,100%,50%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'hsl(240,8%,55%)', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(240,8%,55%)', fontSize: 11 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="value" stroke="hsl(51,100%,50%)" strokeWidth={2} fill="url(#engGrad2)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="glass rounded-2xl p-6">
            <h3 className="font-semibold text-sm mb-4">Distribuição de scores</h3>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engagementDistribution}>
                  <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fill: 'hsl(240,8%,55%)', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(240,8%,55%)', fontSize: 11 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" fill="hsl(51,100%,50%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass rounded-2xl p-6">
              <h3 className="font-semibold text-sm mb-4">Top 5 mais engajados</h3>
              {topStudents.map((s, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-[rgba(255,255,255,0.04)] last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground font-mono w-4">{i + 1}</span>
                    <span className="text-sm">{s.name}</span>
                  </div>
                  <span className="font-mono text-xs text-success">{s.engagement}</span>
                </div>
              ))}
            </div>
            <div className="glass rounded-2xl p-6">
              <h3 className="font-semibold text-sm mb-4">Menor engajamento</h3>
              {bottomStudents.map((s, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-[rgba(255,255,255,0.04)] last:border-0">
                  <span className="text-sm">{s.name}</span>
                  <span className="font-mono text-xs text-destructive">{s.engagement}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Progress */}
      {activeTab === "progress" && (
        <div className="space-y-6 animate-fade-slide-in">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Progresso médio por módulo</h3>
              <button className="glass rounded-lg px-3 py-1.5 text-xs flex items-center gap-1.5 hover:bg-[rgba(255,255,255,0.06)] transition-all">
                <Download className="h-3 w-3" strokeWidth={1.5} /> Exportar
              </button>
            </div>
            <div className="space-y-3">
              {progressByModule.map((m, i) => {
                const isBottleneck = i > 0 && m.completion < progressByModule[i - 1].completion * 0.7;
                return (
                  <div key={i} className={`flex items-center gap-4 ${isBottleneck ? 'px-3 py-2 rounded-xl bg-destructive/5 border-l-[3px] border-l-destructive' : ''}`}>
                    <span className="text-xs text-muted-foreground w-40 truncate">{m.name}</span>
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div className={`h-full rounded-full ${isBottleneck ? 'bg-destructive' : 'bg-primary'}`} style={{ width: `${m.completion}%` }} />
                    </div>
                    <span className={`font-mono text-xs w-10 text-right ${isBottleneck ? 'text-destructive font-medium' : ''}`}>{m.completion}%</span>
                    {isBottleneck && <span className="text-[9px] text-destructive">⚠ Gargalo</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Churn */}
      {activeTab === "churn" && (
        <div className="space-y-6 animate-fade-slide-in">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Taxa de churn mensal</h3>
              <button className="glass rounded-lg px-3 py-1.5 text-xs flex items-center gap-1.5 hover:bg-[rgba(255,255,255,0.06)] transition-all">
                <Download className="h-3 w-3" strokeWidth={1.5} /> Exportar
              </button>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={churnData}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(240,8%,55%)', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(240,8%,55%)', fontSize: 11 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="rate" stroke="hsl(0,72%,51%)" strokeWidth={2} dot={{ fill: 'hsl(0,72%,51%)', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="glass rounded-2xl p-6">
            <h3 className="font-semibold text-sm mb-4">Distribuição de risco ao longo do tempo</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={riskOverTime}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(240,8%,55%)', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(240,8%,55%)', fontSize: 11 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="baixo" stackId="1" stroke="hsl(142,70%,45%)" fill="hsl(142,70%,45%)" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="medio" stackId="1" stroke="hsl(38,92%,50%)" fill="hsl(38,92%,50%)" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="alto" stackId="1" stroke="hsl(0,72%,51%)" fill="hsl(0,72%,51%)" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-3">
              {[{ name: "Baixo", color: "bg-success" }, { name: "Médio", color: "bg-warning" }, { name: "Alto", color: "bg-destructive" }].map(r => (
                <div key={r.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className={`w-2 h-2 rounded-full ${r.color}`} /> {r.name}
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="glass rounded-2xl p-5">
              <div className="text-[11px] text-muted-foreground mb-1">Alunos que abandonaram (30d)</div>
              <div className="font-mono text-2xl font-medium text-destructive">12</div>
            </div>
            <div className="glass rounded-2xl p-5">
              <div className="text-[11px] text-muted-foreground mb-1">Taxa de retenção</div>
              <div className="font-mono text-2xl font-medium text-success">91.6%</div>
              <div className="text-[10px] text-muted-foreground">Benchmark do setor: 85%</div>
            </div>
          </div>
        </div>
      )}

      {/* Gamification */}
      {activeTab === "gamification" && (
        <div className="space-y-6 animate-fade-slide-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass rounded-2xl p-6">
              <h3 className="font-semibold text-sm mb-4">Distribuição de níveis</h3>
              <div className="h-48 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={levelDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={3} dataKey="value">
                      {levelDistribution.map((entry, i) => (
                        <Cell key={i} fill={entry.color} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-3 mt-2">
                {levelDistribution.map((l, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <div className="w-2 h-2 rounded-full" style={{ background: l.color }} /> {l.name} ({l.value}%)
                  </div>
                ))}
              </div>
            </div>
            <div className="glass rounded-2xl p-6">
              <h3 className="font-semibold text-sm mb-4">Top alunos por XP</h3>
              {topStudents.map((s, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-[rgba(255,255,255,0.04)] last:border-0">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-medium ${i < 3 ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>{i + 1}</span>
                    <span className="text-sm">{s.name}</span>
                  </div>
                  <span className="font-mono text-xs text-primary font-medium">{s.xp.toLocaleString()} XP</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorReports;
