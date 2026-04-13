import { useState } from "react";
import { Search, Download, UserPlus, TrendingUp, TrendingDown, Minus, MoreHorizontal, Mail, Calendar, StickyNote, Trash2, History, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { usePlatform, timeAgo } from "@/contexts/PlatformContext";

function getRiskColor(risk: string) {
  if (risk === "low") return "bg-success/15 text-success";
  if (risk === "medium") return "bg-warning/15 text-warning";
  return "bg-destructive/15 text-destructive";
}

function getRiskLabel(risk: string) {
  const map: Record<string, string> = { low: "Baixo", medium: "Médio", high: "Alto", critical: "Crítico" };
  return map[risk] || risk;
}

function getEngagementColor(s: number) {
  if (s >= 70) return "text-success";
  if (s >= 40) return "text-warning";
  return "text-destructive";
}

function getEngagementBg(s: number) {
  if (s >= 70) return "bg-success";
  if (s >= 40) return "bg-warning";
  return "bg-destructive";
}

const riskFilters = ["Todos", "low", "medium", "high", "critical"];
const riskFilterLabels: Record<string, string> = { Todos: "Todos", low: "Baixo", medium: "Médio", high: "Alto", critical: "Crítico" };

const MentorStudents = () => {
  const { state } = usePlatform();
  const [search, setSearch] = useState("");
  const [activeRisk, setActiveRisk] = useState("Todos");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const riskCount = state.students.filter(s => s.engagement.churnRisk === "high" || s.engagement.churnRisk === "critical").length;
  const activeCount = state.students.filter(s => s.engagement.score > 30).length;

  const filtered = state.students.filter(s => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeRisk !== "Todos" && s.engagement.churnRisk !== activeRisk) return false;
    return true;
  });

  const avgProgress = (s: typeof state.students[0]) => {
    const vals = Object.values(s.progress).map(p => p.percentage);
    return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl mb-1">Alunos</h1>
          <p className="text-sm text-muted-foreground">
            {activeCount} alunos ativos · <span className="text-warning">{riskCount} em risco</span> · {state.students.length} total
          </p>
        </div>
        <div className="flex gap-3">
          <button className="glass rounded-xl px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-[rgba(255,255,255,0.06)] transition-all">
            <Download className="h-4 w-4" strokeWidth={1.5} /> Exportar CSV
          </button>
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-4 py-2.5 text-sm flex items-center gap-2 glow-primary transition-all">
            <UserPlus className="h-4 w-4" strokeWidth={1.5} /> Convidar aluno
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nome, e-mail ou curso..."
            className="w-full glass rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {riskFilters.map(f => (
            <button
              key={f}
              onClick={() => setActiveRisk(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeRisk === f ? 'bg-primary/20 text-primary' : 'glass text-muted-foreground hover:text-foreground'}`}
            >
              {riskFilterLabels[f]}
            </button>
          ))}
        </div>
        <div className="text-xs text-muted-foreground">Mostrando {filtered.length} de {state.students.length} alunos</div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.05)]">
                <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3.5 bg-[rgba(255,255,255,0.02)]">Aluno</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3.5 bg-[rgba(255,255,255,0.02)]">Curso(s)</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3.5 bg-[rgba(255,255,255,0.02)]">Engajamento</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3.5 bg-[rgba(255,255,255,0.02)]">Risco</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3.5 bg-[rgba(255,255,255,0.02)]">Progresso</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3.5 bg-[rgba(255,255,255,0.02)]">Último Acesso</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3.5 bg-[rgba(255,255,255,0.02)]">Tendência</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3.5 bg-[rgba(255,255,255,0.02)]">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => {
                const prog = avgProgress(s);
                const isHighRisk = s.engagement.churnRisk === "high" || s.engagement.churnRisk === "critical";
                return (
                  <tr
                    key={s.id}
                    className={`border-t border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.02)] transition-colors animate-fade-slide-in ${
                      isHighRisk ? 'border-l-[3px] border-l-destructive bg-[rgba(248,113,113,0.03)]' : ''
                    }`}
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <td className="px-5 py-4">
                      <Link to={`/mentor/students/${s.id}`} className="flex items-center gap-3 group">
                        <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-xs font-medium text-primary shrink-0">
                          {s.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <div className="font-medium group-hover:text-primary transition-colors">{s.name}</div>
                          <div className="text-[11px] text-muted-foreground">{s.email}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {s.courses.map((cId) => {
                          const course = state.courses.find(c => c.id === cId);
                          return <span key={cId} className="px-2 py-0.5 rounded-md text-[10px] font-medium glass">{course?.title || cId}</span>;
                        })}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className={`h-full rounded-full ${getEngagementBg(s.engagement.score)}`} style={{ width: `${s.engagement.score}%` }} />
                        </div>
                        <span className={`font-mono text-xs font-medium ${getEngagementColor(s.engagement.score)}`}>{s.engagement.score}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-medium ${getRiskColor(s.engagement.churnRisk)}`}>
                        {getRiskLabel(s.engagement.churnRisk)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-14 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${prog}%` }} />
                        </div>
                        <span className="font-mono text-xs">{prog}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">{timeAgo(s.engagement.lastAccessAt)}</td>
                    <td className="px-5 py-4">
                      {s.engagement.trend === "growing" && <TrendingUp className="h-4 w-4 text-success" strokeWidth={1.5} />}
                      {s.engagement.trend === "stable" && <Minus className="h-4 w-4 text-info" strokeWidth={1.5} />}
                      {(s.engagement.trend === "declining" || s.engagement.trend === "critical") && <TrendingDown className="h-4 w-4 text-destructive" strokeWidth={1.5} />}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <Link to={`/mentor/students/${s.id}`} className="px-2.5 py-1 rounded-lg text-[11px] font-medium glass hover:bg-primary/20 hover:text-primary transition-all">
                          Ver perfil
                        </Link>
                        <div className="relative">
                          <button onClick={() => setOpenMenu(openMenu === s.id ? null : s.id)} className="p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-all">
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                          </button>
                          {openMenu === s.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 glass rounded-xl p-1.5 z-50 shadow-xl animate-fade-slide-in">
                              <button className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-[rgba(255,255,255,0.05)] flex items-center gap-2 transition-all">
                                <Mail className="h-3.5 w-3.5" strokeWidth={1.5} /> Enviar mensagem
                              </button>
                              <button className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-[rgba(255,255,255,0.05)] flex items-center gap-2 transition-all">
                                <Calendar className="h-3.5 w-3.5" strokeWidth={1.5} /> Agendar check-in
                              </button>
                              <button className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-[rgba(255,255,255,0.05)] flex items-center gap-2 transition-all">
                                <StickyNote className="h-3.5 w-3.5" strokeWidth={1.5} /> Adicionar nota
                              </button>
                              <button className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-[rgba(255,255,255,0.05)] flex items-center gap-2 transition-all">
                                <History className="h-3.5 w-3.5" strokeWidth={1.5} /> Ver histórico
                              </button>
                              <div className="border-t border-[rgba(255,255,255,0.06)] my-1" />
                              <button className="w-full text-left px-3 py-2 rounded-lg text-xs text-destructive hover:bg-destructive/10 flex items-center gap-2 transition-all">
                                <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} /> Remover do programa
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-[rgba(255,255,255,0.05)]">
          <span className="text-xs text-muted-foreground">Página 1 de 1</span>
          <div className="flex gap-1">
            <button className="p-1.5 rounded-lg glass hover:bg-[rgba(255,255,255,0.05)] transition-all" disabled>
              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            </button>
            <button className="p-1.5 rounded-lg glass hover:bg-[rgba(255,255,255,0.05)] transition-all" disabled>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorStudents;
