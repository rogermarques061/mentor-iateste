import { Trophy, Flame, Star, Zap } from "lucide-react";

const badges = [
  { name: "Primeiro Acesso", icon: Star, unlocked: true, color: "text-warning" },
  { name: "7 Dias Seguidos", icon: Flame, unlocked: true, color: "text-destructive" },
  { name: "Módulo Completo", icon: Trophy, unlocked: true, color: "text-primary" },
  { name: "Top 10 Ranking", icon: Zap, unlocked: false, color: "text-muted-foreground" },
];

export function AchievementBadge() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {badges.map((badge, i) => (
        <div
          key={i}
          className={`flex flex-col items-center gap-2 p-3 rounded-xl min-w-[80px] transition-all duration-200 ${
            badge.unlocked ? "glass card-hover cursor-pointer" : "opacity-40"
          }`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            badge.unlocked ? "bg-primary/10" : "bg-muted"
          }`}>
            <badge.icon className={`h-5 w-5 ${badge.color}`} strokeWidth={1.5} />
          </div>
          <span className="text-[10px] text-center text-muted-foreground leading-tight">{badge.name}</span>
        </div>
      ))}
    </div>
  );
}
