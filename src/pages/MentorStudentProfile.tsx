import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Mail, Calendar, StickyNote, MoreHorizontal, TrendingDown, AlertTriangle, Eye, MessageSquare, Download as DownloadIcon, Radio } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const studentData = {
  id: "4", name: "João Oliveira", email: "joao@email.com",
  status: "Em Risco", engagement: 28, churnRisk: 72,
  lastOnline: "há 8 dias, 14h", avatar: "JO",
  progress: 15, studyTime: "24h 40min", lessonsCompleted: 20, lessonsTotal: 134, streakCurrent: 0, streakBest: 8,
};

const activityData = [
  { date: "01/03", aulas: 3, comments: 1, downloads: 0, lives: 0 },
  { date: "05/03", aulas: 5, comments: 2, downloads: 1, lives: 1 },
  { date: "10/03", aulas: 4, comments: 0, downloads: 2, lives: 0 },
  { date: "15/03", aulas: 7, comments: 3, downloads: 1, lives: 1 },
  { date: "20/03", aulas: 2, comments: 0, downloads: 0, lives: 0 },
  { date: "25/03", aulas: 1, comments: 0, downloads: 0, lives: 0 },
  { date: "30/03", aulas: 0, comments: 0, downloads: 0, lives: 0 },
];

const heatmapData = Array.from({ length: 84 }, (_, i) => ({
  day: i,
  value: i < 60 ? Math.floor(Math.random() * 8) : Math.floor(Math.random() * 2),
}));

const engagementTrend = [
  { day: "1", val: 65 }, { day: "5", val: 58 }, { day: "10", val: 52 },
  { day: "15", val: 48 }, { day: "20", val: 35 }, { day: "25", val: 30 }, { day: "30", val: 28 },
];

const courses = [
  { name: "Vendas de Alto Ticket", progress: 15, modules: 2, totalModules: 8, lastLesson: "Técnicas de Fechamento", lastLessonDays: "8 dias" },
];

const alerts = [
  { severity: "critical", icon: "🔴", text: "Sem acesso há 8 dias consecutivos", time: "há 2 horas" },
  { severity: "moderate", icon: "🟡", text: "Assistiu apenas 1 aula nos últimos 14 dias", time: "há 1 dia" },
  { severity: "moderate", icon: "🟡", text: "Módulo 3 sem progresso há 10 dias", time: "há 3 dias" },
  { severity: "info", icon: "🔵", text: "Nunca participou de uma live", time: "há 7 dias" },
  { severity: "info", icon: "⚪", text: "Score de engajamento caiu 35% em relação ao mês anterior", time: "há 5 dias" },
];

const interactions = [
  { type: "Mensagem enviada", date: "12/04/2025", detail: "Oi João, notei que você..." },
  { type: "Check-in agendado", date: "10/04/2025", detail: "" },
  { type: "Nota interna adicionada", date: "08/04/2025", detail: "Aluno demonstrou interesse inicial mas parou após módulo 2" },
];

const churnFactors = [
  { factor: "Sem acesso há 8 dias", impact: "+18%" },
  { factor: "Progresso parado no módulo 3", impact: "+12%" },
  { factor: "Nenhum comentário este mês", impact: "+8%" },
];

function getHeatColor(val: number) {
  if (val === 0) return "bg-muted/30";
  if (val <= 2) return "bg-primary/20";
  if (val <= 4) return "bg-primary/40";
  if (val <= 6) return "bg-primary/60";
  return "bg-primary/80";
}

const tooltipStyle = {
  background: 'hsl(240, 12%, 9%)',
  border: '1px solid hsl(240, 10%, 16%)',
  borderRadius: '12px',
  fontSize: '11px',
};

