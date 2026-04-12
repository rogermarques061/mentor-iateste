import { Target, MessageSquare, BookCheck } from "lucide-react";

const missions = [
  { title: "Assista 5 aulas esta semana", icon: BookCheck, current: 3, total: 5, pts: 50 },
  { title: "Comente em 2 aulas", icon: MessageSquare, current: 1, total: 2, pts: 20 },
  { title: "Complete o Módulo 3", icon: Target, current: 0, total: 1, pts: 100 },
];

export function WeeklyMissions() {
  return (
    <div className="space-y-3">
      {missions.map((mission, i) => {
        const pct = Math.round((mission.current / mission.total) * 100);
        return (
          <div key={i} className="glass rounded-xl p-4 card-hover">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <mission.icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-medium">{mission.title}</h4>
                  <span className="font-mono text-xs text-primary">+{mission.pts}pts</span>
                </div>
                <div className="h-1 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground mt-1 block">
                  {mission.current}/{mission.total}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
