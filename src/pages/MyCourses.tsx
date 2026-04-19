import { useState } from "react";
import { BookOpen, Clock, CheckCircle2, Lock, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const coursesData = [
  {
    id: 1,
    title: "Vendas de Alto Ticket",
    description: "Domine as técnicas de vendas consultivas para produtos premium.",
    modules: [
      { title: "Fundamentos", lessons: 6, completed: 6 },
      { title: "Rapport Avançado", lessons: 7, completed: 7 },
      { title: "Qualificação", lessons: 8, completed: 5 },
      { title: "Fechamento", lessons: 6, completed: 0 },
      { title: "Pós-venda", lessons: 5, completed: 0 },
    ],
    category: "Vendas",
    progress: 68,
  },
  {
    id: 2,
    title: "Marketing Digital Avançado",
    description: "Estratégias avançadas de tráfego pago e orgânico.",
    modules: [
      { title: "Tráfego Pago", lessons: 8, completed: 5 },
      { title: "SEO Avançado", lessons: 6, completed: 2 },
      { title: "Email Marketing", lessons: 5, completed: 0 },
      { title: "Analytics", lessons: 5, completed: 0 },
    ],
    category: "Marketing",
    progress: 35,
  },
  {
    id: 3,
    title: "Liderança e Gestão",
    description: "Desenvolva habilidades de liderança para times de alta performance.",
    modules: [
      { title: "Autoconhecimento", lessons: 7, completed: 2 },
      { title: "Comunicação", lessons: 6, completed: 0 },
      { title: "Gestão de Conflitos", lessons: 7, completed: 0 },
      { title: "Cultura de Time", lessons: 8, completed: 0 },
      { title: "Métricas", lessons: 6, completed: 0 },
      { title: "Escala", lessons: 6, completed: 0 },
    ],
    category: "Gestão",
    progress: 12,
  },
  {
    id: 4,
    title: "Copywriting Persuasivo",
    description: "Escreva textos que convertem com frameworks comprovados.",
    modules: [
      { title: "Headlines", lessons: 6, completed: 0 },
      { title: "Storytelling", lessons: 6, completed: 0 },
      { title: "CTAs", lessons: 6, completed: 0 },
    ],
    category: "Copy",
    progress: 0,
  },
  {
    id: 5,
    title: "Funis de Conversão",
    description: "Monte funis automatizados que geram vendas 24/7.",
    modules: [
      { title: "Estrutura de Funil", lessons: 5, completed: 0 },
      { title: "Landing Pages", lessons: 5, completed: 0 },
      { title: "Automação", lessons: 5, completed: 0 },
      { title: "Otimização", lessons: 5, completed: 0 },
    ],
    category: "Marketing",
    progress: 0,
  },
];

type FilterType = "all" | "in-progress" | "completed" | "not-started";

const MyCourses = () => {
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null);

  const filtered = coursesData.filter((c) => {
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === "in-progress") return c.progress > 0 && c.progress < 100;
    if (filter === "completed") return c.progress === 100;
    if (filter === "not-started") return c.progress === 0;
    return true;
  });

  const filters: { label: string; value: FilterType }[] = [
    { label: "Todos", value: "all" },
    { label: "Em andamento", value: "in-progress" },
    { label: "Concluídos", value: "completed" },
    { label: "Não iniciados", value: "not-started" },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="animate-fade-slide-in">
        <h1 className="font-display text-2xl">Meus Cursos</h1>
        <p className="text-muted-foreground text-sm mt-1">Gerencie e acompanhe todos os seus cursos.</p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-4 animate-fade-slide-in" style={{ animationDelay: "80ms" }}>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Buscar curso..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl glass text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 bg-transparent"
          />
        </div>
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                filter === f.value
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      <div className="space-y-4">
        {filtered.map((course, i) => {
          const totalLessons = course.modules.reduce((a, m) => a + m.lessons, 0);
          const completedLessons = course.modules.reduce((a, m) => a + m.completed, 0);
          const isExpanded = expandedCourse === course.id;

          return (
            <div
              key={course.id}
              className="glass rounded-2xl overflow-hidden card-hover animate-fade-slide-in"
              style={{ animationDelay: `${(i + 2) * 80}ms` }}
            >
              <div
                className="p-6 cursor-pointer"
                onClick={() => setExpandedCourse(isExpanded ? null : course.id)}
              >
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-7 w-7 text-primary/60" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/15 text-primary">
                        {course.category}
                      </span>
                      {course.progress === 100 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-success/15 text-success">
                          Concluído
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-base">{course.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{course.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <span>{course.modules.length} módulos</span>
                      <span>·</span>
                      <span>{totalLessons} aulas</span>
                      <span>·</span>
                      <span>{completedLessons} concluídas</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="font-mono text-lg font-semibold text-primary">{course.progress}%</span>
                    <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded modules */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-0 border-t border-border/30">
                  <div className="pt-4 space-y-2">
                    {course.modules.map((mod, mi) => {
                      const modPct = mod.lessons > 0 ? Math.round((mod.completed / mod.lessons) * 100) : 0;
                      const isComplete = modPct === 100;
                      const isLocked = mi > 0 && course.modules[mi - 1].completed < course.modules[mi - 1].lessons && course.progress < 100;

                      return (
                        <div
                          key={mi}
                          className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ${
                            isLocked ? "opacity-40" : "hover:bg-accent/20 cursor-pointer"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isComplete ? "bg-success/15" : isLocked ? "bg-muted" : "bg-primary/10"
                          }`}>
                            {isComplete ? (
                              <CheckCircle2 className="h-4 w-4 text-success" strokeWidth={1.5} />
                            ) : isLocked ? (
                              <Lock className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                            ) : (
                              <span className="text-xs font-mono text-primary">{mi + 1}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium">{mod.title}</h4>
                            <span className="text-xs text-muted-foreground">{mod.lessons} aulas · {mod.completed} concluídas</span>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <div className="w-16 h-1 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70"
                                style={{ width: `${modPct}%` }}
                              />
                            </div>
                            <span className="font-mono text-xs text-muted-foreground w-8 text-right">{modPct}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Link to="/aluno/player">
                      <Button size="sm" variant="default">
                        Continuar Curso
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="glass rounded-2xl p-12 text-center">
            <Filter className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" strokeWidth={1.5} />
            <p className="text-muted-foreground text-sm">Nenhum curso encontrado com esses filtros.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
