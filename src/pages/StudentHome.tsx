import { HeroBanner } from "@/components/student/HeroBanner";
import { CourseCard } from "@/components/student/CourseCard";
import { ContinueWatching } from "@/components/student/ContinueWatching";
import { AchievementBadge } from "@/components/student/AchievementBadge";
import { WeeklyMissions } from "@/components/student/WeeklyMissions";
import { Sparkles } from "lucide-react";

const courses = [
  { title: "Vendas de Alto Ticket", modules: 5, lessons: 32, progress: 68, category: "Vendas" },
  { title: "Marketing Digital Avançado", modules: 4, lessons: 24, progress: 35, category: "Marketing" },
  { title: "Liderança e Gestão", modules: 6, lessons: 40, progress: 12, category: "Gestão" },
  { title: "Copywriting Persuasivo", modules: 3, lessons: 18, progress: 0, category: "Copy" },
];

const recommended = [
  { title: "Funis de Conversão", modules: 4, lessons: 20, progress: 0, category: "Marketing" },
  { title: "Mentalidade de Alta Performance", modules: 3, lessons: 15, progress: 0, category: "Mindset" },
];

const StudentHome = () => {
  return (
    <div className="space-y-10">
      <HeroBanner />

      {/* Continue Watching + Missions */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <h2 className="font-display text-xl">Continuar de onde parou</h2>
          <ContinueWatching />
        </div>
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-display text-xl">Missões da Semana</h2>
          <WeeklyMissions />
        </div>
      </div>

      {/* Achievements */}
      <div className="space-y-4">
        <h2 className="font-display text-xl">Conquistas Recentes</h2>
        <AchievementBadge />
      </div>

      {/* Courses */}
      <div className="space-y-4">
        <h2 className="font-display text-xl">Seus Cursos</h2>
        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {courses.map((course, i) => (
            <div key={i} className="animate-fade-slide-in" style={{ animationDelay: `${i * 80}ms` }}>
              <CourseCard {...course} />
            </div>
          ))}
        </div>
      </div>

      {/* Recommended */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-xl">Recomendado para você</h2>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.06em] bg-primary/15 text-primary flex items-center gap-1">
            <Sparkles className="h-3 w-3" strokeWidth={1.5} />
            Baseado no seu progresso
          </span>
        </div>
        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {recommended.map((course, i) => (
            <div key={i} className="animate-fade-slide-in" style={{ animationDelay: `${i * 80}ms` }}>
              <CourseCard {...course} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentHome;
