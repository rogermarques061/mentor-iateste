import { useState } from "react";
import { Plus, MoreHorizontal, Eye, Copy, Archive, Edit, Video, FileText, HelpCircle, Radio, ChevronDown, ChevronRight, GripVertical, Upload, Link2, Trash2 } from "lucide-react";

const coursesData = [
  { id: "1", name: "Vendas de Alto Ticket", modules: 8, lessons: 42, duration: "18h 30min", status: "Publicado", completion: 62, thumb: "" },
  { id: "2", name: "Marketing Digital Avançado", modules: 6, lessons: 28, duration: "12h 15min", status: "Publicado", completion: 45, thumb: "" },
  { id: "3", name: "Copywriting Persuasivo", modules: 5, lessons: 22, duration: "9h 45min", status: "Rascunho", completion: 0, thumb: "" },
  { id: "4", name: "Liderança e Gestão", modules: 7, lessons: 35, duration: "15h 20min", status: "Publicado", completion: 38, thumb: "" },
];

const moduleData = [
  {
    id: "m1", name: "Fundamentos de Vendas", status: "Publicado", lessons: [
      { id: "l1", name: "Introdução ao método", type: "video", duration: "12:30", status: "Publicado" },
      { id: "l2", name: "Mindset do vendedor", type: "video", duration: "18:45", status: "Publicado" },
      { id: "l3", name: "Quiz: Fundamentos", type: "quiz", duration: "10 min", status: "Publicado" },
    ],
  },
  {
    id: "m2", name: "Prospecção Avançada", status: "Publicado", lessons: [
      { id: "l4", name: "Canais de prospecção", type: "video", duration: "22:10", status: "Publicado" },
      { id: "l5", name: "Material complementar", type: "text", duration: "5 min", status: "Rascunho" },
    ],
  },
  {
    id: "m3", name: "Técnicas de Fechamento", status: "Rascunho", lessons: [
      { id: "l6", name: "Urgência e escassez", type: "video", duration: "15:20", status: "Rascunho" },
      { id: "l7", name: "Live Q&A", type: "live", duration: "60 min", status: "Rascunho" },
    ],
  },
];

function getStatusColor(status: string) {
  if (status === "Publicado") return "bg-success/15 text-success";
  if (status === "Rascunho") return "bg-warning/15 text-warning";
  return "bg-muted text-muted-foreground";
}

function getLessonIcon(type: string) {
  if (type === "video") return Video;
  if (type === "text") return FileText;
  if (type === "quiz") return HelpCircle;
  if (type === "live") return Radio;
  return FileText;
}

