import { Clock, Flame, BookCheck, TrendingUp, Zap, Award } from "lucide-react";

const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const weeks = [
  [3, 2, 4, 1, 3, 0, 0],
  [2, 3, 3, 4, 2, 1, 0],
  [4, 3, 2, 4, 3, 2, 1],
  [3, 4, 0, 3, 4, 1, 0],
  [2, 3, 4, 3, 2, 0, 0],
  [4, 3, 3, 2, 4, 2, 1],
  [3, 0, 2, 3, 4, 0, 0],
  [1, 3, 4, 2, 3, 1, 0],
];

const heatmapColor = (v: number) => {
  if (v === 0) return "bg-muted/40";
  if (v === 1) return "bg-primary/20";
  if (v === 2) return "bg-primary/40";
  if (v === 3) return "bg-primary/60";
  return "bg-primary/90";
};

const rankingData = [
  { pos: 1, name: "Ana Costa", avatar: "AC", points: 2840, isUser: false },
  { pos: 2, name: "Carlos M.", avatar: "CM", points: 2650, isUser: false },
  { pos: 3, name: "Beatriz R.", avatar: "BR", points: 2510, isUser: false },
  { pos: 4, name: "Diego P.", avatar: "DP", points: 2380, isUser: false },
  { pos: 5, name: "João Silva", avatar: "JS", points: 2120, isUser: true },
  { pos: 6, name: "Fernanda L.", avatar: "FL", points: 1980, isUser: false },
  { pos: 7, name: "Gabriel S.", avatar: "GS", points: 1850, isUser: false },
];

const milestones = [
  { date: "Hoje", text: "Completou a aula 'Técnicas de Rapport Avançado'", icon: BookCheck },
  { date: "Ontem", text: "Desbloqueou badge '7 Dias Seguidos'", icon: Award },
  { date: "3 dias atrás", text: "Alcançou Top 5 no ranking da turma", icon: TrendingUp },
  { date: "1 semana", text: "Completou Módulo 2 — Rapport Avançado", icon: Zap },
];

const stats = [
  { label: "Horas de Estudo", value: "42h", sublabel: "+3h esta semana", icon: Clock },
  { label: "Aulas Concluídas", value: "47", sublabel: "de 134 total", icon: BookCheck },
  { label: "Streak Atual", value: "12", sublabel: "dias consecutivos", icon: Flame },
  { label: "Score de Engajamento", value: "78", sublabel: "Nível: Avançado", icon: TrendingUp },
];

const Evolution = () => {
  return (
    <div className="space-y-8 sm:space-y-10 max-w-6xl">
      <div className="animate-fade-slide-in">
        <h1 className="font-display text-[22px] sm:text-2xl">Minha Evolução</h1>
        <p className="text-muted-foreground text-sm mt-1">Acompanhe seu progresso e performance.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="glass rounded-2xl p-4 sm:p-5 card-hover animate-fade-slide-in" style={{ animationDelay: `${(i + 1) * 80}ms` }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
              </div>
            </div>
            <p className="font-mono text-xl sm:text-2xl font-semibold">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            <p className="text-[10px] text-primary mt-1">{stat.sublabel}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">
        {/* Heatmap */}
        <div className="lg:col-span-3 space-y-4 animate-fade-slide-in" style={{ animationDelay: "320ms" }}>
          <h2 className="font-display text-lg sm:text-xl">Atividade Semanal</h2>
          <div className="glass rounded-2xl p-4 sm:p-6 overflow-x-auto">
            <div className="flex gap-1 min-w-[300px]">
              <div className="flex flex-col gap-1 mr-2 pt-5">
                {weekDays.map((d) => (
                  <span key={d} className="text-[10px] text-muted-foreground h-4 flex items-center">{d}</span>
                ))}
              </div>
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  <span className="text-[10px] text-muted-foreground h-4 text-center">
                    {wi === 0 ? "8 sem" : wi === weeks.length - 1 ? "Atual" : ""}
                  </span>
                  {week.map((v, di) => (
                    <div
                      key={di}
                      className={`w-4 h-4 rounded-[3px] ${heatmapColor(v)} transition-colors duration-200`}
                      title={`Nível ${v}`}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-4 text-[10px] text-muted-foreground">
              <span>Menos</span>
              {[0, 1, 2, 3, 4].map((v) => (
                <div key={v} className={`w-3 h-3 rounded-[2px] ${heatmapColor(v)}`} />
              ))}
              <span>Mais</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="lg:col-span-2 space-y-4 animate-fade-slide-in" style={{ animationDelay: "400ms" }}>
          <h2 className="font-display text-lg sm:text-xl">Marcos Recentes</h2>
          <div className="space-y-3">
            {milestones.map((m, i) => (
              <div key={i} className="glass rounded-xl p-3 sm:p-4 flex items-start gap-3 card-hover">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <m.icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{m.text}</p>
                  <span className="text-xs text-muted-foreground">{m.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ranking */}
      <div className="space-y-4 animate-fade-slide-in" style={{ animationDelay: "480ms" }}>
        <h2 className="font-display text-lg sm:text-xl">Ranking da Turma</h2>
        <div className="glass rounded-2xl overflow-hidden">
          {rankingData.map((r, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3.5 sm:py-4 transition-all duration-200 ${
                r.isUser ? "bg-primary/10 border-l-2 border-primary" : "hover:bg-accent/10"
              } ${i < rankingData.length - 1 ? "border-b border-border/20" : ""}`}
            >
              <span className={`font-mono text-base sm:text-lg font-bold w-6 sm:w-8 text-center ${
                r.pos <= 3 ? "text-warning" : "text-muted-foreground"
              }`}>
                {r.pos}
              </span>
              <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-medium ${
                r.isUser ? "bg-primary/20 text-primary" : "bg-accent/50 text-accent-foreground"
              }`}>
                {r.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${r.isUser ? "text-primary" : ""}`}>
                  {r.name} {r.isUser && <span className="text-xs text-primary/60">(Você)</span>}
                </p>
              </div>
              <span className="font-mono text-sm text-muted-foreground">{r.points.toLocaleString()} pts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Evolution;
