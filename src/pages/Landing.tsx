import { useEffect, useState } from "react";
import {
  ArrowRight, Plus, Minus, Check, Zap, Shield, BarChart3,
  Users, Star, TrendingUp, Play, X, Bell, Trophy, Sparkles,
  CreditCard, RefreshCcw, Brain, Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import s from "./Landing.module.css";
import { AuthModals, type AuthMode } from "@/components/landing/AuthModals";

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
  { n:"01", title:"Configure em 5 minutos", desc:"Sem cartão, sem código, sem desenvolvedor. Importe seus alunos, configure o checkout e já comece a vender no mesmo dia.", icon: Zap },
  { n:"02", title:"Unifique toda sua operação", desc:"Dashboard, produtos, área de membros, gamificação e financeiro integrados. Um único painel que elimina 6 ferramentas desconexas.", icon: RefreshCcw },
  { n:"03", title:"Escale com IA e dados reais", desc:"Nossa IA identifica alunos em risco 7 dias antes do reembolso. Você age com a ação sugerida. Sua receita protege a si mesma.", icon: Brain },
];

const COMPARE = [
  { feat:"Dashboard em tempo real",         imp:true,  hot:true,  kiw:false, edz:false },
  { feat:"IA anti-abandono nativa",          imp:true,  hot:false, kiw:false, edz:false },
  { feat:"Gamificação integrada",            imp:true,  hot:false, kiw:false, edz:false },
  { feat:"White-label completo",             imp:true,  hot:true,  kiw:true,  edz:true  },
  { feat:"Checkout otimizado próprio",       imp:true,  hot:true,  kiw:true,  edz:true  },
  { feat:"Alertas automáticos de risco",     imp:true,  hot:false, kiw:false, edz:false },
  { feat:"Relatórios de coorte e retenção",  imp:true,  hot:false, kiw:false, edz:false },
  { feat:"Suporte humano no WhatsApp",       imp:true,  hot:false, kiw:true,  edz:false },
];

const PLANS = [
  { name:"Starter", price:197, desc:"Para quem está estruturando sua primeira mentoria.", highlight:false, items:["Até 200 alunos ativos","Dashboard de vendas","Checkout otimizado","Relatórios básicos","Suporte via chat","Gamificação essencial"] },
  { name:"Pro", price:397, desc:"Para mentores em crescimento acelerado.", highlight:true, items:["Até 2.000 alunos ativos","IA anti-abandono completa","Alertas em tempo real","White-label completo","Relatórios avançados de coorte","Suporte prioritário 24h","Gamificação avançada","Múltiplos produtos"] },
  { name:"Elite", price:797, desc:"Para operações de alto volume e múltiplos produtos.", highlight:false, items:["Alunos ilimitados","IA avançada + scoring preditivo","Gerente de conta dedicado","API completa + webhooks","SLA 99.9% garantido","Relatórios customizados","Domínio próprio"] },
];

const TESTIMONIALS = [
  { initials:"MC", name:"Marcos Costa", role:"Marketing Digital · R$ 2.4M/ano", stars:5, featured:true, quote:"Reduzi reembolsos em 71% no primeiro trimestre. A IA identifica quem está em risco antes que eu perceba qualquer sinal — e me diz exatamente o que fazer. Em 4 anos de mercado, nunca vi nada parecido." },
  { initials:"JS", name:"João Silva", role:"Copywriting · 1.800 alunos", stars:5, featured:false, quote:"Saí de 8 ferramentas para 1. Meu time finalmente vê o mesmo número que eu. Isso valeu mais que qualquer feature." },
  { initials:"AF", name:"Amanda Ferreira", role:"Mentoria Feminina · 3 anos na plataforma", stars:5, featured:false, quote:"A gamificação triplicou a conclusão de módulos. Aluno que termina o curso não pede reembolso — simples assim." },
  { initials:"RL", name:"Rafael Lima", role:"Trader & Investimentos · R$ 1.8M/ano", stars:5, featured:false, quote:"Em 6 meses de Implofy tive mais clareza da minha operação do que em 4 anos somando tudo." },
  { initials:"BT", name:"Beatriz Torres", role:"Desenvolvimento Pessoal · 900 alunos", stars:5, featured:false, quote:"O suporte é absurdamente rápido. Problema resolvido em minutos, não em dias. Nunca vi isso em outra plataforma." },
  { initials:"DR", name:"Diego Rangel", role:"Empreendedorismo · R$ 800k/ano", stars:5, featured:false, quote:"O checkout converteu 34% a mais que o anterior. Esse ganho pagou a plataforma inteira em uma semana." },
  { initials:"CN", name:"Camila Neves", role:"Emagrecimento · 2.100 alunos", stars:5, featured:false, quote:"Nunca imaginei ter dados tão claros da minha operação. Agora tomo decisões com certeza, não com intuição." },
];