const MentorContent = () => {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<string[]>(["m1"]);
  const [editingLesson, setEditingLesson] = useState<string | null>(null);

  const toggleModule = (id: string) => {
    setExpandedModules(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  };

  if (selectedCourse) {
    const course = coursesData.find(c => c.id === selectedCourse);
    return (
      <div className="space-y-6 max-w-6xl">
        <button onClick={() => { setSelectedCourse(null); setEditingLesson(null); }} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
          ← Voltar para Cursos
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl mb-1">{course?.name}</h1>
            <p className="text-sm text-muted-foreground">{course?.modules} módulos · {course?.lessons} aulas · {course?.duration}</p>
          </div>
          <div className="flex gap-2">
            <button className="glass rounded-xl px-4 py-2 text-sm hover:bg-[rgba(255,255,255,0.06)] transition-all flex items-center gap-2">
              <Eye className="h-4 w-4" strokeWidth={1.5} /> Visualizar como aluno
            </button>
            <span className={`px-3 py-2 rounded-xl text-xs font-medium ${getStatusColor(course?.status || "")}`}>{course?.status}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Module List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">Módulos</h3>
              <button className="p-1.5 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-all">
                <Plus className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
            {moduleData.map((mod, mi) => (
              <div key={mod.id} className="glass rounded-xl overflow-hidden animate-fade-slide-in" style={{ animationDelay: `${mi * 60}ms` }}>
                <button
                  onClick={() => toggleModule(mod.id)}
                  className="w-full flex items-center gap-2 p-3 hover:bg-[rgba(255,255,255,0.03)] transition-all text-left"
                >
                  <GripVertical className="h-3.5 w-3.5 text-muted-foreground/40 cursor-grab" />
                  {expandedModules.includes(mod.id) ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                  <span className="text-sm font-medium flex-1 truncate">{mod.name}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${getStatusColor(mod.status)}`}>{mod.status}</span>
                </button>
                {expandedModules.includes(mod.id) && (
                  <div className="border-t border-[rgba(255,255,255,0.05)] px-3 pb-2">
                    {mod.lessons.map((lesson) => {
                      const Icon = getLessonIcon(lesson.type);
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => setEditingLesson(lesson.id)}
                          className={`w-full flex items-center gap-2 py-2 px-2 rounded-lg text-xs hover:bg-[rgba(255,255,255,0.04)] transition-all ${editingLesson === lesson.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}
                        >
                          <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                          <span className="truncate flex-1 text-left">{lesson.name}</span>
                          <span className="text-[10px] shrink-0">{lesson.duration}</span>
                        </button>
                      );
                    })}
                    <button className="w-full flex items-center gap-2 py-2 px-2 rounded-lg text-xs text-primary/60 hover:text-primary hover:bg-primary/5 transition-all">
                      <Plus className="h-3.5 w-3.5" strokeWidth={1.5} /> Adicionar aula
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Editor Area */}
          <div className="lg:col-span-2">
            {editingLesson ? (
              <div className="glass rounded-2xl p-6 space-y-5 animate-fade-slide-in">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Editar Aula</h3>
                  <button className="text-xs text-destructive hover:underline flex items-center gap-1">
                    <Trash2 className="h-3 w-3" /> Excluir
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Nome da aula</label>
                    <input type="text" defaultValue="Introdução ao método" className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50" />
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Tipo de conteúdo</label>
                    <div className="flex gap-2">
                      {[
                        { type: "video", label: "Vídeo", icon: Video },
                        { type: "text", label: "Texto", icon: FileText },
                        { type: "quiz", label: "Quiz", icon: HelpCircle },
                        { type: "live", label: "Live", icon: Radio },
                      ].map(t => (
                        <button key={t.type} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-all ${t.type === "video" ? 'bg-primary/20 text-primary' : 'glass text-muted-foreground hover:text-foreground'}`}>
                          <t.icon className="h-3.5 w-3.5" strokeWidth={1.5} /> {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Vídeo</label>
                    <div className="glass rounded-xl p-6 border-dashed border-2 border-[rgba(255,255,255,0.1)] flex flex-col items-center gap-3">
                      <Upload className="h-8 w-8 text-muted-foreground/40" strokeWidth={1.5} />
                      <p className="text-xs text-muted-foreground text-center">Arraste ou clique para fazer upload</p>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span>ou</span>
                      </div>
                      <div className="flex items-center gap-2 w-full max-w-md">
                        <Link2 className="h-4 w-4 text-muted-foreground shrink-0" strokeWidth={1.5} />
                        <input type="text" placeholder="URL do vídeo (YouTube, Vimeo...)" className="flex-1 glass rounded-lg px-3 py-2 text-xs bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Materiais extras</label>
                    <button className="glass rounded-xl px-4 py-2 text-xs flex items-center gap-2 hover:bg-[rgba(255,255,255,0.06)] transition-all">
                      <Upload className="h-3.5 w-3.5" strokeWidth={1.5} /> Adicionar material
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Comentários</span>
                      <div className="w-9 h-5 rounded-full bg-primary/30 flex items-center px-0.5 cursor-pointer">
                        <div className="w-4 h-4 rounded-full bg-primary translate-x-4 transition-transform" />
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-medium ${getStatusColor("Publicado")}`}>Publicado</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-4 py-2 text-sm glow-primary transition-all">
                    Salvar alterações
                  </button>
                  <button className="glass rounded-xl px-4 py-2 text-sm hover:bg-[rgba(255,255,255,0.06)] transition-all" onClick={() => setEditingLesson(null)}>
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="glass rounded-2xl p-6 space-y-5">
                <h3 className="font-semibold text-sm">Configurações do curso</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Nome do curso</label>
                    <input type="text" defaultValue={course?.name} className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Descrição</label>
                    <textarea className="w-full glass rounded-xl px-4 py-3 text-sm bg-transparent resize-none focus:outline-none focus:ring-1 focus:ring-primary/50 h-24" placeholder="Descreva o curso..." />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Thumbnail</label>
                    <div className="glass rounded-xl p-4 border-dashed border-2 border-[rgba(255,255,255,0.1)] flex items-center gap-3">
                      <Upload className="h-6 w-6 text-muted-foreground/40" strokeWidth={1.5} />
                      <span className="text-xs text-muted-foreground">Upload de imagem ou URL</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">Sequenciamento</label>
                      <select className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 appearance-none">
                        <option>Linear (obrigatório)</option>
                        <option>Livre</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">Acesso</label>
                      <select className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 appearance-none">
                        <option>Matrícula obrigatória</option>
                        <option>Público</option>
                        <option>Senha</option>
                      </select>
                    </div>
                  </div>
                  <button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-4 py-2 text-sm glow-primary transition-all">
                    Salvar configurações
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl mb-1">Conteúdo</h1>
          <p className="text-sm text-muted-foreground">Gerencie seus cursos, módulos e aulas</p>
        </div>
        <button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-4 py-2.5 text-sm flex items-center gap-2 glow-primary transition-all">
          <Plus className="h-4 w-4" strokeWidth={1.5} /> Criar novo curso
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {coursesData.map((course, i) => (
          <div key={course.id} className="glass rounded-2xl p-5 card-hover animate-fade-slide-in" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-16 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Video className="h-5 w-5 text-primary/60" strokeWidth={1.5} />
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-medium ${getStatusColor(course.status)}`}>{course.status}</span>
                <button className="p-1 rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-all">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                </button>
              </div>
            </div>
            <h3 className="font-semibold text-sm mb-1">{course.name}</h3>
            <p className="text-xs text-muted-foreground mb-4">{course.modules} módulos · {course.lessons} aulas · {course.duration}</p>
            {course.completion > 0 && (
              <div className="mb-4">
                <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                  <span>Taxa de conclusão</span>
                  <span className="font-mono">{course.completion}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${course.completion}%` }} />
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <button onClick={() => setSelectedCourse(course.id)} className="flex-1 glass rounded-xl py-2 text-xs flex items-center justify-center gap-1.5 hover:bg-primary/10 hover:text-primary transition-all">
                <Edit className="h-3.5 w-3.5" strokeWidth={1.5} /> Editar
              </button>
              <button className="glass rounded-xl py-2 px-3 text-xs flex items-center gap-1.5 hover:bg-[rgba(255,255,255,0.06)] transition-all">
                <Eye className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
              <button className="glass rounded-xl py-2 px-3 text-xs flex items-center gap-1.5 hover:bg-[rgba(255,255,255,0.06)] transition-all">
                <Copy className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MentorContent;
