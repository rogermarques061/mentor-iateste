import { Crown, Medal, Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";

const rankingData = [
  { pos: 1, name: "Ana Costa", avatar: "AC", points: 2840, streak: 21, level: "Expert", trend: "up" as const },
  { pos: 2, name: "Carlos M.", avatar: "CM", points: 2650, streak: 18, level: "Expert", trend: "up" as const },
  { pos: 3, name: "Beatriz R.", avatar: "BR", points: 2510, streak: 15, level: "Avançado", trend: "down" as const },
  { pos: 4, name: "Diego P.", avatar: "DP", points: 2380, streak: 12, level: "Avançado", trend: "up" as const },
  { pos: 5, name: "João Silva", avatar: "JS", points: 2120, streak: 12, level: "Avançado", trend: "up" as const, isUser: true },
  { pos: 6, name: "Fernanda L.", avatar: "FL", points: 1980, streak: 9, level: "Praticante", trend: "same" as const },
  { pos: 7, name: "Gabriel S.", avatar: "GS", points: 1850, streak: 7, level: "Praticante", trend: "down" as const },
  { pos: 8, name: "Helena M.", avatar: "HM", points: 1720, streak: 5, level: "Praticante", trend: "up" as const },
  { pos: 9, name: "Igor R.", avatar: "IR", points: 1600, streak: 4, level: "Aprendiz", trend: "same" as const },
  { pos: 10, name: "Julia F.", avatar: "JF", points: 1480, streak: 3, level: "Aprendiz", trend: "down" as const },
];

const podiumOrder = [1, 0, 2]; // 2nd, 1st, 3rd

const TrendIcon = ({ trend }: { trend: "up" | "down" | "same" }) => {
  if (trend === "up") return <TrendingUp className="h-3 w-3 text-success" strokeWidth={1.5} />;
  if (trend === "down") return <TrendingDown className="h-3 w-3 text-destructive" strokeWidth={1.5} />;
  return <Minus className="h-3 w-3 text-muted-foreground" strokeWidth={1.5} />;
};

const PosIcon = ({ pos }: { pos: number }) => {
  if (pos === 1) return <Crown className="h-5 w-5 text-warning" strokeWidth={1.5} />;
  if (pos === 2) return <Medal className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />;
  if (pos === 3) return <Trophy className="h-5 w-5 text-warning/60" strokeWidth={1.5} />;
  return null;
};

const Ranking = () => {
  const top3 = rankingData.slice(0, 3);
  const rest = rankingData.slice(3);
  const userEntry = rankingData.find((r) => r.isUser);

  return (
    <div className="space-y-8 sm:space-y-10 max-w-6xl mx-auto">
      <div className="animate-fade-slide-in">
        <h1 className="font-display text-[22px] sm:text-2xl">Ranking</h1>
        <p className="text-muted-foreground text-sm mt-1">Veja sua posição entre os colegas da turma.</p>
      </div>

      {/* User position card */}
      {userEntry && (
        <div className="glass rounded-2xl p-5 sm:p-6 border-l-2 border-primary animate-fade-slide-in" style={{ animationDelay: "80ms" }}>
          <div className="flex items-center gap-4">
            <span className="text-2xl sm:text-3xl font-[800] text-primary">{userEntry.pos}º</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[15px]">Sua posição atual</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {userEntry.points.toLocaleString()} pontos · Streak de {userEntry.streak} dias · Nível {userEntry.level}
              </p>
            </div>
            <TrendIcon trend={userEntry.trend} />
          </div>
        </div>
      )}

      {/* Podium */}
      <div className="flex items-end justify-center gap-3 sm:gap-4 animate-fade-slide-in" style={{ animationDelay: "160ms" }}>
        {podiumOrder.map((idx) => {
          const r = top3[idx];
          const heights = { 0: "h-32", 1: "h-24", 2: "h-20" };
          return (
            <div key={r.pos} className="flex flex-col items-center gap-2 w-24 sm:w-28">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-sm font-semibold ${
                r.pos === 1 ? "bg-warning/20 text-warning ring-2 ring-warning/30" : "bg-accent/50 text-accent-foreground"
              }`}>
                {r.avatar}
              </div>
              <p className="text-xs sm:text-sm font-medium text-center truncate w-full">{r.name}</p>
              <p className="font-mono text-xs text-muted-foreground">{r.points.toLocaleString()}</p>
              <div className={`w-full ${heights[idx as 0 | 1 | 2]} rounded-t-xl bg-gradient-to-t ${
                r.pos === 1 ? "from-warning/10 to-warning/30" : r.pos === 2 ? "from-muted to-muted-foreground/20" : "from-warning/5 to-warning/15"
              } flex items-start justify-center pt-3`}>
                <PosIcon pos={r.pos} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Full ranking list - responsive */}
      <div className="glass rounded-2xl overflow-hidden animate-fade-slide-in" style={{ animationDelay: "240ms" }}>
        {/* Mobile: simplified list */}
        <div className="block sm:hidden">
          {rankingData.map((r, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-3.5 ${
                r.isUser ? "bg-primary/10" : "hover:bg-accent/10"
              } ${i < rankingData.length - 1 ? "border-b border-border/20" : ""}`}
            >
              <span className={`font-[800] w-6 text-center ${r.pos <= 3 ? "text-warning" : "text-muted-foreground"}`}>
                {r.pos}
              </span>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                r.isUser ? "bg-primary/20 text-primary" : "bg-accent/50 text-accent-foreground"
              }`}>
                {r.avatar}
              </div>
              <span className={`text-sm font-medium flex-1 truncate ${r.isUser ? "text-primary" : ""}`}>
                {r.name}
              </span>
              <span className="font-mono text-xs text-muted-foreground">{r.points.toLocaleString()}</span>
              <TrendIcon trend={r.trend} />
            </div>
          ))}
        </div>

        {/* Desktop: full grid */}
        <div className="hidden sm:block">
          <div className="grid grid-cols-[3rem_1fr_6rem_5rem_5rem_2rem] gap-4 px-6 py-3 text-xs text-muted-foreground border-b border-border/30 font-medium">
            <span>#</span>
            <span>Aluno</span>
            <span className="text-right">Pontos</span>
            <span className="text-right">Streak</span>
            <span className="text-right">Nível</span>
            <span></span>
          </div>
          {rankingData.map((r, i) => (
            <div
              key={i}
              className={`grid grid-cols-[3rem_1fr_6rem_5rem_5rem_2rem] gap-4 px-6 py-4 items-center transition-all duration-200 ${
                r.isUser ? "bg-primary/10" : "hover:bg-accent/10"
              } ${i < rankingData.length - 1 ? "border-b border-border/20" : ""}`}
            >
              <span className={`font-[800] ${r.pos <= 3 ? "text-warning" : "text-muted-foreground"}`}>
                {r.pos}
              </span>
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                  r.isUser ? "bg-primary/20 text-primary" : "bg-accent/50 text-accent-foreground"
                }`}>
                  {r.avatar}
                </div>
                <span className={`text-sm font-medium truncate ${r.isUser ? "text-primary" : ""}`}>
                  {r.name} {r.isUser && <span className="text-primary/60">(Você)</span>}
                </span>
              </div>
              <span className="text-sm font-[800] text-right">{r.points.toLocaleString()}</span>
              <span className="text-sm font-[800] text-right text-muted-foreground">{r.streak}d</span>
              <span className="text-xs text-right text-muted-foreground">{r.level}</span>
              <TrendIcon trend={r.trend} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Ranking;
