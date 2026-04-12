import { useState } from "react";
import { Sparkles, AlertTriangle, Users, TrendingUp, Eye, Mail, Check, X, Clock, ChevronRight, GripVertical } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const dailySummary = {
  text: "Hoje você tem 3 alunos em situação crítica que merecem atenção imediata. O engajamento geral da turma caiu 8% em relação à semana passada. Há 2 oportunidades identificadas de upsell com alunos de alto desempenho próximos de concluir o programa.",
  cards: [
    { label: "Sem acesso hoje", value: "14 alunos", cta: "Ver lista", icon: Eye },
    { label: "Risco crítico", value: "3 alunos", cta: "Agir agora", icon: AlertTriangle },
    { label: "Oportunidades de reativação", value: "7 alunos", cta: "Ver oportunidades", icon: Users },
    { label: "Oportunidades de upsell", value: "4 alunos", cta: "Ver sugestões", icon: TrendingUp },
  ],
};

const alerts = [
  { id: "1", severity: "critical", student: "João Oliveira", desc: "Sem acesso há 9 dias. Engajamento caiu 67% em relação ao mês anterior.", time: "há 2 horas", resolved: false },
  { id: "2", severity: "critical", student: "Beatriz Rocha", desc: "Nunca acessou após matrícula. 15 dias sem atividade.", time: "há 5 horas", resolved: false },
  { id: "3", severity: "critical", student: "Paulo Vieira", desc: "Engajamento caiu 58%. Sem acesso há 7 dias.", time: "há 1 dia", resolved: false },
  { id: "4", severity: "moderate", student: "Maria Costa", desc: "Progresso parado há 7 dias no módulo 3. Engajamento em queda.", time: "há 6 horas", resolved: false },
  { id: "5", severity: "moderate", student: "Juliana Martins", desc: "Sem acesso há 4 dias. Score caiu de 75 para 55.", time: "há 1 dia", resolved: false },
  { id: "6", severity: "info", student: "Lucas Ferreira", desc: "Completou módulo 7. Alto potencial de upsell.", time: "há 3 horas", resolved: false },
  { id: "7", severity: "positive", student: "Ana Silva", desc: "Concluiu 90% do programa. Top performer da turma.", time: "há 1 dia", resolved: false },
];

const suggestions = [
  {
    student: "João Oliveira", risk: "Alto", avatar: "JO",
    context: "João não acessa há 8 dias e estava progredindo bem até a semana passada.",
    action: "Envie uma mensagem de check-in pessoal hoje.",
    message: "Oi João! Vi que faz alguns dias que você não passa por aqui. Como estão as coisas? Tem algo em que posso ajudar para você retomar o programa?",
    category: "Reengajamento",
  },
  {
    student: "Beatriz Rocha", risk: "Alto", avatar: "BR",
    context: "Beatriz se matriculou há 15 dias e nunca acessou a plataforma.",
    action: "Envie uma mensagem de boas-vindas com link direto para a primeira aula.",
    message: "Oi Beatriz! Seja bem-vinda ao programa! Preparei tudo para sua primeira aula. Clique aqui para começar — leva apenas 10 minutos!",
    category: "Ativação",
  },
  {
    student: "Ana Silva", risk: "Baixo", avatar: "AS",
    context: "Ana está com 90% do programa concluído e engajamento de 95.",
    action: "Ofereça o upgrade para mentoria individual.",
    message: "Ana, parabéns pelo progresso incrível! Você está entre os top 5% da turma. Tenho uma oportunidade exclusiva de mentoria individual que pode acelerar ainda mais seus resultados. Quer saber mais?",
    category: "Upsell",
  },
];

const highRisk = [
  { name: "João Oliveira", avatar: "JO", riskScore: 72, factor: "Sem acesso há 8 dias" },
  { name: "Beatriz Rocha", avatar: "BR", riskScore: 85, factor: "Nunca acessou" },
  { name: "Paulo Vieira", avatar: "PV", riskScore: 68, factor: "Engajamento em queda" },
];

const mediumRisk = [
  { name: "Maria Costa", avatar: "MC", engagement: 45, trend: "down" },
  { name: "Juliana Martins", avatar: "JM", engagement: 55, trend: "down" },
  { name: "Rafael Mendes", avatar: "RM", engagement: 62, trend: "stable" },
];

const highEngagement = [
  { name: "Ana Silva", avatar: "AS", engagement: 95, badge: "Top Performer" },
  { name: "Lucas Ferreira", avatar: "LF", engagement: 91, badge: "7 dias seguidos" },
  { name: "Carla Lima", avatar: "CL", engagement: 88, badge: "Módulo completo" },
];

