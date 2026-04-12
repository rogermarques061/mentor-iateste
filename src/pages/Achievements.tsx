import { Trophy, Flame, Star, Zap, Target, BookCheck, MessageSquare, Award, Medal, Crown, Rocket, Heart } from "lucide-react";

const allBadges = [
  { name: "Primeiro Acesso", desc: "Acesse a plataforma pela primeira vez", icon: Star, unlocked: true, date: "12 Jan 2024", rarity: "Comum" },
  { name: "7 Dias Seguidos", desc: "Estude 7 dias consecutivos", icon: Flame, unlocked: true, date: "19 Jan 2024", rarity: "Raro" },
  { name: "Módulo Completo", desc: "Complete um módulo inteiro", icon: Trophy, unlocked: true, date: "28 Jan 2024", rarity: "Raro" },
  { name: "Comentarista", desc: "Faça 10 comentários em aulas", icon: MessageSquare, unlocked: true, date: "2 Fev 2024", rarity: "Comum" },
  { name: "Maratonista", desc: "Assista 5 aulas em um dia", icon: Rocket, unlocked: true, date: "5 Fev 2024", rarity: "Épico" },
  { name: "Dedicação Total", desc: "Acumule 30 horas de estudo", icon: Heart, unlocked: true, date: "15 Fev 2024", rarity: "Épico" },
  { name: "Top 10 Ranking", desc: "Alcance o top 10 da turma", icon: Zap, unlocked: false, progress: 70, rarity: "Raro" },
  { name: "Missão Cumprida", desc: "Complete 10 missões semanais", icon: Target, unlocked: false, progress: 60, rarity: "Épico" },
  { name: "Aluno Destaque", desc: "Fique em 1º no ranking por 7 dias", icon: Crown, unlocked: false, progress: 0, rarity: "Lendário" },
  { name: "Formatura", desc: "Complete um curso inteiro", icon: Award, unlocked: false, progress: 68, rarity: "Lendário" },
  { name: "Leitor Voraz", desc: "Acesse todos os materiais de um curso", icon: BookCheck, unlocked: false, progress: 40, rarity: "Raro" },
  { name: "Medalhista", desc: "Conquiste 10 badges", icon: Medal, unlocked: false, progress: 50, rarity: "Épico" },
];

const rarityColor: Record<string, string> = {
  "Comum": "text-muted-foreground",
  "Raro": "text-info",
  "Épico": "text-primary",
  "Lendário": "text-warning",
};

const rarityBg: Record<string, string> = {
  "Comum": "bg-muted-foreground/10",
  "Raro": "bg-info/10",
  "Épico": "bg-primary/10",
  "Lendário": "bg-warning/10",
};

const Achievements = () => {
  const unlocked = allBadges.filter((b) => b.unlocked);
  const locked = allBadges.filter((b) => !b.unlocked);

  return (
    <div className="space-y-10 max-w-6xl">
      <div className="animate-fade-slide-in">
        <h1 className="font-display text-2xl">Conquistas</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {unlocked.length} de {allBadges.length} badges desbloqueados
        </p>
      </div>

      {/* Overall progress */}
      <div className="glass rounded-2xl p-6 animate-fade-slide-in" style={{ animationDelay: "80ms" }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">Progresso Geral</span>
          <span className="font-mono text-sm text-primary">{Math.round((unlocked.length / allBadges.length) * 100)}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500"
            style={{ width: `${(unlocked.length / allBadges.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Unlocked */}
      <div className="space-y-4">
        <h2 className="font-display text-xl">Desbloqueados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {unlocked.map((badge, i) => (
            <div
              key={i}
              className="glass rounded-2xl p-5 card-hover cursor-pointer animate-fade-slide-in"
              style={{ animationDelay: `${(i + 2) * 80}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 glow-primary">
                  <badge.icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold">{badge.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{badge.desc}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${rarityBg[badge.rarity]} ${rarityColor[badge.rarity]}`}>
                      {badge.rarity}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{badge.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Locked */}
      <div className="space-y-4">
        <h2 className="font-display text-xl">Em Progresso</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {locked.map((badge, i) => (
            <div
              key={i}
              className="glass rounded-2xl p-5 opacity-60 hover:opacity-80 transition-opacity duration-200 animate-fade-slide-in"
              style={{ animationDelay: `${(i + unlocked.length + 2) * 80}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                  <badge.icon className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold">{badge.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{badge.desc}</p>
                  <div className="mt-2">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${rarityBg[badge.rarity]} ${rarityColor[badge.rarity]}`}>
                      {badge.rarity}
                    </span>
                  </div>
                  {badge.progress !== undefined && badge.progress > 0 && (
                    <div className="mt-3">
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-muted-foreground">Progresso</span>
                        <span className="font-mono text-muted-foreground">{badge.progress}%</span>
                      </div>
                      <div className="h-1 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary/40" style={{ width: `${badge.progress}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Achievements;
