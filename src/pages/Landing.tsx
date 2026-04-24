import { useEffect, useRef, useState } from "react";
import {
  ArrowRight, Plus, Minus, Check, Zap, Shield, BarChart3,
  Users, Star, TrendingUp, Play, X, Bell, Trophy, Sparkles,
  CreditCard, RefreshCcw, Gauge,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import s from "./Landing.module.css";
import { AuthModals, type AuthMode } from "@/components/landing/AuthModals";

/* ── logo ──────────────────────────────────────────────────── */
const Logo = ({ size = 34 }: { size?: number }) => (
  <div className={s.logoMark} style={{ width: size, height: size, borderRadius: size * 0.26 }}>
    <svg viewBox="0 0 24 24" width={size * 0.52} height={size * 0.52}
      fill="none" stroke="#1a1300" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 17L10 11L14 15L20 7" />
      <circle cx="20" cy="7" r="1.5" fill="#1a1300" />
    </svg>
  </div>
);

type Tab = "dashboard" | "ia" | "gami" | "fin";

const MENTORS = [
  "Marcos Costa","Rafael Lima","Amanda Ferreira","João Silva","Carla Mendes",
  "Pedro Henrique","Beatriz Souza","Lucas Andrade","Fernanda Rocha","Diego Martins",
  "Juliana Alves","Eduardo Santos","Mariana Lopes","Thiago Nunes","Camila Figueira",
  "Bruno Resende","Larissa Pinto","Victor Hugo","Natália Cruz","Rodrigo Melo",
];

const STEPS = [
  { n: "01", title: "Crie sua conta em 5 minutos", desc: "Sem cartão, sem burocracia. Configure sua plataforma, importa seus alunos e já começa a vender — tudo no mesmo dia.", icon: Zap },
  { n: "02", title: "Conecte sua operação completa", desc: "Produtos, checkout, área de membros e gamificação integrados. Um único painel que substitui 6 ferramentas diferentes.", icon: RefreshCcw },
  { n: "03", title: "Escale com IA e dados reais", desc: "Nossa IA identifica quem está prestes a abandonar e você age antes do reembolso. Métricas que protegem e impulsionam sua receita.", icon: TrendingUp },
];

const COMPARE = [
  { feat: "Dashboard em tempo real", imp: true, hot: true, kiw: false, edz: false },
  { feat: "IA anti-abandono", imp: true, hot: false, kiw: false, edz: false },
  { feat: "Gamificação nativa", imp: true, hot: false, kiw: false, edz: false },
  { feat: "White-label completo", imp: true, hot: true, kiw: true, edz: true },
  { feat: "Checkout próprio otimizado", imp: true, hot: true, kiw: true, edz: true },
  { feat: "Alertas automáticos de risco", imp: true, hot: false, kiw: false, edz: false },
  { feat: "Relatórios avançados de coorte", imp: true, hot: false, kiw: false, edz: false },
  { feat: "Suporte humano no WhatsApp", imp: true, hot: false, kiw: true, edz: false },
];

const PLANS = [
  {
    name: "Starter", price: 197, desc: "Para quem está estruturando sua primeira mentoria.",
    highlight: false,
    items: ["Até 200 alunos","Dashboard de vendas","Checkout otimizado","Relatórios básicos","Suporte via chat","Gamificação básica"],
  },
  {
    name: "Pro", price: 397, desc: "Para mentores em crescimento acelerado.",
    highlight: true,
    items: ["Até 2.000 alunos","IA anti-abandono","Alertas em tempo real","White-label completo","Relatórios avançados","Suporte prioritário","Gamificação avançada","Múltiplos produtos"],
  },
  {
    name: "Elite", price: 797, desc: "Para operações de alto volume.",
    highlight: false,
    items: ["Alunos ilimitados","IA avançada + scoring","Gerente de conta dedicado","API completa","SLA 99.9%","Relatórios customizados","Domínio próprio"],
  },
];

const TESTIMONIALS = [
  { initials:"MC", name:"Marcos Costa", role:"Marketing Digital · R$ 2.4M/ano", stars:5,
    quote:"Reduzi reembolsos em 71% no primeiro trimestre. A IA identifica quem está em risco antes que eu perceba qualquer sinal." },
  { initials:"JS", name:"João Silva", role:"Copywriting · 1.800 alunos", stars:5,
    quote:"Saí de 8 ferramentas para 1. Meu time finalmente vê o mesmo número que eu vejo. Isso valeu mais que qualquer feature." },
  { initials:"AF", name:"Amanda Ferreira", role:"Mentoria Feminina · 3 anos na plataforma", stars:5,
    quote:"A gamificação triplicou a conclusão dos módulos. Aluno que termina o curso não pede reembolso — simples assim." },
  { initials:"RL", name:"Rafael Lima", role:"Trader & Investimentos · R$ 1.8M/ano", stars:5,
    quote:"Em 6 meses de Implofy eu tive mais clareza da minha operação do que em 4 anos juntando tudo antes." },
  { initials:"BT", name:"Beatriz Torres", role:"Desenvolvimento Pessoal · 900 alunos", stars:5,
    quote:"O suporte é absurdamente rápido. Problema resolvido em minutos, não em dias. Nunca vi isso em outra plataforma." },
  { initials:"DR", name:"Diego Rangel", role:"Empreendedorismo · R$ 800k/ano", stars:5,
    quote:"O checkout da Implofy converteu 34% a mais que o que eu usava. Esse ganho pagou a plataforma inteira em uma semana." },
];

const FAQS = [
  { q:"Como funciona o período de teste gratuito?", a:"14 dias com acesso a todas as funcionalidades, sem cartão de crédito. Ao final, você escolhe o plano que faz sentido para o seu volume." },
  { q:"Posso migrar meus alunos de outra plataforma?", a:"Sim. Importamos alunos, módulos e progresso de Hotmart, Kiwify, Eduzz e outros — sem custo adicional." },
  { q:"Como a IA identifica alunos em risco de abandono?", a:"Cruzamos dias sem login, módulos parados, queda de engajamento e padrões de reembolso históricos — tudo em tempo real." },
  { q:"Quais métodos de pagamento são aceitos?", a:"PIX, cartão de crédito (até 12x), boleto bancário, Apple Pay e Google Pay. Repasse D+2 (PIX) e D+30 (cartão)." },
  { q:"Consigo personalizar com minha marca?", a:"Totalmente. Logo, cores, domínio próprio, emails white-label. O aluno nunca vê qualquer menção à Implofy." },
  { q:"A gamificação funciona para qualquer nicho?", a:"Sim. Badges, ranking e conquistas são configuráveis por produto. Funciona para qualquer tipo de mentoria ou curso." },
  { q:"Existe limite de cursos ou produtos?", a:"Cursos e produtos são ilimitados em todos os planos. O limite é apenas de alunos ativos." },
  { q:"Posso cancelar a qualquer momento?", a:"Sim. Sem multa, sem burocracia. Seus dados ficam disponíveis por 30 dias após o cancelamento." },
];

/* ─────────────────────────────────────────────────────────── */
export default function Landing() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>(null);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [faq, setFaq] = useState<number | null>(0);
  const [annual, setAnnual] = useState(false);
  const goSignup = () => navigate("/criar-conta");
  const to = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });

  useEffect(() => {
    document.title = "Implofy — A plataforma de gestão para mentores de elite";
    const fn = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className={s.root}>

      {/* ── HEADER ───────────────────────────────────────────── */}
      <header className={`${s.header} ${scrolled ? s.scrolled : ""}`}>
        <div className={`${s.wrap} ${s.hrow}`}>
          <a href="#" onClick={e => { e.preventDefault(); window.scrollTo({ top:0, behavior:"smooth" }); }} className={s.logo}>
            <Logo />
            <span className={s.logoName}>Implofy</span>
          </a>
          <nav className={s.nav}>
            <a onClick={e => { e.preventDefault(); to("como"); }} href="#como">Como funciona</a>
            <a onClick={e => { e.preventDefault(); to("produto"); }} href="#produto">Produto</a>
            <a onClick={e => { e.preventDefault(); to("planos"); }} href="#planos">Planos</a>
            <a onClick={e => { e.preventDefault(); to("faq"); }} href="#faq">FAQ</a>
          </nav>
          <div className={s.hbtns}>
            <button className={s.ghost} onClick={() => setAuthMode("login")}>Entrar</button>
            <button className={s.solid} onClick={goSignup}>Criar conta grátis</button>
          </div>
        </div>
      </header>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className={s.hero}>
        {/* aurora glow background */}
        <div className={s.auroraGlowBack} aria-hidden />
        <div className={s.auroraBloom} aria-hidden />
        <div className={s.auroraArcBack} aria-hidden />
        <div className={s.auroraArc} aria-hidden />
        {/* orbs */}
        <div className={s.orb1} aria-hidden />
        <div className={s.orb2} aria-hidden />
        <div className={s.orb3} aria-hidden />
        {/* grid */}
        <div className={s.grid} aria-hidden />

        <div className={`${s.wrap} ${s.hcenter}`}>
          <div className={s.badge}>
            <span className={s.dot} />
            Mais de 2.400 mentores ativos · R$ 1 bilhão gerenciados
          </div>

          <h1 className={s.h1}>
            A plataforma que veio para<br />
            <span className={s.shine}>revolucionar</span> a gestão<br />
            de mentorias no Brasil
          </h1>

          <p className={s.lead}>
            Dashboard completo, IA anti-abandono, gamificação nativa e relatórios em tempo real.<br />
            Tudo em um único painel para mentores que levam o jogo a sério.
          </p>

          <div className={s.hctas}>
            <button className={s.ctaBig} onClick={goSignup}>
              Começar grátis por 14 dias <ArrowRight size={17} />
            </button>
            <button className={s.ctaLine} onClick={() => to("produto")}>
              <Play size={14} fill="currentColor" strokeWidth={0} /> Ver demonstração
            </button>
          </div>

          <p className={s.htrust}>
            <Check size={12} />Sem cartão de crédito
            <span />
            <Check size={12} />Setup em 5 minutos
            <span />
            <Check size={12} />Cancele quando quiser
          </p>
        </div>

        {/* mockup full-width */}
        <div className={`${s.wrap} ${s.mockWrap}`}>
          <div className={s.mock}>
            <div className={s.mockBar}><em /><em /><em /></div>
            <div className={s.mockBody}>
              <div className={s.mockSide}>
                <div className={s.mockSideItem + " " + s.mockSideActive}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 12 12 3l9 9M5 10v10h14V10"/></svg>
                  Visão Geral
                </div>
                {["Alunos","Produtos","Vendas","Financeiro","IA","Gamificação"].map(t => (
                  <div key={t} className={s.mockSideItem}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="3"/></svg>
                    {t}
                  </div>
                ))}
              </div>
              <div className={s.mockMain}>
                <div className={s.mockHeader}>
                  <div>
                    <div className={s.mockTitle}>Dashboard · Hoje</div>
                    <div className={s.mockSub}>Atualizado agora · dados em tempo real</div>
                  </div>
                  <div className={s.mockLive}><span className={s.dot} />AO VIVO</div>
                </div>
                <div className={s.mockMetrics}>
                  {[
                    { l:"Receita hoje", v:"R$ 12.480", d:"↑ 18%", col:"#c9a227" },
                    { l:"Transações", v:"47", d:"↑ 9 hoje", col:"#22c55e" },
                    { l:"Ticket médio", v:"R$ 265", d:"+R$ 32", col:"#c9a227" },
                    { l:"Alunos ativos", v:"1.247", d:"↑ 23", col:"#22c55e" },
                  ].map((c,i) => (
                    <div key={i} className={s.mCard}>
                      <div className={s.mCardLabel}>{c.l}</div>
                      <div className={s.mCardValue}>{c.v}</div>
                      <div className={s.mCardDelta} style={{ color: c.col }}>{c.d}</div>
                    </div>
                  ))}
                </div>
                <div className={s.mockChart}>
                  <svg viewBox="0 0 800 160" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#c9a227" stopOpacity=".28"/>
                        <stop offset="100%" stopColor="#c9a227" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    <g stroke="rgba(255,255,255,0.04)" strokeWidth="1">
                      {[40,80,120].map(y=><line key={y} x1="0" y1={y} x2="800" y2={y}/>)}
                    </g>
                    <polygon fill="url(#cg)"
                      points="0,160 0,130 60,110 120,118 180,90 240,100 300,72 360,80 420,52 480,62 540,38 600,48 660,28 720,35 800,22 800,160"/>
                    <polyline fill="none" stroke="#c9a227" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      points="0,130 60,110 120,118 180,90 240,100 300,72 360,80 420,52 480,62 540,38 600,48 660,28 720,35 800,22"/>
                    <circle cx="800" cy="22" r="4" fill="#c9a227"/>
                  </svg>
                </div>
                <div className={s.mockFeed}>
                  {[
                    { icon:"💰", text:"Nova venda · Programa PATRON · R$ 997 via PIX", t:"agora" },
                    { icon:"🚨", text:"Alerta IA · João Oliveira sem acesso há 8 dias · risco alto", t:"2min" },
                    { icon:"🏆", text:"Badge desbloqueada · Ana Silva concluiu Módulo 3", t:"5min" },
                  ].map((f,i)=>(
                    <div key={i} className={s.feedItem}>
                      <span className={s.feedIcon}>{f.icon}</span>
                      <span className={s.feedText}>{f.text}</span>
                      <span className={s.feedTime}>{f.t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* floating alerts */}
          <div className={`${s.float} ${s.floatA}`}>
            <Bell size={13} color="#c9a227" />
            <div><div className={s.fTitle}>Nova venda · R$ 997</div><div className={s.fSub}>Programa PATRON · agora</div></div>
          </div>
          <div className={`${s.float} ${s.floatB}`}>
            <Shield size={13} color="#e53e3e" />
            <div><div className={s.fTitle}>Alerta IA · risco alto</div><div className={s.fSub}>João sem acesso há 8 dias</div></div>
          </div>
          <div className={`${s.float} ${s.floatC}`}>
            <Trophy size={13} color="#22c55e" />
            <div><div className={s.fTitle}>Badge desbloqueada 🏆</div><div className={s.fSub}>Ana Silva · Módulo 3</div></div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ──────────────────────────────────────────── */}
      <div className={s.marquee}>
        <div className={s.mFadeL} /><div className={s.mFadeR} />
        <div className={s.mTrack}>
          {[...MENTORS,...MENTORS].map((m,i) => (
            <span key={i} className={s.mItem}><Star size={10} fill="#c9a227" color="#c9a227"/>{m}</span>
          ))}
        </div>
      </div>

      {/* ── NÚMEROS ──────────────────────────────────────────── */}
      <section className={s.numbers}>
        <div className={s.wrap}>
          {[
            { n:"R$ 1B+", l:"gerenciados na plataforma", icon:CreditCard },
            { n:"2.400+", l:"mentores ativos no Brasil", icon:Users },
            { n:"↓68%",  l:"redução média de reembolsos", icon:Shield },
            { n:"98%",   l:"de satisfação dos usuários", icon:Star },
          ].map(({ n, l, icon: Icon }, i) => (
            <div key={i} className={s.numCard}>
              <div className={s.numIcon}><Icon size={18}/></div>
              <div className={s.numVal}>{n}</div>
              <div className={s.numLabel}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMO FUNCIONA ─────────────────────────────────────── */}
      <section id="como" className={s.sec}>
        <div className={s.wrap}>
          <div className={s.secHead}>
            <span className={s.tag}>Como funciona</span>
            <h2>Do cadastro à escala em 3 passos</h2>
            <p>Sem instalação, sem desenvolvedor, sem planilha. Você começa a operar no mesmo dia.</p>
          </div>
          <div className={s.steps}>
            {STEPS.map(({ n, title, desc, icon: Icon }, i) => (
              <div key={i} className={s.step}>
                <div className={s.stepNum}>{n}</div>
                {i < STEPS.length - 1 && <div className={s.stepLine} />}
                <div className={s.stepIcon}><Icon size={22}/></div>
                <h3 className={s.stepTitle}>{title}</h3>
                <p className={s.stepDesc}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section className={s.sec} style={{ background:"var(--s2)" }}>
        <div className={s.orb4} aria-hidden />
        <div className={s.wrap} style={{ position:"relative", zIndex:1 }}>
          <div className={s.secHead}>
            <span className={s.tag}>Por que Implofy</span>
            <h2>Tudo que sua mentoria precisa, em um lugar só</h2>
            <p>Cada funcionalidade foi construída pensando em como mentores realmente trabalham.</p>
          </div>

          {/* hero feature */}
          <div className={s.featHero}>
            <div className={s.featHeroLeft}>
              <div className={s.featTag}><Sparkles size={13}/>Destaque</div>
              <h3>IA que protege sua receita antes do abandono acontecer</h3>
              <p>Nossa inteligência artificial monitora o comportamento de cada aluno — dias sem login, módulos parados, queda de engajamento — e emite alertas com ações sugeridas antes que o reembolso aconteça.</p>
              <div className={s.featStat}>
                <div><strong>↓68%</strong><span>reembolsos</span></div>
                <div><strong>+3.2x</strong><span>retenção</span></div>
                <div><strong>2.400</strong><span>mentores</span></div>
              </div>
            </div>
            <div className={s.featHeroRight}>
              {[
                { color:"#e53e3e", level:"Risco alto", name:"João Oliveira", detail:"Sem acesso há 8 dias · Score: 92%", action:"Enviar mensagem de reativação" },
                { color:"#c9a227", level:"Risco médio", name:"Ana Silva", detail:"Progresso parado há 5 dias · Score: 71%", action:"Sugerir próximo módulo" },
                { color:"#22c55e", level:"Recuperado", name:"Pedro Henrique", detail:"Voltou a estudar hoje · Score: 18%", action:"Parabéns automático enviado" },
              ].map((a,i) => (
                <div key={i} className={s.alertCard} style={{ borderLeftColor: a.color }}>
                  <div className={s.alertTop}>
                    <span className={s.alertBadge} style={{ color:a.color, background:`${a.color}15`, borderColor:`${a.color}40` }}>{a.level}</span>
                    <span className={s.alertAction}>{a.action}</span>
                  </div>
                  <div className={s.alertName}>{a.name}</div>
                  <div className={s.alertDetail}>{a.detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* feature grid */}
          <div className={s.fGrid}>
            {[
              { Icon:BarChart3, t:"Vendas em tempo real", d:"PIX, cartão e boleto unificados. Acompanhe cada transação com filtros precisos e exportação instantânea.", badge:"+R$ 12.480 hoje" },
              { Icon:Star, t:"Gamificação integrada", d:"Badges automáticas, ranking de alunos e pontos por progresso — sem qualquer integração externa.", badge:"+3.2x retenção" },
              { Icon:Zap, t:"Checkout de alta conversão", d:"Order bumps, upsells, downsells e múltiplos métodos em um checkout que converte 34% a mais.", badge:"+34% conversão" },
              { Icon:Users, t:"White-label completo", d:"Seu logo, suas cores, seu domínio. O aluno nunca sabe que usa a Implofy por baixo.", badge:"100% personalizado" },
              { Icon:Gauge, t:"Relatórios avançados", d:"Ticket médio, conversão por método, coorte de retenção e chargeback. Exportáveis em CSV e PDF.", badge:"Tempo real" },
              { Icon:CreditCard, t:"Múltiplos métodos", d:"PIX (taxa 0%), cartão até 12x, boleto, Apple Pay e Google Pay. Repasse em D+2.", badge:"6 métodos" },
            ].map(({ Icon, t, d, badge }, i) => (
              <div key={i} className={s.fCard}>
                <div className={s.fIcon}><Icon size={19}/></div>
                <h4>{t}</h4>
                <p>{d}</p>
                <span className={s.fBadge}>{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUTO (TABS) ────────────────────────────────────── */}
      <section id="produto" className={s.sec}>
        <div className={s.wrap}>
          <div className={s.secHead}>
            <span className={s.tag}>Visão do produto</span>
            <h2>O dashboard que mentores de elite usam todo dia</h2>
            <p>Cada métrica que importa, cada alerta que protege sua receita — em tempo real.</p>
          </div>
          <div className={s.tabs}>
            {(["dashboard","ia","gami","fin"] as Tab[]).map((k,i) => {
              const l = ["Dashboard","Inteligência IA","Gamificação","Financeiro"][i];
              return (
                <button key={k} onClick={() => setTab(k)} className={`${s.tabBtn} ${tab===k ? s.tabActive : ""}`}>{l}</button>
              );
            })}
          </div>

          <div className={s.preview} key={tab}>
            {tab === "dashboard" && (
              <div className={s.dash}>
                <aside className={s.dSide}>
                  <div className={s.dLogo}><Logo size={26}/><span>Implofy</span></div>
                  <nav>
                    {["Visão Geral","Alunos","Produtos","Vendas","Financeiro","IA","Gamificação","Relatórios"].map((t,i)=>(
                      <div key={t} className={`${s.dNav} ${i===0?s.dNavActive:""}`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="15" height="15"><circle cx="12" cy="12" r="3"/></svg>
                        {t}
                        {(t==="IA"||t==="Financeiro") && <span className={s.dBadge}>{t==="IA"?"3":"1"}</span>}
                      </div>
                    ))}
                  </nav>
                  <div className={s.dUser}><div className={s.dAvatar}>MC</div><div><strong>Marcos Costa</strong><span>Mentor</span></div></div>
                </aside>
                <div className={s.dMain}>
                  <div className={s.dTop}>
                    <div><div className={s.dTitle}>Domingo, 20 de Abril</div><div className={s.dSub}>Atualizado agora · tempo real</div></div>
                    <div className={s.dFilters}>
                      {["Hoje","7 dias","30 dias","Este mês"].map((f,i)=>(
                        <button key={f} className={`${s.dFilter} ${i===0?s.dFilterOn:""}`}>{f}</button>
                      ))}
                      <div className={s.live}><span className={s.dot}/>AO VIVO</div>
                    </div>
                  </div>
                  <div className={s.dCards}>
                    {[
                      { l:"Receita total",v:"R$ 12.480",d:"↑ 18% vs ontem" },
                      { l:"Transações",v:"47",d:"↑ 9 hoje" },
                      { l:"Ticket médio",v:"R$ 265",d:"+R$ 32" },
                      { l:"PIX",v:"R$ 8.140",d:"65% do total" },
                      { l:"Cartão",v:"R$ 3.620",d:"29% do total" },
                      { l:"Boleto",v:"R$ 720",d:"6% do total" },
                    ].map((c,i)=>(
                      <div key={i} className={s.dCard}>
                        <div className={s.dCardLabel}>{c.l}</div>
                        <div className={s.dCardValue}>{c.v}</div>
                        <div className={s.dCardDelta}>{c.d}</div>
                      </div>
                    ))}
                  </div>
                  <div className={s.dRow}>
                    <div className={s.dBlock} style={{flex:1.6}}>
                      <div className={s.dBlockTitle}>Receita por dia</div>
                      <div className={s.dBlockSub}>Últimos 14 dias</div>
                      <div className={s.dChartArea}>
                        <svg viewBox="0 0 600 180" preserveAspectRatio="none">
                          <defs><linearGradient id="g3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c9a227" stopOpacity=".22"/><stop offset="100%" stopColor="#c9a227" stopOpacity="0"/></linearGradient></defs>
                          <polygon fill="url(#g3)" points="0,180 0,145 50,130 100,138 150,108 200,120 250,88 300,96 350,65 400,78 450,48 500,60 550,35 600,45 600,180"/>
                          <polyline fill="none" stroke="#c9a227" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            points="0,145 50,130 100,138 150,108 200,120 250,88 300,96 350,65 400,78 450,48 500,60 550,35 600,45"/>
                        </svg>
                      </div>
                    </div>
                    <div className={s.dBlock} style={{flex:1}}>
                      <div className={s.dBlockTitle}>Top produtos</div>
                      <div className={s.dBlockSub}>Esta semana</div>
                      {[
                        {r:1,n:"Programa PATRON",p:"R$ 997"},
                        {r:2,n:"Identidade Restaurada",p:"R$ 199"},
                        {r:3,n:"Imersão SP",p:"R$ 1.990"},
                      ].map(p=>(
                        <div key={p.r} className={s.pRow}>
                          <div className={s.pRank}>{p.r}</div>
                          <div className={s.pName}>{p.n}</div>
                          <div className={s.pPrice}>{p.p}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === "ia" && (
              <div className={s.pane}>
                <div className={s.paneHead}>
                  <h3>Alertas de IA · ranqueados por risco</h3>
                  <div className={s.live}><span className={s.dot}/>MONITORANDO 1.247 ALUNOS</div>
                </div>
                <div className={s.iaList}>
                  {[
                    { name:"João Oliveira",days:8,risk:92,level:"Alto",color:"#e53e3e",action:"Enviar mensagem de reativação" },
                    { name:"Ana Silva",days:5,risk:71,level:"Médio",color:"#c9a227",action:"Sugerir próximo módulo" },
                    { name:"Pedro Henrique",days:3,risk:48,level:"Baixo",color:"#22c55e",action:"Acompanhar" },
                    { name:"Carla Mendes",days:12,risk:95,level:"Alto",color:"#e53e3e",action:"Ligação prioritária" },
                    { name:"Rafael Costa",days:6,risk:64,level:"Médio",color:"#c9a227",action:"Email com checkpoint" },
                  ].map((a,i)=>(
                    <div key={i} className={s.iaRow}>
                      <div className={s.dAvatar} style={{fontSize:12}}>{a.name.split(" ").map(n=>n[0]).join("").slice(0,2)}</div>
                      <div style={{flex:1}}><div className={s.iaName}>{a.name}</div><div className={s.iaSub}>Sem acesso há {a.days} dias · {a.action}</div></div>
                      <div className={s.iaBar}><div style={{width:`${a.risk}%`,background:a.color}}/></div>
                      <span className={s.iaBadge} style={{color:a.color,background:`${a.color}12`,borderColor:`${a.color}40`}}>{a.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "gami" && (
              <div className={s.pane}>
                <div className={s.paneHead}>
                  <h3>Ranking & conquistas</h3>
                  <div className={s.live}><span className={s.dot}/>ATUALIZADO AGORA</div>
                </div>
                <div className={s.gamiRow}>
                  <div className={s.dBlock} style={{flex:1}}>
                    <div className={s.dBlockTitle}>Top alunos da semana</div>
                    <div className={s.dBlockSub}>Módulos + engajamento</div>
                    {[
                      {r:1,n:"Mariana Lopes",p:"2.480 pts"},
                      {r:2,n:"Carlos Eduardo",p:"2.310 pts"},
                      {r:3,n:"Beatriz Souza",p:"2.105 pts"},
                      {r:4,n:"Felipe Andrade",p:"1.980 pts"},
                      {r:5,n:"Larissa Pinto",p:"1.840 pts"},
                    ].map(p=>(
                      <div key={p.r} className={s.pRow}>
                        <div className={s.pRank}>{p.r}</div>
                        <div className={s.pName}>{p.n}</div>
                        <div className={s.pPrice}>{p.p}</div>
                      </div>
                    ))}
                  </div>
                  <div className={s.dBlock} style={{flex:1}}>
                    <div className={s.dBlockTitle}>Badges desbloqueadas hoje</div>
                    <div className={s.dBlockSub}>12 conquistas nas últimas 24h</div>
                    <div className={s.badgeGrid}>
                      {["Início","Módulo 1","Módulo 2","Módulo 3","Maratona","Top 10"].map(b=>(
                        <div key={b} className={s.badgeCard}>
                          <Trophy size={20} color="#c9a227"/>
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === "fin" && (
              <div className={s.pane}>
                <div className={s.paneHead}>
                  <h3>Saldo & repasses</h3>
                  <button className={s.solid} onClick={goSignup}>Sacar agora <ArrowRight size={13}/></button>
                </div>
                <div className={s.finCards}>
                  <div className={s.finBig}>
                    <div className={s.finLabel}>Saldo disponível</div>
                    <div className={s.finVal}>R$ 38.420,90</div>
                    <div className={s.finSub}>Próximo repasse: hoje, 18h</div>
                  </div>
                  <div className={s.finBig} style={{borderColor:"rgba(255,255,255,.06)"}}>
                    <div className={s.finLabel}>Saldo pendente</div>
                    <div className={s.finVal} style={{color:"var(--t)"}}>R$ 12.180,00</div>
                    <div className={s.finSub}>Liberação em D+30 (cartão)</div>
                  </div>
                  <div className={s.finBig} style={{borderColor:"rgba(255,255,255,.06)"}}>
                    <div className={s.finLabel}>Total do mês</div>
                    <div className={s.finVal} style={{color:"var(--t)"}}>R$ 84.620,00</div>
                    <div className={s.finSub}>↑ 23% vs mês anterior</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── COMPARATIVO ───────────────────────────────────────── */}
      <section className={`${s.sec} ${s.compareSec}`}>
        <div className={s.wrap}>
          <div className={s.secHead}>
            <span className={s.tag}>Comparativo</span>
            <h2>Por que mentores migram para a Implofy</h2>
            <p>Funcionalidades que as outras plataformas ainda não têm — e talvez nunca terão.</p>
          </div>
          <div className={s.table}>
            <div className={s.tableHead}>
              <div className={s.thFeat}>Funcionalidade</div>
              <div className={`${s.thCol} ${s.thHighlight}`}>Implofy</div>
              <div className={s.thCol}>Hotmart</div>
              <div className={s.thCol}>Kiwify</div>
              <div className={s.thCol}>Eduzz</div>
            </div>
            {COMPARE.map((row, i) => (
              <div key={i} className={`${s.tableRow} ${i%2===1?s.tableRowAlt:""}`}>
                <div className={s.tdFeat}>{row.feat}</div>
                {([row.imp, row.hot, row.kiw, row.edz] as boolean[]).map((v, j) => (
                  <div key={j} className={`${s.tdCol} ${j===0?s.tdHighlight:""}`}>
                    {v
                      ? <Check size={16} color="#22c55e" strokeWidth={2.5}/>
                      : <X size={16} color="#4a4a55" strokeWidth={2}/>
                    }
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANOS ────────────────────────────────────────────── */}
      <section id="planos" className={s.sec}>
        <div className={s.orb5} aria-hidden />
        <div className={s.wrap} style={{position:"relative",zIndex:1}}>
          <div className={s.secHead}>
            <span className={s.tag}>Planos e preços</span>
            <h2>Simples, transparente, sem surpresas</h2>
            <p>14 dias grátis em qualquer plano. Cancele quando quiser.</p>
            <div className={s.toggle}>
              <span className={!annual ? s.tOn : s.tOff}>Mensal</span>
              <button className={s.tSwitch} onClick={() => setAnnual(v => !v)}>
                <div className={`${s.tKnob} ${annual ? s.tKnobOn : ""}`}/>
              </button>
              <span className={annual ? s.tOn : s.tOff}>Anual <em className={s.tBadge}>Economize 20%</em></span>
            </div>
          </div>
          <div className={s.plans}>
            {PLANS.map((p, i) => {
              const price = annual ? Math.round(p.price * 0.8) : p.price;
              return (
                <div key={i} className={`${s.plan} ${p.highlight ? s.planOn : ""}`}>
                  {p.highlight && <div className={s.planTop}>Mais popular</div>}
                  <div className={s.planName}>{p.name}</div>
                  <div className={s.planPrice}>R$ {price}<span>/mês</span></div>
                  <p className={s.planDesc}>{p.desc}</p>
                  <button className={p.highlight ? s.ctaBig : s.ctaLine} style={!p.highlight ? {width:"100%",justifyContent:"center"} : {width:"100%",justifyContent:"center"}} onClick={goSignup}>
                    Começar grátis <ArrowRight size={14}/>
                  </button>
                  <ul className={s.planList}>
                    {p.items.map((item, j) => (
                      <li key={j}><Check size={13} color="#c9a227"/>{item}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── DEPOIMENTOS ───────────────────────────────────────── */}
      <section className={`${s.sec} ${s.testimonSec}`}>
        <div className={s.wrap}>
          <div className={s.secHead}>
            <span className={s.tag}>Quem usa a Implofy</span>
            <h2>Mentores que já transformaram sua operação</h2>
            <p>Resultados reais de quem largou planilhas e ferramentas fragmentadas.</p>
          </div>
          <div className={s.tGrid}>
            {TESTIMONIALS.map((t, i) => (
              <article key={i} className={s.tCard}>
                <div className={s.tStars}>{Array(t.stars).fill(0).map((_,k)=><Star key={k} size={12} fill="#c9a227" color="#c9a227"/>)}</div>
                <p className={s.tQuote}>"{t.quote}"</p>
                <div className={s.tFoot}>
                  <div className={s.tAvatar}>{t.initials}</div>
                  <div><strong>{t.name}</strong><span>{t.role}</span></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────────────────── */}
      <section className={s.ctaSec}>
        <div className={s.ctaOrb} aria-hidden />
        <div className={`${s.wrap} ${s.ctaInner}`}>
          <h2>Pronto para escalar sua mentoria?</h2>
          <p>14 dias grátis, sem cartão. Setup em menos de 5 minutos.</p>
          <button className={s.ctaBig} onClick={goSignup}>
            Criar minha conta grátis <ArrowRight size={17}/>
          </button>
          <div className={s.ctaTrust}>
            <span><Check size={12}/>Sem cartão de crédito</span>
            <span><Check size={12}/>14 dias grátis</span>
            <span><Check size={12}/>Cancele quando quiser</span>
            <span><Check size={12}/>Migração gratuita</span>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section id="faq" className={s.sec}>
        <div className={s.wrap}>
          <div className={s.secHead}>
            <span className={s.tag}>Dúvidas</span>
            <h2>Perguntas frequentes</h2>
          </div>
          <div className={s.faqList}>
            {FAQS.map((f, i) => {
              const open = faq === i;
              return (
                <div key={i} className={`${s.faqItem} ${open ? s.faqOpen : ""}`}>
                  <button className={s.faqQ} onClick={() => setFaq(open ? null : i)}>
                    <span>{f.q}</span>
                    {open ? <Minus size={17} color="#c9a227"/> : <Plus size={17} color="#c9a227"/>}
                  </button>
                  <div className={s.faqA} style={{ maxHeight: open ? 180 : 0 }}>
                    <p>{f.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className={s.footer}>
        <div className={s.wrap}>
          <div className={s.fGrid}>
            <div className={s.fBrand}>
              <a href="#" className={s.logo} onClick={e=>{e.preventDefault();window.scrollTo({top:0,behavior:"smooth"});}}>
                <Logo/><span className={s.logoName}>Implofy</span>
              </a>
              <p>A plataforma onde mentores de elite gerenciam vendas, alunos e crescimento — em um único painel.</p>
              <div className={s.fSocials}>
                {["Instagram","YouTube","LinkedIn"].map(s2=><a key={s2} href="#">{s2}</a>)}
              </div>
            </div>
            <div className={s.fCol}><h4>Produto</h4><ul><li><a href="#como">Como funciona</a></li><li><a href="#produto">Dashboard</a></li><li><a href="#planos">Planos</a></li><li><a href="#faq">FAQ</a></li></ul></div>
            <div className={s.fCol}><h4>Empresa</h4><ul><li><a href="#">Sobre</a></li><li><a href="#">Blog</a></li><li><a href="#">Contato</a></li><li><a href="#">Carreiras</a></li></ul></div>
            <div className={s.fCol}><h4>Legal</h4><ul><li><a href="#">Termos de Uso</a></li><li><a href="#">Privacidade</a></li><li><a href="#">Cookies</a></li></ul></div>
          </div>
          <div className={s.fBottom}>
            <span>© 2026 Implofy. Todos os direitos reservados.</span>
            <span>Feito com precisão para mentores que vendem.</span>
          </div>
        </div>
      </footer>

      <AuthModals mode={authMode} onModeChange={setAuthMode} />
    </div>
  );
}
