import { useState } from "react";
import { Trophy, Star, Zap, Target, Plus, Edit, Trash2, RotateCcw, Save } from "lucide-react";

const overviewCards = [
  { icon: Zap, label: "XP Total Distribuído", value: "124.850 XP" },
  { icon: Trophy, label: "Badge Mais Conquistada", value: "7 Dias Seguidos" },
  { icon: Star, label: "Aluno com Mais Pontos", value: "Ana Silva (8.420 XP)" },
  { icon: Target, label: "Missões Ativas", value: "3 missões" },
];

const xpRules = [
  { activity: "Concluir uma aula", defaultXp: 10, current: 10 },
  { activity: "Concluir um módulo", defaultXp: 50, current: 50 },
  { activity: "Concluir um curso", defaultXp: 200, current: 200 },
  { activity: "Postar comentário", defaultXp: 5, current: 5 },
  { activity: "Participar de live", defaultXp: 30, current: 30 },
  { activity: "Completar missão", defaultXp: 100, current: 100 },
  { activity: "Streak de 7 dias", defaultXp: 50, current: 50 },
];

const levels = [
  { num: 1, name: "Iniciante", xp: 0, icon: "⬡" },
  { num: 2, name: "Aprendiz", xp: 500, icon: "⬡" },
  { num: 3, name: "Praticante", xp: 1500, icon: "⬡" },
  { num: 4, name: "Avançado", xp: 3000, icon: "⬡" },
  { num: 5, name: "Expert", xp: 5000, icon: "⬡" },
  { num: 6, name: "Mestre", xp: 10000, icon: "⬡" },
];

const badges = [
  { name: "Primeiro Acesso", criteria: "Acessar a plataforma pela primeira vez", type: "Automática", status: "Ativa", students: 127, category: "Progresso", color: "bg-primary" },
  { name: "7 Dias Seguidos", criteria: "Estudar 7 dias consecutivos", type: "Automática", status: "Ativa", students: 48, category: "Consistência", color: "bg-success" },
  { name: "Módulo Completo", criteria: "Concluir qualquer módulo", type: "Automática", status: "Ativa", students: 89, category: "Progresso", color: "bg-info" },
  { name: "Top 10 Ranking", criteria: "Estar entre os 10 primeiros", type: "Automática", status: "Ativa", students: 10, category: "Desafio", color: "bg-warning" },
  { name: "Social Star", criteria: "Postar 20 comentários", type: "Automática", status: "Ativa", students: 15, category: "Social", color: "bg-[hsl(43,74%,49%)]" },
  { name: "Aluno Destaque", criteria: "Concedida pelo mentor", type: "Manual", status: "Ativa", students: 5, category: "Especial", color: "bg-destructive" },
];

const missions = [
  { name: "Maratona de Aulas", criteria: "Assista 5 aulas esta semana", reward: "100 XP + Badge", completion: 42, daysLeft: 3 },
  { name: "Voz Ativa", criteria: "Comente em 3 aulas", reward: "50 XP", completion: 28, daysLeft: 3 },
  { name: "Presença VIP", criteria: "Participe da live de quinta", reward: "80 XP + Badge", completion: 0, daysLeft: 5 },
];

