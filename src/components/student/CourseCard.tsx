import { BookOpen } from "lucide-react";

interface CourseCardProps {
  title: string;
  modules: number;
  lessons: number;
  progress: number;
  category: string;
}

export function CourseCard({ title, modules, lessons, progress, category }: CourseCardProps) {
  return (
    <div className="glass rounded-xl p-5 card-hover cursor-pointer group">
      <div className="w-full h-32 rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center mb-4">
        <BookOpen className="h-8 w-8 text-primary/60 group-hover:text-primary transition-colors duration-200" strokeWidth={1.5} />
      </div>
      <span className="text-xs text-muted-foreground">{category}</span>
      <h3 className="font-semibold text-sm mt-1 mb-3 line-clamp-2">{title}</h3>
      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
        <span>{modules} módulos</span>
        <span>·</span>
        <span>{lessons} aulas</span>
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Progresso</span>
          <span className="font-mono font-medium text-primary">{progress}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
