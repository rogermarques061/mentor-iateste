import { useState } from "react";
import { Play, CheckCircle2, Circle, ArrowRight, FileText, MessageSquare, AlignLeft, ChevronLeft, Download, Send, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const moduleLessons = [
  { id: 1, title: "Introdução ao Rapport", duration: "08:32", status: "completed" as const },
  { id: 2, title: "Linguagem Corporal", duration: "12:15", status: "completed" as const },
  { id: 3, title: "Espelhamento Avançado", duration: "15:20", status: "completed" as const },
  { id: 4, title: "Construindo Confiança", duration: "11:45", status: "completed" as const },
  { id: 5, title: "Técnicas de Rapport Avançado", duration: "12:45", status: "current" as const },
  { id: 6, title: "Rapport em Vendas Online", duration: "14:10", status: "pending" as const },
  { id: 7, title: "Prática e Exercícios", duration: "20:00", status: "pending" as const },
];

const comments = [
  { author: "Maria S.", avatar: "MS", text: "Excelente aula! O exemplo do espelhamento me ajudou muito na prática.", time: "há 2 dias" },
  { author: "Pedro L.", avatar: "PL", text: "Alguém pode explicar melhor a técnica do pacing? Fiquei com dúvida.", time: "há 3 dias" },
  { author: "Mentor", avatar: "MT", text: "Pedro, o pacing é quando você acompanha o ritmo da fala e energia do seu prospect antes de liderar a conversa.", time: "há 3 dias", isMentor: true },
];

const materials = [
  { name: "Slides da Aula", type: "PDF", size: "2.4 MB" },
  { name: "Template de Script", type: "DOCX", size: "156 KB" },
  { name: "Checklist de Rapport", type: "PDF", size: "890 KB" },
];

type Tab = "materials" | "comments" | "transcript" | "notes";

const LessonPlayer = () => {
  const [activeTab, setActiveTab] = useState<Tab>("materials");
  const [noteText, setNoteText] = useState("");
  const [commentText, setCommentText] = useState("");
  const [showLessonList, setShowLessonList] = useState(false);
  const currentLesson = moduleLessons.find((l) => l.status === "current")!;
  const completedCount = moduleLessons.filter((l) => l.status === "completed").length;
  const progressPct = Math.round((completedCount / moduleLessons.length) * 100);

  const tabs: { id: Tab; label: string; icon: typeof FileText }[] = [
    { id: "materials", label: "Materiais", icon: FileText },
    { id: "comments", label: "Comentários", icon: MessageSquare },
    { id: "transcript", label: "Transcrição", icon: AlignLeft },
    { id: "notes", label: "Anotações", icon: StickyNote },
  ];

  return (
    <div className="space-y-0 -m-4 sm:-m-5 md:-m-6 lg:-m-8 xl:-mx-12">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 sm:px-6 py-3 border-b border-border/30">
        <Link to="/courses" className="text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground">Vendas de Alto Ticket · Módulo 3</p>
          <h2 className="text-sm font-medium truncate">{currentLesson.title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-primary">{progressPct}%</span>
          <div className="w-16 sm:w-20 h-1 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-primary" style={{ width: `${progressPct}%` }} />
          </div>
          <button onClick={() => setShowLessonList(!showLessonList)} className="lg:hidden p-2 rounded-lg hover:bg-accent/30 transition-all text-muted-foreground">
            <AlignLeft className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Video area */}
        <div className="flex-1 min-w-0">
          <div className="relative w-full aspect-video bg-gradient-to-br from-card to-background flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            <button className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center hover:bg-primary/30 transition-all duration-200 glow-primary">
              <Play className="h-6 w-6 sm:h-8 sm:w-8 text-primary-foreground ml-1" strokeWidth={1.5} />
            </button>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
              <div className="h-full w-[42%] bg-primary rounded-r-full" />
            </div>
          </div>

          {/* Action bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-4 border-b border-border/30 gap-3">
            <div>
              <h3 className="font-semibold text-[15px]">{currentLesson.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Aula {currentLesson.id} de {moduleLessons.length} · {currentLesson.duration}</p>
            </div>
            <Button size="sm" className="gap-2 w-full sm:w-auto">
              <CheckCircle2 className="h-4 w-4" strokeWidth={1.5} />
              Marcar como concluída
            </Button>
          </div>

          {/* Tabs */}
          <div className="px-4 sm:px-6 pt-4">
            <div className="flex gap-1 border-b border-border/30 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 -mb-[1px] whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <tab.icon className="h-4 w-4" strokeWidth={1.5} />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="py-4 sm:py-6">
              {activeTab === "materials" && (
                <div className="space-y-3">
                  {materials.map((mat, i) => (
                    <div key={i} className="glass rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4 card-hover cursor-pointer">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-5 w-5 text-primary" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate">{mat.name}</h4>
                        <span className="text-xs text-muted-foreground">{mat.type} · {mat.size}</span>
                      </div>
                      <Download className="h-4 w-4 text-muted-foreground shrink-0" strokeWidth={1.5} />
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "comments" && (
                <div className="space-y-4">
                  {comments.map((c, i) => (
                    <div key={i} className={`flex gap-3 ${c.isMentor ? "ml-4 sm:ml-8" : ""}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium ${
                        c.isMentor ? "bg-primary/20 text-primary" : "bg-accent/50 text-accent-foreground"
                      }`}>
                        {c.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-medium">{c.author}</span>
                          {c.isMentor && <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary/15 text-primary">Mentor</span>}
                          <span className="text-xs text-muted-foreground">{c.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{c.text}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-3 mt-6">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-primary">JS</span>
                    </div>
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        placeholder="Escreva um comentário..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="flex-1 h-9 px-3 rounded-lg glass text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 bg-transparent"
                      />
                      <Button size="sm" variant="ghost" className="h-9 w-9 p-0">
                        <Send className="h-4 w-4" strokeWidth={1.5} />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "transcript" && (
                <div className="glass rounded-xl p-4 sm:p-6">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Olá, bem-vindos à aula sobre Técnicas de Rapport Avançado. Hoje vamos aprofundar nas estratégias
                    que os melhores vendedores do mundo utilizam para criar conexão instantânea com seus prospects...
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-4">
                    O primeiro ponto é entender que rapport não é apenas sobre espelhar linguagem corporal.
                    É sobre criar uma experiência de compreensão mútua onde o prospect sente que você genuinamente
                    entende a situação dele...
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-4">
                    Vamos explorar três técnicas avançadas: pacing and leading, calibração emocional,
                    e o que eu chamo de "ponte de valor" — onde você conecta a dor do cliente com a transformação
                    que seu produto oferece de forma natural...
                  </p>
                </div>
              )}

              {activeTab === "notes" && (
                <div className="space-y-4">
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Escreva suas anotações pessoais aqui..."
                    className="w-full h-40 p-4 rounded-xl glass text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 bg-transparent resize-none"
                  />
                  <div className="flex justify-end">
                    <Button size="sm" variant="secondary">Salvar Anotações</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lesson list sidebar - responsive */}
        <div className={`${showLessonList ? 'block' : 'hidden'} lg:block w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-border/30 flex-shrink-0`}>
          <div className="p-4 border-b border-border/30">
            <h3 className="text-sm font-semibold">Módulo 3 — Qualificação</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{completedCount}/{moduleLessons.length} aulas concluídas</p>
          </div>
          <div className="divide-y divide-border/20">
            {moduleLessons.map((lesson) => (
              <div
                key={lesson.id}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200 ${
                  lesson.status === "current"
                    ? "bg-accent/30"
                    : "hover:bg-accent/10"
                }`}
              >
                <div className="flex-shrink-0">
                  {lesson.status === "completed" ? (
                    <CheckCircle2 className="h-4 w-4 text-success" strokeWidth={1.5} />
                  ) : lesson.status === "current" ? (
                    <ArrowRight className="h-4 w-4 text-primary" strokeWidth={1.5} />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground/40" strokeWidth={1.5} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm truncate ${lesson.status === "current" ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                    {lesson.title}
                  </p>
                </div>
                <span className="font-mono text-xs text-muted-foreground flex-shrink-0">{lesson.duration}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPlayer;