const upsellOpps = [
  { name: "Ana Silva", avatar: "AS", completion: 90, suggestion: "Ofereça a mentoria individual — Ana está próximo de concluir e demonstra alto engajamento.", product: "Mentoria Individual Premium" },
  { name: "Lucas Ferreira", avatar: "LF", completion: 94, suggestion: "Lucas está quase concluindo. Ofereça o programa avançado.", product: "Programa Avançado de Vendas" },
];

const weeklyData = [
  { name: "Semana Anterior", engajamento: 72 },
  { name: "Semana Atual", engajamento: 64 },
];

const weeklyTopEvolved = ["Ana Silva (+12%)", "Lucas Ferreira (+8%)", "Carla Lima (+5%)"];
const weeklyTopRegressed = ["João Oliveira (-42%)", "Beatriz Rocha (-30%)"];

function getSeverityStyle(sev: string) {
  if (sev === "critical") return "border-l-destructive bg-destructive/5";
  if (sev === "moderate") return "border-l-warning bg-warning/5";
  if (sev === "positive") return "border-l-success bg-success/5";
  return "border-l-info bg-info/5";
}

const tooltipStyle = {
  background: 'hsl(240, 12%, 9%)',
  border: '1px solid hsl(240, 10%, 16%)',
  borderRadius: '12px',
  fontSize: '11px',
};

const [alertFilter, setAlertFilter] = ["Todos"] as any; // placeholder

