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
    action: "Ofereça o upgrade para IMPLOFY individual.",
    message: "Ana, parabéns pelo progresso incrível! Você está entre os top 5% da turma. Tenho uma oportunidade exclusiva de IMPLOFY individual que pode acelerar ainda mais seus resultados. Quer saber mais?",
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
  { name: "Ana Silva", avatar: "AS", completion: 90, suggestion: "Ofereça a IMPLOFY individual — Ana está próximo de concluir e demonstra alto engajamento.", product: "Mentoria Individual Premium" },
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
  fontSize: '13px',
};

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
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-[24px] sm:text-[28px] font-[800] tracking-tight mb-1">Inteligência IA</h1>
        <p className="text-[13px] sm:text-[14px] font-semibold text-muted-foreground">Seu copiloto de IMPLOFY — análises e ações automatizadas</p>
      </div>

      {/* Daily Report */}
      <div className="glass rounded-[16px] p-5 sm:p-7 border-primary/20 animate-fade-slide-in">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/15 flex items-center justify-center">
            <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-primary" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="font-bold text-[15px] sm:text-[17px]">Relatório de hoje</h3>
            <span className="text-[12px] font-semibold text-muted-foreground">Gerado às 07:00 · {new Date().toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
        <p className="text-[14px] sm:text-[15px] font-medium text-muted-foreground leading-[1.7] mb-6">{dailySummary.text}</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {dailySummary.cards.map((c, i) => (
            <div key={i} className="glass rounded-[16px] p-4 sm:p-5 card-hover animate-fade-slide-in" style={{ animationDelay: `${i * 60}ms` }}>
              <c.icon className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground mb-2" strokeWidth={1.5} />
              <div className="text-[20px] sm:text-[28px] font-[800] tracking-tight">{c.value}</div>
              <div className="text-[12px] sm:text-[13px] font-semibold text-muted-foreground">{c.label}</div>
              <button className="mt-2 text-[12px] sm:text-[13px] font-bold text-primary hover:underline flex items-center gap-1">{c.cta} <ChevronRight className="h-3.5 w-3.5" /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts */}
      <div className="space-y-4 sm:space-y-5">
        <div>
          <h3 className="font-bold text-[18px] sm:text-[20px]">Alertas ativos</h3>
          <p className="text-[12px] sm:text-[13px] font-semibold text-muted-foreground">{alerts.filter(a => !a.resolved).length} alertas não resolvidos · Ordenados por urgência</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {alertFilters.map(f => (
            <button key={f} onClick={() => setActiveAlertFilter(f)}
              className={`px-3 sm:px-4 py-2 rounded-lg text-[13px] sm:text-[14px] font-bold transition-all ${activeAlertFilter === f ? 'bg-primary/20 text-primary' : 'glass text-muted-foreground hover:text-foreground'}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {filteredAlerts.map((a, i) => (
            <div key={a.id} className={`glass rounded-xl p-4 sm:p-5 border-l-[3px] ${getSeverityStyle(a.severity)} animate-fade-slide-in`} style={{ animationDelay: `${i * 40}ms` }}>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[14px] sm:text-[15px] font-bold text-primary hover:underline cursor-pointer">{a.student}</span>
                    <span className="text-[12px] font-semibold text-muted-foreground">{a.time}</span>
                  </div>
                  <p className="text-[13px] sm:text-[14px] font-medium text-muted-foreground leading-[1.6]">{a.desc}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button className="px-3 sm:px-4 py-2 rounded-lg text-[12px] sm:text-[13px] font-bold bg-primary/20 text-primary hover:bg-primary/30 transition-all flex items-center gap-1">
                    <Mail className="h-4 w-4" /> <span className="hidden sm:inline">Enviar</span> mensagem
                  </button>
                  <button className="p-2 rounded-lg hover:bg-success/10 text-muted-foreground hover:text-success transition-all" title="Marcar como resolvido">
                    <Check className="h-4 w-4" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] text-muted-foreground transition-all" title="Ignorar por 7 dias">
                    <Clock className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      <div className="space-y-4 sm:space-y-5">
        <div>
          <h3 className="font-bold text-[18px] sm:text-[20px]">Ações recomendadas pela IA</h3>
          <p className="text-[12px] sm:text-[13px] font-semibold text-muted-foreground">Baseadas no comportamento real dos seus alunos</p>
        </div>
        <div className="space-y-4 sm:space-y-5">
          {suggestions.map((s, i) => (
            <div key={i} className="glass rounded-[16px] p-4 sm:p-6 animate-fade-slide-in" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center text-[13px] font-bold text-primary shrink-0">{s.avatar}</div>
                <div className="flex-1 space-y-3 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-[15px] sm:text-[16px]">{s.student}</span>
                    <span className={`px-2.5 py-1 rounded-lg text-[12px] font-bold ${s.risk === "Alto" ? "bg-destructive/15 text-destructive" : "bg-success/15 text-success"}`}>
                      Risco {s.risk}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-[12px] font-bold bg-primary/15 text-primary">{s.category}</span>
                  </div>
                  <p className="text-[13px] sm:text-[14px] font-medium text-muted-foreground"><strong className="font-bold text-[13px]">Contexto:</strong> {s.context}</p>
                  <p className="text-[13px] sm:text-[14px] font-medium"><strong className="font-bold text-[13px]">Ação:</strong> {s.action}</p>
                  <div className="glass rounded-xl p-3 sm:p-4">
                    <p className="text-[13px] sm:text-[14px] font-medium text-muted-foreground italic leading-[1.7]">"{s.message}"</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-3 sm:px-4 py-2 text-[12px] sm:text-[13px] font-bold glow-primary transition-all">
                      Enviar esta mensagem
                    </button>
                    <button className="glass rounded-lg px-3 sm:px-4 py-2 text-[12px] sm:text-[13px] font-bold hover:bg-[rgba(255,255,255,0.06)] transition-all">
                      Editar antes
                    </button>
                    <button className="text-[12px] sm:text-[13px] font-bold text-muted-foreground hover:text-foreground transition-all px-3">
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
      <div className="space-y-4 sm:space-y-5">
        <div>
          <h3 className="font-bold text-[18px] sm:text-[20px]">Segmentação inteligente</h3>
          <p className="text-[12px] sm:text-[13px] font-semibold text-muted-foreground">Classificação automática dos alunos por comportamento</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {/* High Risk */}
          <div className="glass rounded-[16px] p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-destructive" />
              <h4 className="text-[14px] sm:text-[15px] font-bold">Alto Risco</h4>
              <span className="ml-auto text-[13px] font-[800] text-destructive">{highRisk.length}</span>
            </div>
            <div className="space-y-3">
              {highRisk.map((s, i) => (
                <div key={i} className="glass rounded-xl p-3 border-l-[3px] border-l-destructive card-hover">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-destructive/15 flex items-center justify-center text-[12px] font-bold text-destructive">{s.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] sm:text-[14px] font-semibold truncate">{s.name}</div>
                      <div className="text-[12px] font-medium text-muted-foreground">{s.factor}</div>
                    </div>
                    <span className="text-[14px] text-destructive font-[800]">{s.riskScore}%</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-3 glass rounded-lg py-2.5 text-[13px] font-bold text-destructive hover:bg-destructive/10 transition-all">
              Intervir em todos
            </button>
          </div>

          {/* Medium */}
          <div className="glass rounded-[16px] p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-warning" />
              <h4 className="text-[14px] sm:text-[15px] font-bold">Atenção Necessária</h4>
              <span className="ml-auto text-[13px] font-[800] text-warning">{mediumRisk.length}</span>
            </div>
            <div className="space-y-3">
              {mediumRisk.map((s, i) => (
                <div key={i} className="glass rounded-xl p-3 border-l-[3px] border-l-warning card-hover">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-warning/15 flex items-center justify-center text-[12px] font-bold text-warning">{s.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] sm:text-[14px] font-semibold truncate">{s.name}</div>
                      <div className="text-[12px] font-medium text-muted-foreground">Engajamento: {s.engagement}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-3 glass rounded-lg py-2.5 text-[13px] font-bold text-warning hover:bg-warning/10 transition-all">
              Enviar mensagem ao grupo
            </button>
          </div>

          {/* High Engagement */}
          <div className="glass rounded-[16px] p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-success" />
              <h4 className="text-[14px] sm:text-[15px] font-bold">Alto Engajamento</h4>
              <span className="ml-auto text-[13px] font-[800] text-success">{highEngagement.length}</span>
            </div>
            <div className="space-y-3">
              {highEngagement.map((s, i) => (
                <div key={i} className="glass rounded-xl p-3 border-l-[3px] border-l-success card-hover">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-success/15 flex items-center justify-center text-[12px] font-bold text-success">{s.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] sm:text-[14px] font-semibold truncate">{s.name}</div>
                      <div className="text-[12px] font-medium text-muted-foreground">{s.badge}</div>
                    </div>
                    <span className="text-[14px] text-success font-[800]">{s.engagement}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-3 glass rounded-lg py-2.5 text-[13px] font-bold text-success hover:bg-success/10 transition-all">
              Identificar oportunidades de upsell
            </button>
          </div>
        </div>
      </div>

      {/* Upsell */}
      <div className="space-y-4 sm:space-y-5">
        <div>
          <h3 className="font-bold text-[18px] sm:text-[20px]">Alunos prontos para evoluir</h3>
        </div>
        {upsellOpps.map((u, i) => (
          <div key={i} className="glass rounded-[16px] p-4 sm:p-6 animate-fade-slide-in" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-success/15 flex items-center justify-center text-[13px] font-bold text-success shrink-0">{u.avatar}</div>
              <div className="flex-1 space-y-2 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-[15px]">{u.name}</span>
                  <span className="text-[14px] font-[800] text-success">{u.completion}% concluído</span>
                </div>
                <p className="text-[13px] sm:text-[14px] font-medium text-muted-foreground">{u.suggestion}</p>
                <div className="text-[13px] sm:text-[14px] font-bold"><strong>Produto:</strong> {u.product}</div>
                <button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-4 py-2 text-[13px] font-bold glow-primary transition-all w-full sm:w-auto">
                  Fazer oferta personalizada
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Report */}
      <div className="glass rounded-[16px] p-5 sm:p-7">
        <h3 className="font-bold text-[16px] sm:text-[18px] mb-5">Relatório Semanal de Performance</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-[13px] font-bold text-muted-foreground mb-3">Engajamento: Semana Atual vs Anterior</h4>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(240,8%,55%)', fontSize: 12, fontWeight: 600 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(240,8%,55%)', fontSize: 13, fontWeight: 600 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="engajamento" fill="hsl(51,100%,50%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-5">
            <div>
              <h4 className="text-[13px] font-bold text-muted-foreground mb-2">Mais evoluíram</h4>
              {weeklyTopEvolved.map((s, i) => (
                <div key={i} className="text-[14px] font-semibold flex items-center gap-2 py-1">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-muted-foreground mb-2">Atenção necessária</h4>
              {weeklyTopRegressed.map((s, i) => (
                <div key={i} className="text-[14px] font-semibold flex items-center gap-2 py-1">
                  <div className="w-2 h-2 rounded-full bg-destructive" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sales Intelligence */}
      <div className="space-y-4 sm:space-y-5">
        <div>
          <h3 className="font-bold text-[16px] sm:text-[18px]">Inteligência de Vendas</h3>
          <p className="text-[12px] sm:text-[13px] font-semibold text-muted-foreground">Alertas e oportunidades de vendas</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {[
            { text: "Conversão do Mentoria PATRON caiu 40% esta semana", color: "border-l-destructive bg-destructive/5" },
            { text: "68% dos checkouts abandonados na etapa de pagamento", color: "border-l-warning bg-warning/5" },
            { text: "Assinatura teve 3x mais vendas hoje", color: "border-l-success bg-success/5" },
            { text: "14 assinantes com cartão a vencer em 7 dias", color: "border-l-warning bg-warning/5" },
          ].map((a, i) => (
            <div key={i} className={`glass rounded-xl p-4 sm:p-5 border-l-[3px] ${a.color}`}>
              <p className="text-[13px] sm:text-[14px] font-semibold leading-[1.7]">{a.text}</p>
            </div>
          ))}
        </div>
        <div className="glass rounded-[16px] p-4 sm:p-6">
          <h4 className="text-[14px] sm:text-[15px] font-bold mb-4">Top 5 — Propensão de Upsell</h4>
          <div className="space-y-3">
            {[
              { name: "Ana Silva", avatar: "AS", score: 94, product: "Mentoria Individual" },
              { name: "Lucas Ferreira", avatar: "LF", score: 91, product: "Programa Avançado" },
              { name: "Carla Lima", avatar: "CL", score: 87, product: "Bundle Premium" },
            ].map((s, i) => (
              <div key={i} className="glass rounded-xl p-3 sm:p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-[12px] font-bold text-primary shrink-0">{s.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] sm:text-[14px] font-bold truncate">{s.name}</div>
                  <div className="text-[12px] font-medium text-muted-foreground">{s.product}</div>
                </div>
                <span className="text-[14px] text-success font-[800]">{s.score}%</span>
                <button className="px-3 py-1.5 rounded-lg text-[12px] sm:text-[13px] font-bold bg-primary/20 text-primary hover:bg-primary/30 transition-all hidden sm:block">Oferta</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorAI;