const MentorStudentProfile = () => {
  const { id } = useParams();
  const s = studentData;

  const statusColor = s.status === "Em Risco" ? "bg-warning/15 text-warning" : s.status === "Crítico" ? "bg-destructive/15 text-destructive" : "bg-success/15 text-success";

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Back */}
      <Link to="/mentor/students" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} /> Voltar para Alunos
      </Link>

      {/* Header Banner */}
      <div className="glass rounded-2xl p-6 animate-fade-slide-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-primary/15 flex items-center justify-center text-xl font-display text-primary">
              {s.avatar}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="font-display text-2xl">{s.name}</h1>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-medium ${statusColor}`}>{s.status}</span>
              </div>
              <div className="text-sm text-muted-foreground">{s.email}</div>
              <div className="text-xs text-muted-foreground mt-1">Última vez online: {s.lastOnline}</div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className={`font-mono text-3xl font-medium ${s.engagement < 40 ? 'text-destructive' : s.engagement < 70 ? 'text-warning' : 'text-success'}`}>{s.engagement}</div>
              <div className="text-[10px] text-muted-foreground">Engajamento</div>
            </div>
            <div className="text-center">
              <div className="font-mono text-3xl font-medium text-destructive">{s.churnRisk}%</div>
              <div className="text-[10px] text-muted-foreground">Risco de Churn</div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-4 py-2 text-sm flex items-center gap-2 glow-primary transition-all">
            <Mail className="h-4 w-4" strokeWidth={1.5} /> Enviar mensagem
          </button>
          <button className="glass rounded-xl px-4 py-2 text-sm flex items-center gap-2 hover:bg-[rgba(255,255,255,0.06)] transition-all">
            <Calendar className="h-4 w-4" strokeWidth={1.5} /> Agendar check-in
          </button>
          <button className="glass rounded-xl px-4 py-2 text-sm flex items-center gap-2 hover:bg-[rgba(255,255,255,0.06)] transition-all">
            <StickyNote className="h-4 w-4" strokeWidth={1.5} /> Adicionar nota
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: "📊", label: "Progresso Geral", value: `${s.progress}%` },
          { icon: "⏱️", label: "Tempo de Estudo", value: s.studyTime },
          { icon: "✅", label: "Aulas Concluídas", value: `${s.lessonsCompleted} / ${s.lessonsTotal}` },
          { icon: "🔥", label: "Sequência Atual", value: `${s.streakCurrent} dias`, sub: `Melhor: ${s.streakBest} dias` },
        ].map((kpi, i) => (
          <div key={i} className="glass rounded-2xl p-5 animate-fade-slide-in" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="text-lg mb-2">{kpi.icon}</div>
            <div className="font-mono text-xl font-medium">{kpi.value}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">{kpi.label}</div>
            {kpi.sub && <div className="text-[10px] text-muted-foreground/60 mt-1">{kpi.sub}</div>}
          </div>
        ))}
      </div>

      {/* Activity Chart */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-semibold text-sm mb-4">Histórico de atividade</h3>
        <div className="flex gap-2 mb-4">
          {["7 dias", "30 dias", "3 meses", "Todo período"].map(p => (
            <button key={p} className={`px-3 py-1 rounded-lg text-xs ${p === "30 dias" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"} transition-all`}>{p}</button>
          ))}
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="aulaG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(51,100%,50%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(51,100%,50%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="commentG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(210,100%,60%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(210,100%,60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'hsl(240,8%,55%)', fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(240,8%,55%)', fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="aulas" name="🎬 Aulas" stroke="hsl(51,100%,50%)" strokeWidth={2} fill="url(#aulaG)" />
              <Area type="monotone" dataKey="comments" name="💬 Comentários" stroke="hsl(210,100%,60%)" strokeWidth={2} fill="url(#commentG)" />
              <Area type="monotone" dataKey="downloads" name="📥 Downloads" stroke="hsl(142,70%,45%)" strokeWidth={2} fill="transparent" />
              <Area type="monotone" dataKey="lives" name="📡 Lives" stroke="hsl(38,92%,50%)" strokeWidth={2} fill="transparent" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-4 mt-3">
          {[
            { label: "Aulas", color: "bg-primary" },
            { label: "Comentários", color: "bg-info" },
            { label: "Downloads", color: "bg-success" },
            { label: "Lives", color: "bg-warning" },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <div className={`w-2 h-2 rounded-full ${l.color}`} /> {l.label}
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-semibold text-sm mb-4">Engajamento Semanal</h3>
        <div className="flex flex-wrap gap-1">
          {heatmapData.map((d, i) => (
            <div key={i} className={`w-3 h-3 rounded-[3px] ${getHeatColor(d.value)} transition-colors`} title={`${d.value} ações`} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Progress */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-sm mb-4">Progresso por Curso</h3>
          {courses.map((c, i) => (
            <div key={i} className="space-y-2">
              <div className="font-medium text-sm">{c.name}</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-[hsl(43,74%,49%)]" style={{ width: `${c.progress}%` }} />
                </div>
                <span className="font-mono text-xs">{c.progress}%</span>
              </div>
              <div className="text-[11px] text-muted-foreground">{c.modules} de {c.totalModules} módulos · Última aula: {c.lastLesson} — há {c.lastLessonDays}</div>
            </div>
          ))}
        </div>

        {/* Retention Analysis */}
        <div className="space-y-4">
          {/* Trend */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium">Tendência de Engajamento</h4>
              <span className="flex items-center gap-1 text-xs text-destructive font-medium">
                <TrendingDown className="h-3 w-3" /> Declinante
              </span>
            </div>
            <div className="h-20">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={engagementTrend}>
                  <Line type="monotone" dataKey="val" stroke="hsl(0,72%,51%)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">Engajamento caiu 42% nos últimos 14 dias após pico no dia 12.</p>
          </div>

          {/* Churn Gauge */}
          <div className="glass rounded-2xl p-5">
            <h4 className="text-sm font-medium mb-4">Probabilidade de Abandono</h4>
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-16 overflow-hidden">
                <svg viewBox="0 0 120 60" className="w-full">
                  <path d="M10 55 A50 50 0 0 1 110 55" fill="none" stroke="hsl(240,10%,16%)" strokeWidth="8" strokeLinecap="round" />
                  <path d="M10 55 A50 50 0 0 1 110 55" fill="none" stroke="hsl(0,72%,51%)" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${(s.churnRisk / 100) * 157} 157`} />
                </svg>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                  <div className="font-mono text-2xl font-medium text-destructive">{s.churnRisk}%</div>
                </div>
              </div>
            </div>
            <div className="text-center text-xs text-destructive font-medium mt-2">Risco Alto</div>
            <div className="mt-3 space-y-1.5">
              {churnFactors.map((f, i) => (
                <div key={i} className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">{f.factor}</span>
                  <span className="text-destructive font-mono">{f.impact}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-semibold text-sm mb-4">Alertas Comportamentais</h3>
        <div className="space-y-2">
          {alerts.map((a, i) => (
            <div key={i} className={`flex items-start gap-3 px-4 py-3 rounded-xl ${
              a.severity === "critical" ? "bg-destructive/5 border-l-[3px] border-l-destructive" :
              a.severity === "moderate" ? "bg-warning/5 border-l-[3px] border-l-warning" :
              "bg-[rgba(255,255,255,0.02)] border-l-[3px] border-l-muted"
            } animate-fade-slide-in`} style={{ animationDelay: `${i * 60}ms` }}>
              <span className="text-sm mt-0.5">{a.icon}</span>
              <div className="flex-1">
                <div className="text-sm">{a.text}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interaction History */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-semibold text-sm mb-4">Histórico de Interações do Mentor</h3>
        <div className="space-y-3">
          {interactions.map((int, i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
              <div>
                <span className="font-medium">{int.type}</span>
                <span className="text-muted-foreground"> — {int.date}</span>
                {int.detail && <p className="text-xs text-muted-foreground mt-0.5 italic">"{int.detail}"</p>}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <textarea
            placeholder="Adicionar nota interna..."
            className="w-full glass rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground bg-transparent resize-none focus:outline-none focus:ring-1 focus:ring-primary/50 h-20"
          />
          <button className="mt-2 bg-primary/20 text-primary rounded-xl px-4 py-2 text-sm hover:bg-primary/30 transition-all">
            Salvar nota
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorStudentProfile;
