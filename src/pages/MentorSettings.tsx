import { useState } from "react";
import { Upload, Save, Palette, Type, Bell, Shield, AlertTriangle, FileText, ShoppingCart, Eye, Smartphone, CreditCard } from "lucide-react";

const systemMessages = [
  { trigger: "Primeiro acesso do aluno", message: "Bem-vindo! Estamos felizes em ter você conosco.", active: true },
  { trigger: "Sem acesso por 3 dias", message: "Sentimos sua falta! Que tal retomar seus estudos?", active: true },
  { trigger: "Sem acesso por 7 dias", message: "Ainda dá tempo de retomar! Seu progresso está salvo.", active: true },
  { trigger: "Conclusão de módulo", message: "Parabéns! Você concluiu mais um módulo!", active: true },
  { trigger: "Conclusão de curso", message: "Incrível! Você terminou o curso completo!", active: true },
  { trigger: "Badge desbloqueada", message: "Você ganhou uma nova conquista!", active: true },
  { trigger: "Upsell automático", message: "Você está pronto para o próximo nível!", active: false },
];

const MentorSettings = () => {
  const [activeTab, setActiveTab] = useState("visual");
  const tabs = [
    { id: "visual", label: "Identidade Visual", icon: Palette },
    { id: "texts", label: "Textos e Mensagens", icon: Type },
    { id: "checkout", label: "Checkout e Pagamentos", icon: ShoppingCart },
    { id: "general", label: "Configurações Gerais", icon: Shield },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="font-display text-2xl mb-1">Configurações</h1>
        <p className="text-sm text-muted-foreground">Personalize sua plataforma de mentoria</p>
      </div>

      <div className="flex gap-1 glass rounded-xl p-1">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === t.id ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
            <t.icon className="h-4 w-4" strokeWidth={1.5} /> {t.label}
          </button>
        ))}
      </div>

      {/* Visual Identity */}
      {activeTab === "visual" && (
        <div className="space-y-6 animate-fade-slide-in">
          {/* Colors */}
          <div className="glass rounded-2xl p-6 space-y-5">
            <h3 className="font-semibold text-sm">Cores</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Cor de destaque principal</label>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary border border-[rgba(255,255,255,0.1)] cursor-pointer glow-primary" />
                  <input type="text" defaultValue="#8B5CF6" className="glass rounded-xl px-4 py-2.5 text-sm font-mono bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 w-32" />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Cor secundária</label>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[hsl(280,80%,70%)] border border-[rgba(255,255,255,0.1)] cursor-pointer" />
                  <input type="text" defaultValue="#C084FC" className="glass rounded-xl px-4 py-2.5 text-sm font-mono bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 w-32" />
                </div>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Preview</label>
              <div className="flex gap-3">
                <button className="bg-primary text-primary-foreground rounded-xl px-4 py-2 text-sm glow-primary">Botão Primário</button>
                <button className="glass rounded-xl px-4 py-2 text-sm">Botão Secundário</button>
                <div className="h-2 w-32 rounded-full bg-muted self-center overflow-hidden">
                  <div className="h-full w-2/3 rounded-full bg-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Logo */}
          <div className="glass rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-sm">Logo e Marca</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Logo da plataforma</label>
                <div className="glass rounded-xl p-6 border-dashed border-2 border-[rgba(255,255,255,0.1)] flex flex-col items-center gap-2 cursor-pointer hover:border-primary/30 transition-all">
                  <Upload className="h-6 w-6 text-muted-foreground/40" strokeWidth={1.5} />
                  <span className="text-[11px] text-muted-foreground">PNG ou SVG, máx 2MB</span>
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Nome da plataforma</label>
                <input type="text" defaultValue="MentorIA" className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50" />
                <label className="text-xs text-muted-foreground mb-2 block mt-4">Favicon</label>
                <div className="glass rounded-xl p-3 border-dashed border-2 border-[rgba(255,255,255,0.1)] flex items-center gap-2 cursor-pointer hover:border-primary/30 transition-all">
                  <Upload className="h-4 w-4 text-muted-foreground/40" strokeWidth={1.5} />
                  <span className="text-[11px] text-muted-foreground">32×32px</span>
                </div>
              </div>
            </div>
          </div>

          {/* Banners */}
          <div className="glass rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-sm">Banners</h3>
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Banner principal da Home do aluno</label>
              <div className="glass rounded-xl p-8 border-dashed border-2 border-[rgba(255,255,255,0.1)] flex flex-col items-center gap-2 cursor-pointer hover:border-primary/30 transition-all">
                <Upload className="h-8 w-8 text-muted-foreground/40" strokeWidth={1.5} />
                <span className="text-xs text-muted-foreground">1920×480px recomendado</span>
              </div>
            </div>
          </div>

          <button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-5 py-2.5 text-sm flex items-center gap-2 glow-primary transition-all">
            <Save className="h-4 w-4" strokeWidth={1.5} /> Salvar alterações
          </button>
        </div>
      )}

      {/* Texts & Messages */}
      {activeTab === "texts" && (
        <div className="space-y-6 animate-fade-slide-in">
          <div className="glass rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-sm">Textos da plataforma</h3>
            {[
              { label: "Mensagem de boas-vindas", value: "Bem-vindo à sua jornada de crescimento!" },
              { label: "Mensagem de conclusão de aula", value: "Excelente! Mais uma aula concluída." },
              { label: "Mensagem de conclusão de módulo", value: "Parabéns! Módulo concluído com sucesso!" },
              { label: "Mensagem de conclusão de curso", value: "Incrível! Você concluiu todo o curso!" },
              { label: "Texto do botão Continuar", value: "Continuar estudando" },
            ].map((t, i) => (
              <div key={i}>
                <label className="text-xs text-muted-foreground mb-1.5 block">{t.label}</label>
                <input type="text" defaultValue={t.value} className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50" />
              </div>
            ))}
          </div>

          <div className="glass rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Mensagens automáticas do sistema</h3>
              <span className="text-[10px] text-muted-foreground">Variáveis: {"{{nome_aluno}}"} {"{{nome_curso}}"} {"{{progresso}}"} {"{{nome_badge}}"}</span>
            </div>
            <div className="space-y-3">
              {systemMessages.map((m, i) => (
                <div key={i} className="glass rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium">{m.trigger}</span>
                    <div className={`w-9 h-5 rounded-full flex items-center px-0.5 cursor-pointer transition-all ${m.active ? 'bg-primary/30' : 'bg-muted'}`}>
                      <div className={`w-4 h-4 rounded-full transition-transform ${m.active ? 'bg-primary translate-x-4' : 'bg-muted-foreground translate-x-0'}`} />
                    </div>
                  </div>
                  <input type="text" defaultValue={m.message} className="w-full glass rounded-lg px-3 py-2 text-xs bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50" />
                </div>
              ))}
            </div>
          </div>

          <button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-5 py-2.5 text-sm flex items-center gap-2 glow-primary transition-all">
            <Save className="h-4 w-4" strokeWidth={1.5} /> Salvar mensagens
          </button>
        </div>
      )}

      {/* Checkout & Payments */}
      {activeTab === "checkout" && (
        <div className="space-y-6 animate-fade-slide-in">
          <div className="glass rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-sm">Configurações do Checkout</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Nome exibido no checkout</label>
                <input type="text" defaultValue="MentorIA" className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Cor de destaque</label>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary border border-[rgba(255,255,255,0.1)] cursor-pointer glow-primary" />
                  <input type="text" defaultValue="#8B5CF6" className="glass rounded-xl px-4 py-2.5 text-sm font-mono bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 w-32" />
                </div>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-sm">Métodos de Pagamento</h3>
            {[
              { label: "Aceitar Cartão de Crédito", icon: CreditCard, active: true },
              { label: "Aceitar PIX", icon: Smartphone, active: true },
              { label: "Aceitar Boleto Bancário", icon: FileText, active: false },
              { label: "Permitir parcelamento", icon: ShoppingCart, active: true },
            ].map((m, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <m.icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                  <span className="text-sm">{m.label}</span>
                </div>
                <div className={`w-9 h-5 rounded-full flex items-center px-0.5 cursor-pointer transition-all ${m.active ? 'bg-primary/30' : 'bg-muted'}`}>
                  <div className={`w-4 h-4 rounded-full transition-transform ${m.active ? 'bg-primary translate-x-4' : 'bg-muted-foreground translate-x-0'}`} />
                </div>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Máximo de parcelas</label>
                <select className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 appearance-none">
                  <option>12x</option><option>10x</option><option>6x</option><option>3x</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Dias para liberação de saldo</label>
                <input type="number" defaultValue={14} className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono" />
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-sm">Garantia</h3>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Prazo padrão de garantia (dias)</label>
              <div className="flex items-center gap-4">
                {[7, 15, 30].map(d => (
                  <button key={d} className={`px-4 py-2 rounded-xl text-sm font-mono transition-all ${d === 7 ? 'bg-primary/20 text-primary' : 'glass text-muted-foreground hover:text-foreground'}`}>
                    {d} dias
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Texto da política de garantia</label>
              <textarea className="w-full glass rounded-xl px-4 py-3 text-sm bg-transparent resize-none focus:outline-none focus:ring-1 focus:ring-primary/50 h-20" defaultValue="Se dentro do prazo de garantia você não estiver satisfeito, devolvemos 100% do seu investimento." />
            </div>
          </div>

          <div className="glass rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-sm">Recuperação de Carrinho</h3>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm">Ativar e-mail de recuperação</span>
              <div className="w-9 h-5 rounded-full bg-primary/30 flex items-center px-0.5 cursor-pointer">
                <div className="w-4 h-4 rounded-full bg-primary translate-x-4 transition-transform" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Enviar após (horas)</label>
                <input type="number" defaultValue={2} className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Desconto de recuperação (%)</label>
                <input type="number" defaultValue={10} className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono" />
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-sm">Pixel e Rastreamento</h3>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Facebook Pixel ID</label>
              <input type="text" placeholder="Ex: 123456789012345" className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Google Analytics (GA4)</label>
              <input type="text" placeholder="Ex: G-XXXXXXXXXX" className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Google Tag Manager</label>
              <input type="text" placeholder="Ex: GTM-XXXXXXX" className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono" />
            </div>
          </div>

          <button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-5 py-2.5 text-sm flex items-center gap-2 glow-primary transition-all">
            <Save className="h-4 w-4" strokeWidth={1.5} /> Salvar configurações de checkout
          </button>
        </div>
      )}

      {/* General */}
      {activeTab === "general" && (
        <div className="space-y-6 animate-fade-slide-in">
          {/* Profile */}
          <div className="glass rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-sm">Dados do Mentor</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center text-lg font-display text-primary">MC</div>
              <button className="glass rounded-xl px-3 py-2 text-xs flex items-center gap-2 hover:bg-[rgba(255,255,255,0.06)] transition-all">
                <Upload className="h-3.5 w-3.5" strokeWidth={1.5} /> Alterar foto
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Nome</label>
                <input type="text" defaultValue="Marcos Costa" className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">E-mail</label>
                <input type="email" defaultValue="marcos@mentoria.com" className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50" />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Bio</label>
              <textarea className="w-full glass rounded-xl px-4 py-3 text-sm bg-transparent resize-none focus:outline-none focus:ring-1 focus:ring-primary/50 h-20" defaultValue="Mentor especializado em vendas de alto ticket e estratégias digitais." />
            </div>
          </div>

          {/* Notifications */}
          <div className="glass rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-sm flex items-center gap-2"><Bell className="h-4 w-4" strokeWidth={1.5} /> Notificações</h3>
            {[
              { label: "E-mail quando aluno entra em risco", active: true },
              { label: "Relatório diário por e-mail", active: true },
              { label: "Push notification de alertas críticos", active: true },
              { label: "Resumo semanal por e-mail", active: false },
            ].map((n, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <span className="text-sm">{n.label}</span>
                <div className={`w-9 h-5 rounded-full flex items-center px-0.5 cursor-pointer transition-all ${n.active ? 'bg-primary/30' : 'bg-muted'}`}>
                  <div className={`w-4 h-4 rounded-full transition-transform ${n.active ? 'bg-primary translate-x-4' : 'bg-muted-foreground translate-x-0'}`} />
                </div>
              </div>
            ))}
          </div>

          {/* Access */}
          <div className="glass rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-sm flex items-center gap-2"><Shield className="h-4 w-4" strokeWidth={1.5} /> Configurações de Acesso</h3>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm">Permite auto-cadastro de alunos</span>
              <div className="w-9 h-5 rounded-full bg-primary/30 flex items-center px-0.5 cursor-pointer">
                <div className="w-4 h-4 rounded-full bg-primary translate-x-4 transition-transform" />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Mensagem de acesso negado</label>
              <input type="text" defaultValue="Esta área é exclusiva para alunos matriculados." className="w-full glass rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/50" />
            </div>
          </div>

          <button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-5 py-2.5 text-sm flex items-center gap-2 glow-primary transition-all">
            <Save className="h-4 w-4" strokeWidth={1.5} /> Salvar configurações
          </button>

          {/* Danger Zone */}
          <div className="glass rounded-2xl p-6 space-y-4 border border-destructive/20">
            <h3 className="font-semibold text-sm text-destructive flex items-center gap-2"><AlertTriangle className="h-4 w-4" strokeWidth={1.5} /> Zona de Perigo</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm">Resetar gamificação</div>
                  <div className="text-[11px] text-muted-foreground">Apaga todos os pontos e badges dos alunos</div>
                </div>
                <button className="glass rounded-xl px-3 py-2 text-xs text-destructive border border-destructive/20 hover:bg-destructive/10 transition-all">Resetar</button>
              </div>
              <div className="border-t border-[rgba(255,255,255,0.05)]" />
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm">Exportar todos os dados</div>
                  <div className="text-[11px] text-muted-foreground">Download completo em CSV</div>
                </div>
                <button className="glass rounded-xl px-3 py-2 text-xs flex items-center gap-1.5 hover:bg-[rgba(255,255,255,0.06)] transition-all">
                  <FileText className="h-3 w-3" strokeWidth={1.5} /> Exportar
                </button>
              </div>
              <div className="border-t border-[rgba(255,255,255,0.05)]" />
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-destructive">Arquivar plataforma</div>
                  <div className="text-[11px] text-muted-foreground">Desativa a plataforma e remove acesso dos alunos</div>
                </div>
                <button className="bg-destructive/20 text-destructive rounded-xl px-3 py-2 text-xs hover:bg-destructive/30 transition-all">Arquivar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorSettings;
