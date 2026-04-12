import { TrendingUp, TrendingDown, Users, DollarSign, BarChart3, AlertTriangle, Activity } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const kpis = [
  { label: "Alunos Ativos", value: "1.247", change: "+12%", up: true, icon: Users },
  { label: "Novos (30d)", value: "89", change: "+8%", up: true, icon: TrendingUp },
  { label: "MRR Estimado", value: "R$ 47.2K", change: "+15%", up: true, icon: DollarSign },
  { label: "Taxa Conclusão", value: "62%", change: "+3%", up: true, icon: BarChart3 },
  { label: "Risco de Churn", value: "8.4%", change: "-2%", up: false, icon: AlertTriangle },
  { label: "Score Saúde", value: "84", change: "+5", up: true, icon: Activity },
];

const engagementData = [
  { day: "01", value: 78 }, { day: "05", value: 82 }, { day: "10", value: 75 },
  { day: "15", value: 90 }, { day: "20", value: 88 }, { day: "25", value: 95 },
  { day: "30", value: 91 },
];

const riskData = [
  { name: "Baixo", value: 72, color: "hsl(142, 70%, 45%)" },
  { name: "Médio", value: 20, color: "hsl(38, 92%, 50%)" },
  { name: "Alto", value: 8, color: "hsl(0, 72%, 51%)" },
];

const topStudents = [
  { name: "Ana Silva", course: "Vendas de Alto Ticket", engagement: 95, lastAccess: "há 2h", progress: 89, risk: "Baixo" },
  { name: "Pedro Santos", course: "Marketing Digital", engagement: 72, lastAccess: "há 1 dia", progress: 65, risk: "Baixo" },
  { name: "Maria Costa", course: "Liderança e Gestão", engagement: 45, lastAccess: "há 5 dias", progress: 30, risk: "Médio" },
  { name: "João Oliveira", course: "Vendas de Alto Ticket", engagement: 28, lastAccess: "há 8 dias", progress: 15, risk: "Alto" },
  { name: "Carla Lima", course: "Copywriting", engagement: 88, lastAccess: "há 3h", progress: 78, risk: "Baixo" },
];

function getRiskColor(risk: string) {
  if (risk === "Baixo") return "bg-success/15 text-success";
  if (risk === "Médio") return "bg-warning/15 text-warning";
  return "bg-destructive/15 text-destructive";
}

function getEngagementColor(score: number) {
  if (score >= 70) return "text-success";
  if (score >= 40) return "text-warning";
  return "text-destructive";
}

const MentorDashboard = () => {
  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="font-display text-2xl mb-1">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral do seu negócio de mentoria</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className="glass rounded-xl p-4 card-hover animate-fade-slide-in"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <kpi.icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
              <span className={`text-[10px] font-mono font-medium flex items-center gap-0.5 ${
                kpi.up ? "text-success" : "text-destructive"
              }`}>
                {kpi.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {kpi.change}
              </span>
            </div>
            <div className="font-mono text-xl font-medium">{kpi.value}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-xl p-6">
          <h3 className="font-semibold text-sm mb-4">Engajamento — Últimos 30 dias</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={engagementData}>
                <defs>
                  <linearGradient id="engGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(263, 70%, 58%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(263, 70%, 58%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'hsl(240, 8%, 55%)', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(240, 8%, 55%)', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(240, 12%, 9%)',
                    border: '1px solid hsl(240, 10%, 16%)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="value" stroke="hsl(263, 70%, 58%)" strokeWidth={2} fill="url(#engGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

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
                <Tooltip
                  contentStyle={{
                    background: 'hsl(240, 12%, 9%)',
                    border: '1px solid hsl(240, 10%, 16%)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
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

      {/* Student Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="p-6 pb-4">
          <h3 className="font-semibold text-sm">Alunos</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-border/50">
                <th className="text-left text-xs text-muted-foreground font-medium px-6 py-3">Aluno</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-6 py-3">Curso</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-6 py-3">Engajamento</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-6 py-3">Último Acesso</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-6 py-3">Progresso</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-6 py-3">Risco</th>
              </tr>
            </thead>
            <tbody>
              {topStudents.map((student, i) => (
                <tr key={i} className="border-t border-border/30 hover:bg-accent/30 transition-colors cursor-pointer">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-xs font-medium text-primary">
                        {student.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="font-medium">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-muted-foreground">{student.course}</td>
                  <td className="px-6 py-3.5">
                    <span className={`font-mono font-medium ${getEngagementColor(student.engagement)}`}>
                      {student.engagement}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-muted-foreground">{student.lastAccess}</td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${student.progress}%` }} />
                      </div>
                      <span className="font-mono text-xs">{student.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getRiskColor(student.risk)}`}>
                      {student.risk}
                    </span>
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

export default MentorDashboard;
