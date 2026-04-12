import { useState } from "react";
import { Search, Download, UserPlus, TrendingUp, TrendingDown, Minus, MoreHorizontal, Mail, Calendar, StickyNote, Trash2, History, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const allStudents = [
  { id: "1", name: "Ana Silva", email: "ana@email.com", courses: ["Vendas de Alto Ticket"], engagement: 95, risk: "Baixo", progress: 89, lastAccess: "há 2h", trend: "up" as const },
  { id: "2", name: "Pedro Santos", email: "pedro@email.com", courses: ["Marketing Digital"], engagement: 72, risk: "Baixo", progress: 65, lastAccess: "há 1 dia", trend: "stable" as const },
  { id: "3", name: "Maria Costa", email: "maria@email.com", courses: ["Liderança e Gestão"], engagement: 45, risk: "Médio", progress: 30, lastAccess: "há 5 dias", trend: "down" as const },
  { id: "4", name: "João Oliveira", email: "joao@email.com", courses: ["Vendas de Alto Ticket", "Copywriting"], engagement: 28, risk: "Alto", progress: 15, lastAccess: "há 8 dias", trend: "down" as const },
  { id: "5", name: "Carla Lima", email: "carla@email.com", courses: ["Copywriting"], engagement: 88, risk: "Baixo", progress: 78, lastAccess: "há 3h", trend: "up" as const },
  { id: "6", name: "Rafael Mendes", email: "rafael@email.com", courses: ["Marketing Digital", "Vendas de Alto Ticket"], engagement: 62, risk: "Médio", progress: 52, lastAccess: "há 3 dias", trend: "stable" as const },
  { id: "7", name: "Beatriz Rocha", email: "beatriz@email.com", courses: ["Liderança e Gestão"], engagement: 18, risk: "Alto", progress: 8, lastAccess: "há 15 dias", trend: "down" as const },
  { id: "8", name: "Lucas Ferreira", email: "lucas@email.com", courses: ["Vendas de Alto Ticket"], engagement: 91, risk: "Baixo", progress: 94, lastAccess: "há 1h", trend: "up" as const },
  { id: "9", name: "Juliana Martins", email: "juliana@email.com", courses: ["Copywriting"], engagement: 55, risk: "Médio", progress: 42, lastAccess: "há 4 dias", trend: "down" as const },
  { id: "10", name: "Fernando Alves", email: "fernando@email.com", courses: ["Marketing Digital"], engagement: 82, risk: "Baixo", progress: 71, lastAccess: "há 6h", trend: "up" as const },
];

const statusFilters = ["Todos", "Ativo", "Em risco", "Crítico", "Inativo"];
const riskFilters = ["Todos", "Baixo", "Médio", "Alto"];
const accessFilters = ["Todos", "Hoje", "7 dias", "+7 dias", "+30 dias"];
const sortOptions = ["Risco", "Último acesso", "Engajamento", "Nome", "Progresso"];

function getRiskColor(risk: string) {
  if (risk === "Baixo") return "bg-success/15 text-success";
  if (risk === "Médio") return "bg-warning/15 text-warning";
  return "bg-destructive/15 text-destructive";
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

function getAccessColor(access: string) {
  if (access.includes("h")) return "text-muted-foreground";
  if (access.includes("1 dia")) return "text-muted-foreground";
  if (access.includes("dias")) {
    const d = parseInt(access);
    if (d >= 7) return "text-destructive";
    if (d >= 3) return "text-warning";
  }
  return "text-muted-foreground";
}

function isHighRiskRow(risk: string, lastAccess: string) {
  return risk === "Alto" || lastAccess.includes("15");
}

const MentorStudents = () => {
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState("Todos");
  const [activeRisk, setActiveRisk] = useState("Todos");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const riskCount = allStudents.filter(s => s.risk === "Alto" || s.risk === "Médio").length;
  const activeCount = allStudents.filter(s => s.engagement > 30).length;

  const filtered = allStudents.filter(s => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeRisk !== "Todos" && s.risk !== activeRisk) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl mb-1">Alunos</h1>
          <p className="text-sm text-muted-foreground">
            {activeCount} alunos ativos · <span className="text-warning">{riskCount} em risco</span> · 3 novos este mês
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

      {/* Filters */}
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
              {f}
            </button>
          ))}
        </div>
        <div className="text-xs text-muted-foreground">Mostrando {filtered.length} de {allStudents.length} alunos</div>
      </div>

      {/* Table */}
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
              {filtered.map((s, i) => (
                <tr
                  key={s.id}
                  className={`border-t border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.02)] transition-colors animate-fade-slide-in ${
                    isHighRiskRow(s.risk, s.lastAccess) ? 'border-l-[3px] border-l-destructive bg-[rgba(248,113,113,0.03)]' : ''
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
                      {s.courses.map((c, ci) => (
                        <span key={ci} className="px-2 py-0.5 rounded-md text-[10px] font-medium glass">{c}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className={`h-full rounded-full ${getEngagementBg(s.engagement)}`} style={{ width: `${s.engagement}%` }} />
                      </div>
                      <span className={`font-mono text-xs font-medium ${getEngagementColor(s.engagement)}`}>{s.engagement}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-medium ${getRiskColor(s.risk)}`}>{s.risk}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-14 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${s.progress}%` }} />
                      </div>
                      <span className="font-mono text-xs">{s.progress}%</span>
                    </div>
                  </td>
                  <td className={`px-5 py-4 text-xs ${getAccessColor(s.lastAccess)}`}>{s.lastAccess}</td>
                  <td className="px-5 py-4">
                    {s.trend === "up" && <TrendingUp className="h-4 w-4 text-success" strokeWidth={1.5} />}
                    {s.trend === "stable" && <Minus className="h-4 w-4 text-info" strokeWidth={1.5} />}
                    {s.trend === "down" && <TrendingDown className="h-4 w-4 text-destructive" strokeWidth={1.5} />}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <Link to={`/mentor/students/${s.id}`} className="px-2.5 py-1 rounded-lg text-[11px] font-medium glass hover:bg-primary/20 hover:text-primary transition-all">
                        Ver perfil
                      </Link>
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenu(openMenu === s.id ? null : s.id)}
                          className="p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-all"
                        >
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
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
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
