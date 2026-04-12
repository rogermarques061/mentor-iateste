import { Play, Clock } from "lucide-react";

const recentLessons = [
  { title: "Técnicas de Rapport Avançado", module: "Módulo 3", time: "12:45", progress: 68 },
  { title: "Construindo Autoridade no Nicho", module: "Módulo 2", time: "18:30", progress: 45 },
  { title: "Framework de Qualificação", module: "Módulo 3", time: "22:10", progress: 20 },
];

export function ContinueWatching() {
  return (
    <div className="space-y-3">
      {recentLessons.map((lesson, i) => (
        <div
          key={i}
          className="glass rounded-xl p-4 flex items-center gap-4 card-hover cursor-pointer group"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="relative w-16 h-16 rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center flex-shrink-0">
            <Play className="h-5 w-5 text-primary/60 group-hover:text-primary transition-colors" strokeWidth={1.5} />
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted rounded-b-lg overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${lesson.progress}%` }} />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium truncate">{lesson.title}</h4>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <span>{lesson.module}</span>
              <span>·</span>
              <Clock className="h-3 w-3" strokeWidth={1.5} />
              <span>{lesson.time}</span>
            </div>
          </div>
          <span className="font-mono text-xs text-muted-foreground">{lesson.progress}%</span>
        </div>
      ))}
    </div>
  );
}