const MentorAI = () => {
  const [activeAlertFilter, setActiveAlertFilter] = useState("Todos");
  const alertFilters = ["Todos", "Críticos", "Moderados", "Informativos", "Resolvidos"];

  const filteredAlerts = alerts.filter(a => {
    if (activeAlertFilter === "Todos") return true;
    if (activeAlertFilter === "Críticos") return a.severity === "critical";
    if (activeAlertFilter === "Moderados") return a.severity === "moderate";
    if (activeAlertFilter === "Informativos") return a.severity === "info" || a.severity === "positive";
    return a.resolved;
  });

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl mb-1">Inteligência IA</h1>
        <p className="text-sm text-muted-foreground">Seu copiloto de mentoria — análises e ações automatizadas</p>
      </div>

      {/* Daily Report */}
      <div className="glass rounded-2xl p-6 border-primary/20 animate-fade-slide-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Relatório de hoje</h3>
            <span className="text-[10px] text-muted-foreground">Gerado às 07:00 · {new Date().toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-5">{dailySummary.text}</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {dailySummary.cards.map((c, i) => (
            <div key={i} className="glass rounded-xl p-4 card-hover animate-fade-slide-in" style={{ animationDelay: `${i * 60}ms` }}>
              <c.icon className="h-4 w-4 text-muted-foreground mb-2" strokeWidth={1.5} />
              <div className="font-mono text-lg font-medium">{c.value}</div>
              <div className="text-[11px] text-muted-foreground">{c.label}</div>
              <button className="mt-2 text-[11px] text-primary hover:underline flex items-center gap-1">{c.cta} <ChevronRight className="h-3 w-3" /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm">Alertas ativos</h3>
            <p className="text-xs text-muted-foreground">{alerts.filter(a => !a.resolved).length} alertas não resolvidos · Ordenados por urgência</p>
          </div>
        </div>
        <div className="flex gap-2">
          {alertFilters.map(f => (
            <button key={f} onClick={() => setActiveAlertFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeAlertFilter === f ? 'bg-primary/20 text-primary' : 'glass text-muted-foreground hover:text-foreground'}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {filteredAlerts.map((a, i) => (
            <div key={a.id} className={`glass rounded-xl p-4 border-l-[3px] ${getSeverityStyle(a.severity)} animate-fade-slide-in`} style={{ animationDelay: `${i * 40}ms` }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-primary hover:underline cursor-pointer">{a.student}</span>
                    <span className="text-[10px] text-muted-foreground">{a.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{a.desc}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button className="px-2.5 py-1.5 rounded-lg text-[11px] bg-primary/20 text-primary hover:bg-primary/30 transition-all flex items-center gap-1">
                    <Mail className="h-3 w-3" /> Enviar mensagem
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-success/10 text-muted-foreground hover:text-success transition-all" title="Marcar como resolvido">
                    <Check className="h-3.5 w-3.5" />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.05)] text-muted-foreground transition-all" title="Ignorar por 7 dias">
                    <Clock className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-sm">Ações recomendadas pela IA</h3>
          <p className="text-xs text-muted-foreground">Baseadas no comportamento real dos seus alunos</p>
        </div>
        <div className="space-y-4">
          {suggestions.map((s, i) => (
            <div key={i} className="glass rounded-2xl p-5 animate-fade-slide-in" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-xs font-medium text-primary shrink-0">{s.avatar}</div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{s.student}</span>
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium ${s.risk === "Alto" ? "bg-destructive/15 text-destructive" : "bg-success/15 text-success"}`}>
                      Risco {s.risk}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-primary/15 text-primary">{s.category}</span>
                  </div>
                  <p className="text-xs text-muted-foreground"><strong>Contexto:</strong> {s.context}</p>
                  <p className="text-xs"><strong>Ação:</strong> {s.action}</p>
                  <div className="glass rounded-xl p-3">
                    <p className="text-xs text-muted-foreground italic">"{s.message}"</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-3 py-1.5 text-xs glow-primary transition-all">
                      Enviar esta mensagem
                    </button>
                    <button className="glass rounded-xl px-3 py-1.5 text-xs hover:bg-[rgba(255,255,255,0.06)] transition-all">
                      Editar antes de enviar
                    </button>
                    <button className="text-xs text-muted-foreground hover:text-foreground transition-all px-2">
                      Ignorar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Segmentation Kanban */}
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-sm">Segmentação inteligente</h3>
          <p className="text-xs text-muted-foreground">Classificação automática dos alunos por comportamento</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* High Risk */}
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-destructive" />
              <h4 className="text-sm font-medium">Alto Risco</h4>
              <span className="ml-auto text-[10px] font-mono text-destructive">{highRisk.length}</span>
            </div>
            <div className="space-y-2">
              {highRisk.map((s, i) => (
                <div key={i} className="glass rounded-xl p-3 border-l-[3px] border-l-destructive card-hover">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-destructive/15 flex items-center justify-center text-[10px] font-medium text-destructive">{s.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{s.name}</div>
                      <div className="text-[10px] text-muted-foreground">{s.factor}</div>
                    </div>
                    <span className="font-mono text-xs text-destructive font-medium">{s.riskScore}%</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-3 glass rounded-xl py-2 text-xs text-destructive hover:bg-destructive/10 transition-all">
              Intervir em todos
            </button>
          </div>

          {/* Medium */}
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-warning" />
              <h4 className="text-sm font-medium">Atenção Necessária</h4>
              <span className="ml-auto text-[10px] font-mono text-warning">{mediumRisk.length}</span>
            </div>
            <div className="space-y-2">
              {mediumRisk.map((s, i) => (
                <div key={i} className="glass rounded-xl p-3 border-l-[3px] border-l-warning card-hover">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-warning/15 flex items-center justify-center text-[10px] font-medium text-warning">{s.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{s.name}</div>
                      <div className="text-[10px] text-muted-foreground">Engajamento: {s.engagement}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-3 glass rounded-xl py-2 text-xs text-warning hover:bg-warning/10 transition-all">
              Enviar mensagem ao grupo
            </button>
          </div>

          {/* High Engagement */}
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-success" />
              <h4 className="text-sm font-medium">Alto Engajamento</h4>
              <span className="ml-auto text-[10px] font-mono text-success">{highEngagement.length}</span>
            </div>
            <div className="space-y-2">
              {highEngagement.map((s, i) => (
                <div key={i} className="glass rounded-xl p-3 border-l-[3px] border-l-success card-hover">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-success/15 flex items-center justify-center text-[10px] font-medium text-success">{s.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{s.name}</div>
                      <div className="text-[10px] text-muted-foreground">{s.badge}</div>
                    </div>
                    <span className="font-mono text-xs text-success font-medium">{s.engagement}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-3 glass rounded-xl py-2 text-xs text-success hover:bg-success/10 transition-all">
              Identificar oportunidades de upsell
            </button>
          </div>
        </div>
      </div>

      {/* Upsell */}
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-sm">Alunos prontos para evoluir</h3>
        </div>
        {upsellOpps.map((u, i) => (
          <div key={i} className="glass rounded-2xl p-5 animate-fade-slide-in" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-success/15 flex items-center justify-center text-xs font-medium text-success">{u.avatar}</div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{u.name}</span>
                  <span className="font-mono text-xs text-success">{u.completion}% concluído</span>
                </div>
                <p className="text-xs text-muted-foreground">{u.suggestion}</p>
                <div className="text-xs"><strong>Produto:</strong> {u.product}</div>
                <button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-3 py-1.5 text-xs glow-primary transition-all">
                  Fazer oferta personalizada
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Report */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-semibold text-sm mb-4">Relatório Semanal de Performance</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-xs text-muted-foreground mb-3">Engajamento: Semana Atual vs Anterior</h4>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(240,8%,55%)', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(240,8%,55%)', fontSize: 11 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="engajamento" fill="hsl(263,70%,58%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="text-xs text-muted-foreground mb-2">Mais evoluíram</h4>
              {weeklyTopEvolved.map((s, i) => (
                <div key={i} className="text-sm flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-success" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
            <div>
              <h4 className="text-xs text-muted-foreground mb-2">Atenção necessária</h4>
              {weeklyTopRegressed.map((s, i) => (
                <div key={i} className="text-sm flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorAI;
