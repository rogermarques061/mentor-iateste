import { HeroBanner } from "@/components/student/HeroBanner";
import { CourseCard } from "@/components/student/CourseCard";
import { ContinueWatching } from "@/components/student/ContinueWatching";
import { AchievementBadge } from "@/components/student/AchievementBadge";
import { WeeklyMissions } from "@/components/student/WeeklyMissions";
import { Sparkles } from "lucide-react";
import { usePlatform } from "@/contexts/PlatformContext";

const StudentHome = () => {
  const { state } = usePlatform();

  const currentStudent = state.currentStudentId
    ? state.students.find(s => s.id === state.currentStudentId)
    : state.students[0];

  const courses = state.courses
    .filter(c => c.status === "published")
    .map(c => ({
      title: c.title,
      modules: c.totalModules,
      lessons: c.totalLessons,
      progress: currentStudent?.progress[c.id]?.percentage ?? 0,
      category: c.description?.split(" ")[0] || "Curso",
    }));

  const inProgress = courses.filter(c => c.progress > 0 && c.progress < 100);
  const notStarted = courses.filter(c => c.progress === 0);
  const recommended = notStarted.slice(0, 2);

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      <HeroBanner />

      {/* Continue Watching + Missions */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
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
      {courses.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-display text-xl">Seus Cursos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(inProgress.length > 0 ? inProgress : courses).slice(0, 4).map((course, i) => (
              <div key={i} className="animate-fade-slide-in" style={{ animationDelay: `${i * 80}ms` }}>
                <CourseCard {...course} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended */}
      {recommended.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-xl">Recomendado para você</h2>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-primary/15 text-primary flex items-center gap-1">
              <Sparkles className="h-3 w-3" strokeWidth={1.5} />
              Baseado no seu progresso
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommended.map((course, i) => (
              <div key={i} className="animate-fade-slide-in" style={{ animationDelay: `${i * 80}ms` }}>
                <CourseCard {...course} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentHome;