const MentorGamification = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const tabs = [
    { id: "overview", label: "Visão Geral" },
    { id: "xp", label: "Pontuação" },
    { id: "levels", label: "Níveis" },
    { id: "badges", label: "Badges" },
    { id: "missions", label: "Missões" },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="font-display text-2xl mb-1">Gamificação</h1>
        <p className="text-sm text-muted-foreground">Gerencie pontos, badges, níveis e missões</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 glass rounded-xl p-1">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === t.id ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {overviewCards.map((c, i) => (
            <div key={i} className="glass rounded-2xl p-5 card-hover animate-fade-slide-in" style={{ animationDelay: `${i * 60}ms` }}>
              <c.icon className="h-5 w-5 text-primary mb-3" strokeWidth={1.5} />
              <div className="text-lg font-[800] tracking-tight">{c.value}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{c.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* XP Rules */}
      {activeTab === "xp" && (
        <div className="glass rounded-2xl overflow-hidden animate-fade-slide-in">
          <div className="p-5 pb-3">
            <h3 className="font-semibold text-sm">Regras de Pontuação</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-[rgba(255,255,255,0.05)]">
                <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3 bg-[rgba(255,255,255,0.02)]">Atividade</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3 bg-[rgba(255,255,255,0.02)]">XP Padrão</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3 bg-[rgba(255,255,255,0.02)]">XP Atual</th>
              </tr>
            </thead>
            <tbody>
              {xpRules.map((r, i) => (
                <tr key={i} className="border-t border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  <td className="px-5 py-3">{r.activity}</td>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{r.defaultXp} XP</td>
                  <td className="px-5 py-3">
                    <input type="number" defaultValue={r.current} className="w-20 glass rounded-lg px-3 py-1.5 text-xs font-mono bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-5 pt-3 flex gap-2 border-t border-[rgba(255,255,255,0.05)]">
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-4 py-2 text-sm flex items-center gap-2 glow-primary transition-all">
              <Save className="h-4 w-4" strokeWidth={1.5} /> Salvar regras
            </button>
            <button className="glass rounded-xl px-4 py-2 text-sm flex items-center gap-2 hover:bg-[rgba(255,255,255,0.06)] transition-all">
              <RotateCcw className="h-4 w-4" strokeWidth={1.5} /> Restaurar padrão
            </button>
          </div>
        </div>
      )}

      {/* Levels */}
      {activeTab === "levels" && (
        <div className="space-y-4 animate-fade-slide-in">
          <div className="glass rounded-2xl overflow-hidden">
            <div className="p-5 pb-3 flex items-center justify-between">
              <h3 className="font-semibold text-sm">Níveis</h3>
              <button className="bg-primary/20 text-primary rounded-xl px-3 py-1.5 text-xs flex items-center gap-1.5 hover:bg-primary/30 transition-all">
                <Plus className="h-3.5 w-3.5" strokeWidth={1.5} /> Adicionar nível
              </button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-t border-[rgba(255,255,255,0.05)]">
                  <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3 bg-[rgba(255,255,255,0.02)]">#</th>
                  <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3 bg-[rgba(255,255,255,0.02)]">Nome</th>
                  <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3 bg-[rgba(255,255,255,0.02)]">XP Necessário</th>
                  <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3 bg-[rgba(255,255,255,0.02)]">Ícone</th>
                  <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3 bg-[rgba(255,255,255,0.02)]">Ações</th>
                </tr>
              </thead>
              <tbody>
                {levels.map((l, i) => (
                  <tr key={i} className="border-t border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{l.num}</td>
                    <td className="px-5 py-3 font-medium">{l.name}</td>
                    <td className="px-5 py-3 text-xs font-[800]">{l.xp.toLocaleString()} XP</td>
                    <td className="px-5 py-3">{l.icon}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"><Edit className="h-3.5 w-3.5" strokeWidth={1.5} /></button>
                        <button className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"><Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Badges */}
      {activeTab === "badges" && (
        <div className="space-y-4 animate-fade-slide-in">
          <div className="flex justify-end">
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-4 py-2 text-sm flex items-center gap-2 glow-primary transition-all">
              <Plus className="h-4 w-4" strokeWidth={1.5} /> Criar badge
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((b, i) => (
              <div key={i} className="glass rounded-2xl p-5 card-hover animate-fade-slide-in" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${b.color}/15 flex items-center justify-center`}>
                    <Trophy className={`h-5 w-5 ${b.color === 'bg-primary' ? 'text-primary' : b.color === 'bg-success' ? 'text-success' : b.color === 'bg-info' ? 'text-info' : b.color === 'bg-warning' ? 'text-warning' : 'text-destructive'}`} strokeWidth={1.5} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[9px] font-medium bg-success/15 text-success">{b.status}</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-medium glass">{b.type}</span>
                  </div>
                </div>
                <h4 className="font-medium text-sm mb-1">{b.name}</h4>
                <p className="text-[11px] text-muted-foreground mb-3">{b.criteria}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground font-mono">{b.students} alunos</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-medium glass">{b.category}</span>
                </div>
                <div className="flex gap-1.5 mt-3">
                  <button className="flex-1 glass rounded-lg py-1.5 text-[11px] hover:bg-primary/10 hover:text-primary transition-all">Editar</button>
                  <button className="glass rounded-lg py-1.5 px-3 text-[11px] hover:bg-[rgba(255,255,255,0.06)] transition-all">Conceder</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Missions */}
      {activeTab === "missions" && (
        <div className="space-y-4 animate-fade-slide-in">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Missões ativas</h3>
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-4 py-2 text-sm flex items-center gap-2 glow-primary transition-all">
              <Plus className="h-4 w-4" strokeWidth={1.5} /> Criar missão
            </button>
          </div>
          <div className="space-y-3">
            {missions.map((m, i) => (
              <div key={i} className="glass rounded-2xl p-5 card-hover animate-fade-slide-in" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-sm">{m.name}</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{m.criteria}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-[800]">{m.daysLeft} dias restantes</span>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${m.completion}%` }} />
                  </div>
                  <span className="text-xs font-[800]">{m.completion}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-primary font-medium">Recompensa: {m.reward}</span>
                  <div className="flex gap-1.5">
                    <button className="glass rounded-lg py-1.5 px-3 text-[11px] hover:bg-primary/10 hover:text-primary transition-all">Editar</button>
                    <button className="glass rounded-lg py-1.5 px-3 text-[11px] text-destructive hover:bg-destructive/10 transition-all">Encerrar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorGamification;