const FAQS = [
  { q:"Como funciona o período de teste gratuito?", a:"14 dias com acesso a todas as funcionalidades do plano Pro, sem cartão de crédito. Ao final, você escolhe o plano ideal para seu volume — ou cancela sem perguntas." },
  { q:"Posso migrar meus alunos de outra plataforma?", a:"Sim. Migramos alunos, módulos e histórico de progresso de Hotmart, Kiwify, Eduzz e outros — totalmente grátis, sem você precisar fazer nada." },
  { q:"Como a IA identifica alunos em risco de abandono?", a:"Cruzamos mais de 40 sinais: dias sem login, módulos parados, queda de engajamento, padrão de reembolsos históricos e comportamento de acesso. O modelo é re-treinado diariamente." },
  { q:"Quais métodos de pagamento são aceitos?", a:"PIX (taxa 0%), cartão de crédito em até 12x, boleto bancário, Apple Pay e Google Pay. Repasse em D+2 para PIX e D+30 para cartão." },
  { q:"Consigo personalizar com minha marca?", a:"Totalmente. Logo, cores, domínio próprio, emails e área de membros white-label. Seu aluno nunca vê menção à Implofy." },
  { q:"A gamificação funciona para qualquer nicho?", a:"Sim. Badges, ranking e conquistas são configuráveis por produto. Funciona em finanças, emagrecimento, relacionamentos e desenvolvimento pessoal." },
  { q:"Existe limite de cursos ou produtos?", a:"Cursos, produtos e aulas são ilimitados em todos os planos. O limite é apenas de alunos ativos simultâneos." },
  { q:"Posso cancelar a qualquer momento?", a:"Sim, sem multa e sem burocracia. Seus dados ficam disponíveis por 30 dias após o cancelamento para exportação completa." },
];

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

  const featured = TESTIMONIALS.find(t => t.featured)!;
  const rest = TESTIMONIALS.filter(t => !t.featured);

  return (
    <div className={s.root}>
      <div className={s.grain} aria-hidden />

      {/* HEADER */}
      <header className={`${s.header} ${scrolled ? s.scrolled : ""}`}>
        <div className={`${s.wrap} ${s.hrow}`}>
          <a href="#" onClick={e=>{e.preventDefault();window.scrollTo({top:0,behavior:"smooth"});}} className={s.logo}>
            <Logo /><span className={s.logoName}>Implofy</span>
          </a>
          <nav className={s.nav}>
            {[["#como","Como funciona"],["#produto","Produto"],["#planos","Planos"],["#faq","FAQ"]].map(([href,label])=>(
              <a key={href} onClick={e=>{e.preventDefault();to(href.slice(1));}} href={href}>{label}</a>
            ))}
          </nav>
          <div className={s.hbtns}>
            <button className={s.ghost} onClick={()=>setAuthMode("login")}>Entrar</button>
            <button className={s.solid} onClick={goSignup}>Criar conta grátis <ArrowRight size={14}/></button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className={s.hero}>
        <div className={s.heroMesh} aria-hidden />
        <div className={s.heroGrid} aria-hidden />
        <div className={s.orb1} aria-hidden /><div className={s.orb2} aria-hidden /><div className={s.orb3} aria-hidden />
        <div className={`${s.wrap} ${s.heroInner}`}>
          <div className={s.heroBadge}>
            <span className={s.heroBadgeDot} />
            <span>Novo · IA Anti-Abandono v2.0</span>
            <span className={s.heroBadgeSep} />
            <span className={s.heroBadgeMuted}>2.400 mentores confiando</span>
          </div>
          <h1 className={s.h1}>
            68% dos seus reembolsos<br />são evitáveis.<br />
            <span className={s.shine}>A Implofy evita os seus.</span>
          </h1>
          <p className={s.lead}>
            Monitore cada aluno em tempo real, receba alertas de risco 7 dias antes do abandono e aja com um clique.
            Dashboard, gamificação e checkout de alta conversão — em um único painel que substitui tudo que você usa hoje.
          </p>
          <div className={s.heroCtas}>
            <button className={s.ctaPrimary} onClick={goSignup}>Começar grátis — 14 dias <ArrowRight size={16}/></button>
            <button className={s.ctaSecondary} onClick={()=>to("produto")}>
              <div className={s.playIcon}><Play size={11} fill="currentColor" strokeWidth={0}/></div>
              Ver demonstração
            </button>
          </div>
          <div className={s.heroTrust}>
            {["Sem cartão de crédito","Setup em 5 minutos","Cancele quando quiser","Migração gratuita"].map((t,i)=>(
              <span key={i} className={s.trustItem}><Check size={11}/>{t}</span>
            ))}
          </div>
        </div>

        <div className={`${s.wrap} ${s.mockWrap}`}>
          <div className={s.mockGlow} aria-hidden />
          <div className={s.mock}>
            <div className={s.mockBar}>
              <div className={s.mockDots}><em/><em/><em/></div>
              <div className={s.mockUrl}>app.implofy.com.br/dashboard</div>
              <div className={s.mockBarRight}/>
            </div>
            <div className={s.mockBody}>
              <aside className={s.mockSide}>
                <div className={s.mockSideHeader}><Logo size={22}/><span>Implofy</span></div>
                {["Visão Geral","Alunos","Produtos","Vendas","Financeiro","IA","Gamificação"].map((t,i)=>(
                  <div key={t} className={`${s.mockSideItem} ${i===0?s.mockSideActive:""}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="13" height="13"><circle cx="12" cy="12" r="3"/></svg>
                    {t}{t==="IA"&&<span className={s.mockBadge}>3</span>}
                  </div>
                ))}
              </aside>
              <div className={s.mockMain}>
                <div className={s.mockHeader}>
                  <div><div className={s.mockTitle}>Dashboard · Hoje</div><div className={s.mockSub}>Atualizado agora · dados em tempo real</div></div>
                  <div className={s.mockLive}><span className={s.dot}/>AO VIVO</div>
                </div>
                <div className={s.mockMetrics}>
                  {[{l:"Receita hoje",v:"R$ 12.480",d:"↑ 18%",col:"#d4a42b"},{l:"Transações",v:"47",d:"↑ 9 hoje",col:"#22c55e"},{l:"Ticket médio",v:"R$ 265",d:"+R$ 32",col:"#d4a42b"},{l:"Alunos ativos",v:"1.247",d:"↑ 23",col:"#22c55e"}].map((c,i)=>(
                    <div key={i} className={s.mCard}>
                      <div className={s.mCardLabel}>{c.l}</div>
                      <div className={s.mCardValue}>{c.v}</div>
                      <div className={s.mCardDelta} style={{color:c.col}}>{c.d}</div>
                    </div>
                  ))}
                </div>
                <div className={s.mockChart}>
                  <svg viewBox="0 0 800 140" preserveAspectRatio="none">
                    <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d4a42b" stopOpacity=".3"/><stop offset="100%" stopColor="#d4a42b" stopOpacity="0"/></linearGradient></defs>
                    <g stroke="rgba(255,255,255,0.04)" strokeWidth="1">{[35,70,105].map(y=><line key={y} x1="0" y1={y} x2="800" y2={y}/>)}</g>
                    <polygon fill="url(#cg)" points="0,140 0,115 80,98 160,105 240,78 320,88 400,58 480,68 560,42 640,52 720,28 800,18 800,140"/>
                    <polyline fill="none" stroke="#d4a42b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points="0,115 80,98 160,105 240,78 320,88 400,58 480,68 560,42 640,52 720,28 800,18"/>
                    <circle cx="800" cy="18" r="4" fill="#d4a42b" opacity=".9"/><circle cx="800" cy="18" r="8" fill="#d4a42b" opacity=".2"/>
                  </svg>
                </div>
                <div className={s.mockFeed}>
                  {[{icon:"💰",text:"Nova venda · Programa PATRON · R$ 997 via PIX",t:"agora"},{icon:"🚨",text:"Alerta IA · João Oliveira sem acesso há 8 dias · risco alto",t:"2min"},{icon:"🏆",text:"Badge desbloqueada · Ana Silva concluiu Módulo 3",t:"5min"}].map((f,i)=>(
                    <div key={i} className={s.feedItem}><span className={s.feedIcon}>{f.icon}</span><span className={s.feedText}>{f.text}</span><span className={s.feedTime}>{f.t}</span></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className={`${s.float} ${s.floatA}`}>
            <div className={s.floatIconWrap} style={{background:"rgba(212,164,43,.12)"}}><Bell size={12} color="#d4a42b"/></div>
            <div><div className={s.fTitle}>Nova venda · R$ 997</div><div className={s.fSub}>Programa PATRON · agora mesmo</div></div>
          </div>
          <div className={`${s.float} ${s.floatB}`}>
            <div className={s.floatIconWrap} style={{background:"rgba(240,64,64,.12)"}}><Shield size={12} color="#f04040"/></div>
            <div><div className={s.fTitle}>Alerta IA · risco alto</div><div className={s.fSub}>João sem acesso há 8 dias</div></div>
          </div>
          <div className={`${s.float} ${s.floatC}`}>
            <div className={s.floatIconWrap} style={{background:"rgba(34,197,94,.12)"}}><Trophy size={12} color="#22c55e"/></div>
            <div><div className={s.fTitle}>Badge desbloqueada 🏆</div><div className={s.fSub}>Ana Silva · Módulo 3 completo</div></div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className={s.marquee}>
        <div className={s.mFadeL}/><div className={s.mFadeR}/>
        <div className={s.mTrack}>
          {[...MENTORS,...MENTORS].map((m,i)=>(
            <span key={i} className={s.mItem}><Star size={9} fill="#d4a42b" color="#d4a42b"/>{m}</span>
          ))}
        </div>
      </div>

      {/* MÉTRICAS */}
      <section className={s.metrics}>
        <div className={s.wrap}>
          <div className={s.metricsGrid}>
            {[{val:"R$ 1B+",label:"gerenciados na plataforma",icon:CreditCard,color:"#d4a42b"},{val:"2.400+",label:"mentores ativos no Brasil",icon:Users,color:"#d4a42b"},{val:"↓68%",label:"redução média de reembolsos",icon:Shield,color:"#22c55e"},{val:"98%",label:"de satisfação dos usuários",icon:Star,color:"#d4a42b"}].map(({val,label,icon:Icon,color},i)=>(
              <div key={i} className={s.metricCard}>
                <div className={s.metricIcon} style={{color}}><Icon size={17}/></div>
                <div className={s.metricVal} style={{color}}>{val}</div>
                <div className={s.metricLabel}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como" className={s.sec}>
        <div className={s.wrap}>
          <div className={s.secHead}>
            <span className={s.tag}>Como funciona</span>
            <h2>Do cadastro à escala em 3 passos</h2>
            <p>Sem instalação, sem desenvolvedor, sem planilha. Você começa a operar no mesmo dia.</p>
          </div>
          <div className={s.steps}>
            {STEPS.map(({n,title,desc,icon:Icon},i)=>(
              <div key={i} className={s.step}>
                <div className={s.stepNumWrap}><span className={s.stepNum}>{n}</span></div>
                <div className={s.stepIcon}><Icon size={20}/></div>
                <h3 className={s.stepTitle}>{title}</h3>
                <p className={s.stepDesc}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES BENTO */}
      <section className={`${s.sec} ${s.featSec}`}>
        <div className={s.secOrb} aria-hidden/>
        <div className={s.wrap} style={{position:"relative",zIndex:1}}>
          <div className={s.secHead}>
            <span className={s.tag}>Por que Implofy</span>
            <h2>Tudo que sua mentoria precisa, em um lugar só</h2>
            <p>Cada funcionalidade foi construída pensando em como mentores realmente trabalham — sem concessões.</p>
          </div>
          <div className={s.bento}>
            <div className={`${s.bentoCard} ${s.bentoAI}`}>
              <div className={s.bentoCardGlow} aria-hidden/>
              <div className={s.bentoHeader}>
                <div className={s.bentoIconBig} style={{background:"rgba(212,164,43,.10)",borderColor:"rgba(212,164,43,.2)"}}>
                  <Brain size={22} color="#d4a42b"/>
                </div>
                <div>
                  <div className={s.bentoTag}><span className={s.dot}/>Monitorando 1.247 alunos agora</div>
                  <h3 className={s.bentoTitle}>IA Anti-Abandono</h3>
                  <p className={s.bentoDesc}>Nossa IA cruza 40+ sinais de comportamento por aluno — dias sem login, módulos parados, queda de engajamento — e emite alertas com ações sugeridas 7 dias antes do reembolso acontecer.</p>
                </div>
              </div>
              <div className={s.alertCards}>
                {[
                  {color:"#f04040",level:"Risco alto",name:"João Oliveira",detail:"Sem acesso há 8 dias · Score: 92%",action:"Enviar reativação"},
                  {color:"#d4a42b",level:"Risco médio",name:"Ana Silva",detail:"Progresso parado há 5 dias · Score: 71%",action:"Sugerir próximo módulo"},
                  {color:"#22c55e",level:"Recuperado",name:"Pedro Henrique",detail:"Voltou a estudar hoje · Score: 18%",action:"Parabéns enviado ✓"},
                ].map((a,i)=>(
                  <div key={i} className={s.alertRow} style={{borderLeftColor:a.color}}>
                    <div className={s.alertRowLeft}>
                      <span className={s.alertLvl} style={{color:a.color,background:`${a.color}14`,borderColor:`${a.color}35`}}>{a.level}</span>
                      <span className={s.alertName}>{a.name}</span>
                      <span className={s.alertDetail}>{a.detail}</span>
                    </div>
                    <span className={s.alertAction}>{a.action}</span>
                  </div>
                ))}
              </div>
              <div className={s.bentoStats}>
                <div><strong>↓68%</strong><span>reembolsos</span></div>
                <div className={s.bentoStatSep}/>
                <div><strong>+3.2x</strong><span>retenção</span></div>
                <div className={s.bentoStatSep}/>
                <div><strong>7 dias</strong><span>de antecedência</span></div>
              </div>
            </div>
            <div className={`${s.bentoCard} ${s.bentoGami}`}>
              <div className={s.bentoIcon} style={{background:"rgba(212,164,43,.08)",borderColor:"rgba(212,164,43,.18)"}}><Trophy size={18} color="#d4a42b"/></div>
              <h3 className={s.bentoTitle}>Gamificação Nativa</h3>
              <p className={s.bentoDesc}>Badges automáticas, ranking de alunos e pontos por progresso. Sem integração, sem código.</p>
              <div className={s.gamiMini}>
                {[{r:1,n:"Mariana Lopes",p:"2.480 pts"},{r:2,n:"Carlos Eduardo",p:"2.310 pts"},{r:3,n:"Beatriz Souza",p:"2.105 pts"}].map(row=>(
                  <div key={row.r} className={s.gamiRow}><span className={s.gamiRank}>{row.r}</span><span className={s.gamiName}>{row.n}</span><span className={s.gamiPts}>{row.p}</span></div>
                ))}
              </div>
              <div className={s.gamiBadges}>{["🏆","⭐","🔥","💎","🎯","🚀"].map(b=><span key={b} className={s.gamiBadge}>{b}</span>)}</div>
              <div className={s.bentoBadge} style={{color:"#d4a42b",background:"rgba(212,164,43,.08)",borderColor:"rgba(212,164,43,.18)"}}>+3x conclusões de módulos</div>
            </div>
            <div className={`${s.bentoCard} ${s.bentoDash}`}>
              <div className={s.bentoIcon} style={{background:"rgba(75,123,255,.08)",borderColor:"rgba(75,123,255,.18)"}}><Activity size={18} color="#4b7bff"/></div>
              <h3 className={s.bentoTitle}>Dashboard em Tempo Real</h3>
              <p className={s.bentoDesc}>Cada transação, cada aluno, cada métrica — atualizada ao vivo.</p>
              <div className={s.dashMini}>
                <div><div className={s.dashMiniVal}>R$ 12.480</div><div className={s.dashMiniLabel}>receita hoje</div></div>
                <div className={s.dashMiniChart}>
                  <svg viewBox="0 0 200 60" preserveAspectRatio="none">
                    <defs><linearGradient id="dg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4b7bff" stopOpacity=".25"/><stop offset="100%" stopColor="#4b7bff" stopOpacity="0"/></linearGradient></defs>
                    <polygon fill="url(#dg)" points="0,60 0,48 40,38 80,42 120,28 160,34 200,18 200,60"/>
                    <polyline fill="none" stroke="#4b7bff" strokeWidth="1.5" strokeLinecap="round" points="0,48 40,38 80,42 120,28 160,34 200,18"/>
                  </svg>
                </div>
              </div>
              <div className={s.bentoBadge} style={{color:"#4b7bff",background:"rgba(75,123,255,.08)",borderColor:"rgba(75,123,255,.18)"}}>Atualizado ao vivo · ↑18% hoje</div>
            </div>
            <div className={`${s.bentoCard} ${s.bentoCheckout}`}>
              <div className={s.bentoIcon} style={{background:"rgba(34,197,94,.08)",borderColor:"rgba(34,197,94,.18)"}}><CreditCard size={18} color="#22c55e"/></div>
              <h3 className={s.bentoTitle}>Checkout de Alta Conversão</h3>
              <p className={s.bentoDesc}>Order bumps, upsells e 6 métodos de pagamento. PIX com taxa 0%.</p>
              <div className={s.payMethods}>{["PIX 0%","Cartão 12x","Boleto","Apple Pay"].map(m=><span key={m} className={s.payMethod}>{m}</span>)}</div>
              <div className={s.bentoBadge} style={{color:"#22c55e",background:"rgba(34,197,94,.08)",borderColor:"rgba(34,197,94,.18)"}}>+34% conversão vs concorrentes</div>
            </div>
            <div className={`${s.bentoCard} ${s.bentoReports}`}>
              <div className={s.bentoIcon} style={{background:"rgba(212,164,43,.08)",borderColor:"rgba(212,164,43,.18)"}}><BarChart3 size={18} color="#d4a42b"/></div>
              <h3 className={s.bentoTitle}>Relatórios Avançados</h3>
              <p className={s.bentoDesc}>Coorte de retenção, ticket médio, chargeback e conversão por método. Exportáveis em CSV e PDF.</p>
              <div className={s.bentoBadge} style={{color:"#d4a42b",background:"rgba(212,164,43,.08)",borderColor:"rgba(212,164,43,.18)"}}>Dados em tempo real</div>
            </div>
            <div className={`${s.bentoCard} ${s.bentoWhite}`}>
              <div className={s.bentoIcon} style={{background:"rgba(160,100,240,.08)",borderColor:"rgba(160,100,240,.18)"}}><Sparkles size={18} color="#a064f0"/></div>
              <h3 className={s.bentoTitle}>White-Label Completo</h3>
              <p className={s.bentoDesc}>Seu logo, suas cores, seu domínio. O aluno nunca vê a Implofy.</p>
              <div className={s.bentoBadge} style={{color:"#a064f0",background:"rgba(160,100,240,.08)",borderColor:"rgba(160,100,240,.18)"}}>100% personalizado</div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUTO TABS */}
      <section id="produto" className={s.sec}>
        <div className={s.wrap}>
          <div className={s.secHead}>
            <span className={s.tag}>Visão do produto</span>
            <h2>O dashboard que mentores de elite usam todo dia</h2>
            <p>Cada métrica que importa, cada alerta que protege sua receita — em tempo real, sem fricção.</p>
          </div>
          <div className={s.tabs}>
            {(["dashboard","ia","gami","fin"] as Tab[]).map((k,i)=>{
              const labels=["Dashboard","Inteligência IA","Gamificação","Financeiro"];
              return <button key={k} onClick={()=>setTab(k)} className={`${s.tabBtn} ${tab===k?s.tabActive:""}`}>{labels[i]}</button>;
            })}
          </div>
          <div className={s.preview} key={tab}>
            {tab==="dashboard"&&(
              <div className={s.dash}>
                <aside className={s.dSide}>
                  <div className={s.dLogo}><Logo size={26}/><span>Implofy</span></div>
                  <nav>
                    {["Visão Geral","Alunos","Produtos","Vendas","Financeiro","IA","Gamificação","Relatórios"].map((t,i)=>(
                      <div key={t} className={`${s.dNav} ${i===0?s.dNavActive:""}`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="14" height="14"><circle cx="12" cy="12" r="3"/></svg>
                        {t}{(t==="IA"||t==="Financeiro")&&<span className={s.dBadge}>{t==="IA"?"3":"1"}</span>}
                      </div>
                    ))}
                  </nav>
                  <div className={s.dUser}><div className={s.dAvatar}>MC</div><div><strong>Marcos Costa</strong><span>Mentor</span></div></div>
                </aside>
                <div className={s.dMain}>
                  <div className={s.dTop}>
                    <div><div className={s.dTitle}>Domingo, 20 de Abril</div><div className={s.dSub}>Atualizado agora · tempo real</div></div>
                    <div className={s.dFilters}>
                      {["Hoje","7 dias","30 dias","Este mês"].map((f,i)=><button key={f} className={`${s.dFilter} ${i===0?s.dFilterOn:""}`}>{f}</button>)}
                      <div className={s.live}><span className={s.dot}/>AO VIVO</div>
                    </div>
                  </div>
                  <div className={s.dCards}>
                    {[{l:"Receita total",v:"R$ 12.480",d:"↑ 18% vs ontem"},{l:"Transações",v:"47",d:"↑ 9 hoje"},{l:"Ticket médio",v:"R$ 265",d:"+R$ 32"},{l:"PIX",v:"R$ 8.140",d:"65% do total"},{l:"Cartão",v:"R$ 3.620",d:"29% do total"},{l:"Boleto",v:"R$ 720",d:"6% do total"}].map((c,i)=>(
                      <div key={i} className={s.dCard}><div className={s.dCardLabel}>{c.l}</div><div className={s.dCardValue}>{c.v}</div><div className={s.dCardDelta}>{c.d}</div></div>
                    ))}
                  </div>
                  <div className={s.dRow}>
                    <div className={s.dBlock} style={{flex:1.6}}>
                      <div className={s.dBlockTitle}>Receita por dia</div><div className={s.dBlockSub}>Últimos 14 dias</div>
                      <div className={s.dChartArea}>
                        <svg viewBox="0 0 600 160" preserveAspectRatio="none">
                          <defs><linearGradient id="g3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d4a42b" stopOpacity=".22"/><stop offset="100%" stopColor="#d4a42b" stopOpacity="0"/></linearGradient></defs>
                          <polygon fill="url(#g3)" points="0,160 0,138 60,122 120,130 180,100 240,112 300,80 360,90 420,58 480,72 540,44 600,38 600,160"/>
                          <polyline fill="none" stroke="#d4a42b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points="0,138 60,122 120,130 180,100 240,112 300,80 360,90 420,58 480,72 540,44 600,38"/>
                        </svg>
                      </div>
                    </div>
                    <div className={s.dBlock} style={{flex:1}}>
                      <div className={s.dBlockTitle}>Top produtos</div><div className={s.dBlockSub}>Esta semana</div>
                      {[{r:1,n:"Programa PATRON",p:"R$ 997"},{r:2,n:"Identidade Restaurada",p:"R$ 199"},{r:3,n:"Imersão SP",p:"R$ 1.990"}].map(p=>(
                        <div key={p.r} className={s.pRow}><div className={s.pRank}>{p.r}</div><div className={s.pName}>{p.n}</div><div className={s.pPrice}>{p.p}</div></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {tab==="ia"&&(
              <div className={s.pane}>
                <div className={s.paneHead}><h3>Alertas de IA · ranqueados por risco</h3><div className={s.live}><span className={s.dot}/>MONITORANDO 1.247 ALUNOS</div></div>
                <div className={s.iaList}>
                  {[{name:"João Oliveira",days:8,risk:92,level:"Alto",color:"#f04040",action:"Enviar mensagem de reativação"},{name:"Ana Silva",days:5,risk:71,level:"Médio",color:"#d4a42b",action:"Sugerir próximo módulo"},{name:"Pedro Henrique",days:3,risk:48,level:"Baixo",color:"#22c55e",action:"Acompanhar evolução"},{name:"Carla Mendes",days:12,risk:95,level:"Alto",color:"#f04040",action:"Ligação prioritária"},{name:"Rafael Costa",days:6,risk:64,level:"Médio",color:"#d4a42b",action:"Email com checkpoint"}].map((a,i)=>(
                    <div key={i} className={s.iaRow}>
                      <div className={s.dAvatar} style={{fontSize:11}}>{a.name.split(" ").map(n=>n[0]).join("").slice(0,2)}</div>
                      <div style={{flex:1}}><div className={s.iaName}>{a.name}</div><div className={s.iaSub}>Sem acesso há {a.days} dias · {a.action}</div></div>
                      <div className={s.iaBarWrap}><div className={s.iaBar}><div style={{width:`${a.risk}%`,background:a.color,height:"100%",borderRadius:"999px"}}/></div><span className={s.iaScore} style={{color:a.color}}>{a.risk}%</span></div>
                      <span className={s.iaBadge} style={{color:a.color,background:`${a.color}12`,borderColor:`${a.color}40`}}>{a.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {tab==="gami"&&(
              <div className={s.pane}>
                <div className={s.paneHead}><h3>Ranking & conquistas</h3><div className={s.live}><span className={s.dot}/>ATUALIZADO AGORA</div></div>
                <div className={s.gamiTabRow}>
                  <div className={s.dBlock} style={{flex:1}}>
                    <div className={s.dBlockTitle}>Top alunos da semana</div><div className={s.dBlockSub}>Módulos + engajamento combinados</div>
                    {[{r:1,n:"Mariana Lopes",p:"2.480 pts"},{r:2,n:"Carlos Eduardo",p:"2.310 pts"},{r:3,n:"Beatriz Souza",p:"2.105 pts"},{r:4,n:"Felipe Andrade",p:"1.980 pts"},{r:5,n:"Larissa Pinto",p:"1.840 pts"}].map(p=>(
                      <div key={p.r} className={s.pRow}><div className={s.pRank}>{p.r}</div><div className={s.pName}>{p.n}</div><div className={s.pPrice}>{p.p}</div></div>
                    ))}
                  </div>
                  <div className={s.dBlock} style={{flex:1}}>
                    <div className={s.dBlockTitle}>Badges desbloqueadas hoje</div><div className={s.dBlockSub}>12 conquistas nas últimas 24h</div>
                    <div className={s.badgeGrid}>{["🏁 Início","⭐ Módulo 1","🔥 Módulo 2","💎 Módulo 3","⚡ Maratona","🏆 Top 10"].map(b=><div key={b} className={s.badgeCard}><span>{b}</span></div>)}</div>
                  </div>
                </div>
              </div>
            )}
            {tab==="fin"&&(
              <div className={s.pane}>
                <div className={s.paneHead}><h3>Saldo & repasses</h3><button className={s.solid} onClick={goSignup}>Sacar agora <ArrowRight size={13}/></button></div>
                <div className={s.finCards}>
                  <div className={s.finBig}><div className={s.finLabel}>Saldo disponível</div><div className={s.finVal}>R$ 38.420,90</div><div className={s.finSub}>Próximo repasse: hoje, 18h00</div></div>
                  <div className={s.finBig} style={{borderColor:"rgba(255,255,255,.06)"}}><div className={s.finLabel}>Saldo pendente</div><div className={s.finVal} style={{color:"var(--t)"}}>R$ 12.180,00</div><div className={s.finSub}>Liberação em D+30 (cartão)</div></div>
                  <div className={s.finBig} style={{borderColor:"rgba(255,255,255,.06)"}}><div className={s.finLabel}>Total do mês</div><div className={s.finVal} style={{color:"var(--t)"}}>R$ 84.620,00</div><div className={s.finSub}>↑ 23% vs mês anterior</div></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* COMPARATIVO */}
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
              <div className={`${s.thCol} ${s.thHighlight}`}><Logo size={16}/>Implofy</div>
              <div className={s.thCol}>Hotmart</div><div className={s.thCol}>Kiwify</div><div className={s.thCol}>Eduzz</div>
            </div>
            {COMPARE.map((row,i)=>(
              <div key={i} className={`${s.tableRow} ${i%2===1?s.tableRowAlt:""}`}>
                <div className={s.tdFeat}>{row.feat}</div>
                {([row.imp,row.hot,row.kiw,row.edz] as boolean[]).map((v,j)=>(
                  <div key={j} className={`${s.tdCol} ${j===0?s.tdHighlight:""}`}>
                    {v?<Check size={15} color="#22c55e" strokeWidth={2.5}/>:<X size={15} color="#3a3a55" strokeWidth={2}/>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANOS */}
      <section id="planos" className={s.sec}>
        <div className={s.pricingOrb} aria-hidden/>
        <div className={s.wrap} style={{position:"relative",zIndex:1}}>
          <div className={s.secHead}>
            <span className={s.tag}>Planos e preços</span>
            <h2>Simples, transparente, sem surpresas</h2>
            <p>14 dias grátis em qualquer plano. Sem cartão. Cancele quando quiser.</p>
            <div className={s.toggle}>
              <span className={!annual?s.tOn:s.tOff}>Mensal</span>
              <button className={s.tSwitch} onClick={()=>setAnnual(v=>!v)}><div className={`${s.tKnob} ${annual?s.tKnobOn:""}`}/></button>
              <span className={annual?s.tOn:s.tOff}>Anual <em className={s.tBadge}>Economize 20%</em></span>
            </div>
          </div>
          <div className={s.plans}>
            {PLANS.map((p,i)=>{
              const price=annual?Math.round(p.price*.8):p.price;
              return (
                <div key={i} className={`${s.plan} ${p.highlight?s.planOn:""}`}>
                  {p.highlight&&<div className={s.planBadge}>Mais popular</div>}
                  <div className={s.planName}>{p.name}</div>
                  <div className={s.planPrice}><span className={s.planCurrency}>R$</span>{price}<span className={s.planPer}>/mês</span></div>
                  <p className={s.planDesc}>{p.desc}</p>
                  <button className={p.highlight?s.ctaPrimary:s.ctaOutline} style={{width:"100%",justifyContent:"center"}} onClick={goSignup}>Começar grátis <ArrowRight size={14}/></button>
                  <div className={s.planDivider}/>
                  <ul className={s.planList}>{p.items.map((item,j)=><li key={j}><Check size={12} color="#d4a42b"/>{item}</li>)}</ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className={`${s.sec} ${s.testimonSec}`}>
        <div className={s.wrap}>
          <div className={s.secHead}>
            <span className={s.tag}>Quem usa a Implofy</span>
            <h2>Mentores que já transformaram sua operação</h2>
            <p>Resultados reais de quem parou de perder receita evitável.</p>
          </div>
          <div className={s.testimonFeatured}>
            <div className={s.tFeatQuote}>{Array(featured.stars).fill(0).map((_,k)=><Star key={k} size={14} fill="#d4a42b" color="#d4a42b"/>)}</div>
            <blockquote className={s.tFeatText}>"{featured.quote}"</blockquote>
            <div className={s.tFeatAuthor}>
              <div className={s.tAvatarLg}>{featured.initials}</div>
              <div><strong>{featured.name}</strong><span>{featured.role}</span></div>
            </div>
          </div>
          <div className={s.tGrid}>
            {rest.map((t,i)=>(
              <article key={i} className={s.tCard}>
                <div className={s.tStars}>{Array(t.stars).fill(0).map((_,k)=><Star key={k} size={11} fill="#d4a42b" color="#d4a42b"/>)}</div>
                <p className={s.tQuote}>"{t.quote}"</p>
                <div className={s.tFoot}><div className={s.tAvatar}>{t.initials}</div><div><strong>{t.name}</strong><span>{t.role}</span></div></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className={s.ctaSec}>
        <div className={s.ctaMesh} aria-hidden/><div className={s.ctaOrb} aria-hidden/>
        <div className={`${s.wrap} ${s.ctaInner}`}>
          <div className={s.ctaTag}><TrendingUp size={13}/>Junte-se a 2.400 mentores que pararam de perder receita evitável</div>
          <h2 className={s.ctaH2}>Sua próxima mentoria não<br /><span className={s.shine}>precisa de planilha.</span></h2>
          <p className={s.ctaLead}>14 dias de acesso total ao plano Pro, sem cartão de crédito.<br />Migração gratuita da sua plataforma atual incluída.</p>
          <button className={s.ctaPrimaryLg} onClick={goSignup}>Criar minha conta grátis <ArrowRight size={18}/></button>
          <div className={s.ctaTrust}>
            {["Sem cartão de crédito","14 dias grátis","Cancele quando quiser","Migração gratuita"].map((t,i)=>(
              <span key={i}><Check size={12}/>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className={s.sec}>
        <div className={s.wrap}>
          <div className={s.secHead}>
            <span className={s.tag}>Dúvidas frequentes</span>
            <h2>Tudo que você precisa saber</h2>
            <p>Não encontrou sua dúvida? Fale com a gente no WhatsApp.</p>
          </div>
          <div className={s.faqList}>
            {FAQS.map((f,i)=>{
              const open=faq===i;
              return (
                <div key={i} className={`${s.faqItem} ${open?s.faqOpen:""}`}>
                  <button className={s.faqQ} onClick={()=>setFaq(open?null:i)}>
                    <span>{f.q}</span>
                    <div className={s.faqIcon}>{open?<Minus size={14}/>:<Plus size={14}/>}</div>
                  </button>
                  <div className={s.faqA} style={{maxHeight:open?200:0}}><p>{f.a}</p></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={s.footer}>
        <div className={s.wrap}>
          <div className={s.footerGrid}>
            <div className={s.footerBrand}>
              <a href="#" className={s.logo} onClick={e=>{e.preventDefault();window.scrollTo({top:0,behavior:"smooth"});}}><Logo/><span className={s.logoName}>Implofy</span></a>
              <p>A plataforma onde mentores de elite gerenciam vendas, alunos e crescimento — em um único painel inteligente.</p>
              <div className={s.footerSocials}>{["Instagram","YouTube","LinkedIn"].map(n=><a key={n} href="#" className={s.socialLink}>{n}</a>)}</div>
            </div>
            <div className={s.footerCol}><h4>Produto</h4><ul>{[["#como","Como funciona"],["#produto","Dashboard"],["#planos","Planos"],["#faq","FAQ"]].map(([h,l])=><li key={h}><a href={h}>{l}</a></li>)}</ul></div>
            <div className={s.footerCol}><h4>Empresa</h4><ul>{["Sobre","Blog","Contato","Carreiras"].map(l=><li key={l}><a href="#">{l}</a></li>)}</ul></div>
            <div className={s.footerCol}><h4>Legal</h4><ul>{["Termos de Uso","Privacidade","Cookies","LGPD"].map(l=><li key={l}><a href="#">{l}</a></li>)}</ul></div>
          </div>
          <div className={s.footerBottom}>
            <span>© 2026 Implofy. Todos os direitos reservados.</span>
            <span>Feito com precisão para mentores que não aceitam perder receita.</span>
          </div>
        </div>
      </footer>

      <AuthModals mode={authMode} onModeChange={setAuthMode}/>
    </div>
  );
}
