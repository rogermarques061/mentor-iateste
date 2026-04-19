import { useEffect, useState } from "react";
import { ArrowRight, Plus, Minus } from "lucide-react";
import s from "./Landing.module.css";
import { AuthModals, type AuthMode } from "@/components/landing/AuthModals";

const LogoMark = ({ size = 36 }: { size?: number }) => (
  <div className={s.logoMark} style={{ width: size, height: size, borderRadius: size * 0.25 }}>
    <svg viewBox="0 0 24 24" width={size * 0.55} height={size * 0.55} fill="none" stroke="#1a1300" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 17 L10 11 L14 15 L20 7" />
      <circle cx="20" cy="7" r="1.5" fill="#1a1300" />
    </svg>
  </div>
);

type TabKey = "dashboard" | "ia" | "gami" | "fin";

const Landing = () => {
  const [scrolled, setScrolled] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>(null);
  const [tab, setTab] = useState<TabKey>("dashboard");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    document.title = "Implofy — Painel de Performance para Mentores";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Dashboard completo com alertas de IA, gamificação e métricas em tempo real para mentores que vendem mais."
      );
    }
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const faqs = [
    { q: "Como funciona o período de teste gratuito?", a: "Você tem 14 dias gratuitos com acesso a todas as funcionalidades, sem cartão de crédito. Ao final, escolhe o plano que faz sentido para o seu volume de operação." },
    { q: "Posso migrar meus alunos de outra plataforma?", a: "Sim. Nosso time faz a importação completa de alunos, módulos e progresso de qualquer plataforma (Hotmart, Kiwify, Eduzz, etc.) sem custo adicional." },
    { q: "Como a IA identifica alunos em risco de abandono?", a: "Cruzamos sinais como dias sem login, módulos parados, queda de engajamento e padrões de comportamento de alunos que pediram reembolso historicamente — tudo em tempo real." },
    { q: "Quais métodos de pagamento são aceitos?", a: "PIX, cartão de crédito (até 12x), boleto bancário e Apple/Google Pay. Repasse em D+2 para PIX e D+30 para cartão." },
    { q: "Consigo personalizar a área de membros com minha marca?", a: "Totalmente. Logo, cores, domínio próprio, emails transacionais — tudo white-label, sem qualquer menção à Implofy para o aluno." },
    { q: "A plataforma tem sistema de gamificação nativo?", a: "Sim. Badges automáticas, ranking de alunos, pontos por progresso e conquistas configuráveis por mentor. Sem precisar de integração externa." },
    { q: "Como funciona o suporte ao mentor?", a: "Suporte humano via WhatsApp das 8h às 22h, todos os dias. Mentores do plano Elite têm gerente de conta dedicado." },
    { q: "Posso vender produtos físicos e digitais?", a: "Sim. Cursos, mentorias, comunidades, eventos presenciais, ebooks e produtos físicos com gestão de estoque e frete integrados." },
    { q: "Existe limite de alunos ou cursos no meu plano?", a: "Plano Starter até 200 alunos ativos, Pro até 2.000, Elite ilimitado. Cursos e produtos são sempre ilimitados em qualquer plano." },
    { q: "Como funcionam os relatórios de performance?", a: "Dashboards em tempo real com vendas, conversão por método, ticket médio, chargebacks, retenção por coorte e exportação em CSV/PDF." },
  ];

  return (
    <div className={s.landing}>
      {/* HEADER */}
      <header className={`${s.header} ${scrolled ? s.headerScrolled : ""}`}>
        <div className={`${s.container} ${s.headerInner}`}>
          <a href="#" className={s.logo} onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
            <LogoMark />
            <div className={s.logoText}>
              <strong>Implofy</strong>
              <span>Painel de Performance</span>
            </div>
          </a>
          <nav className={s.nav}>
            <a href="#beneficios" onClick={(e) => { e.preventDefault(); scrollTo("beneficios"); }}>Para Mentores</a>
            <a href="#alunos" onClick={(e) => { e.preventDefault(); scrollTo("alunos"); }}>Para Alunos</a>
            <a href="#preview" onClick={(e) => { e.preventDefault(); scrollTo("preview"); }}>Recursos</a>
            <a href="#faq" onClick={(e) => { e.preventDefault(); scrollTo("faq"); }}>Preços</a>
          </nav>
          <div className={s.headerActions}>
            <button className={`${s.btn} ${s.btnGhost}`} onClick={() => setAuthMode("login")}>Entrar</button>
            <button className={`${s.btn} ${s.btnPrimary}`} onClick={() => setAuthMode("signup")}>Criar Conta</button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className={s.hero}>
        <div className={s.heroBg} />
        <div className={`${s.container} ${s.heroGrid}`}>
          <div className={s.heroLeft}>
            <div className={s.heroBadge}>
              <span className={s.pulseDot} />
              Ao vivo — dados em tempo real
            </div>
            <h1 className={s.heroH1}>
              Gerencie sua mentoria com <span className={s.accent}>inteligência</span> e visão total de performance
            </h1>
            <p className={s.heroLead}>
              Dashboard completo com alertas de IA, gamificação e métricas em tempo real para mentores que vendem mais.
            </p>
            <div className={s.heroCtas}>
              <button className={`${s.btn} ${s.btnPrimary} ${s.btnLg}`} onClick={() => setAuthMode("signup")}>
                Criar minha conta <ArrowRight size={14} />
              </button>
              <button className={`${s.btn} ${s.btnOutline} ${s.btnLg}`} onClick={() => scrollTo("preview")}>
                Ver demonstração
              </button>
            </div>
            <div className={s.heroTrust}>
              <span><strong>2.400</strong> mentores ativos</span>
              <span className={s.dot} />
              <span><strong>98%</strong> satisfação</span>
              <span className={s.dot} />
              <span><strong>↓68%</strong> reembolsos</span>
            </div>
          </div>

          <div className={s.heroVisual}>
            <div className={s.heroMock}>
              <div className={s.heroMockBar}><span /><span /><span /></div>
              <div className={s.heroMockBody}>
                <div className={s.heroMockCard}>
                  <span className="label">Vendas hoje</span>
                  <span className="value">R$ 12.480</span>
                  <span className="delta">↑ 18% vs ontem</span>
                </div>
                <div className={s.heroMockCard}>
                  <span className="label">Transações</span>
                  <span className="value">47</span>
                  <span className="delta">↑ 9 hoje</span>
                </div>
                <div className={s.heroMockCard}>
                  <span className="label">Ticket médio</span>
                  <span className="value">R$ 265</span>
                  <span className="delta">+R$ 32</span>
                </div>
                <div className={s.heroMockChart}>
                  <svg viewBox="0 0 300 90" preserveAspectRatio="none">
                    <g stroke="rgba(255,255,255,0.04)" strokeWidth="1">
                      <line x1="0" y1="22" x2="300" y2="22" />
                      <line x1="0" y1="45" x2="300" y2="45" />
                      <line x1="0" y1="68" x2="300" y2="68" />
                    </g>
                    <polyline fill="none" stroke="#c9a227" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      points="0,70 30,55 60,62 90,40 120,48 150,30 180,38 210,22 240,28 270,15 300,20" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Floating cards (Cakto-style) */}
            <div className={`${s.floatCard} ${s.floatTopRight}`}>
              <span className={s.floatDot} />
              <div>
                <div className={s.floatTitle}>Nova venda · R$ 997,00</div>
                <div className={s.floatSub}>Programa PATRON · 22:48</div>
              </div>
            </div>
            <div className={`${s.floatCard} ${s.floatLeftMid}`}>
              <span className={s.floatDot} />
              <div>
                <div className={s.floatTitle}>Alerta IA · risco alto</div>
                <div className={s.floatSub}>João Oliveira sem acesso há 8 dias · 22:18</div>
              </div>
            </div>
            <div className={`${s.floatCard} ${s.floatBottomRight}`}>
              <span className={s.floatDot} />
              <div>
                <div className={s.floatTitle}>Badge desbloqueada</div>
                <div className={s.floatSub}>Ana Silva conquistou Módulo 3 · 21:30</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section id="beneficios" className={s.section}>
        <div className={s.container}>
          <div className={s.sectionHead}>
            <span className={s.sectionTag}>Por que Implofy</span>
            <h2>Tudo que você precisa para escalar sua mentoria</h2>
            <p>Da venda à retenção, em um único painel pensado para infoprodutores que levam o jogo a sério.</p>
          </div>
          <div className={s.benefitsGrid}>
            {[
              { svg: <path d="M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />, t: "Vendas em tempo real", d: "Acompanhe cada transação com filtros por dia, semana e mês.", n: "+R$ 12.480 hoje" },
              { svg: <path d="M12 9v4M12 17h.01M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />, t: "Inteligência de abandono", d: "IA identifica alunos em risco antes do reembolso acontecer.", n: "↓68% reembolsos" },
              { svg: <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z" />, t: "Gamificação integrada", d: "Badges e conquistas aumentam o engajamento automaticamente.", n: "+3.2x retenção" },
              { svg: <path d="M3 3v18h18M7 14l4-4 4 4 6-6" />, t: "Relatórios de performance", d: "Ticket médio, conversão por método de pagamento e chargeback.", n: "98% satisfação" },
            ].map((b, i) => (
              <div key={i} className={s.benefitCard}>
                <div className={s.benefitIcon}>
                  <svg viewBox="0 0 24 24">{b.svg}</svg>
                </div>
                <h3>{b.t}</h3>
                <p>{b.d}</p>
                <div className={s.benefitNum}>{b.n}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW with TABS */}
      <section id="preview" className={s.section} style={{ paddingTop: 40 }}>
        <div className={s.container}>
          <div className={s.sectionHead}>
            <span className={s.sectionTag}>Visão do produto</span>
            <h2>O dashboard que mentores de elite usam todo dia</h2>
            <p>Cada métrica que importa, cada alerta que protege sua receita — tudo organizado, em tempo real.</p>
          </div>

          <div className={s.tabsBar}>
            {([
              { k: "dashboard", l: "Dashboard" },
              { k: "ia", l: "Inteligência IA" },
              { k: "gami", l: "Gamificação" },
              { k: "fin", l: "Financeiro" },
            ] as { k: TabKey; l: string }[]).map((t) => (
              <button
                key={t.k}
                className={`${s.tabBtn} ${tab === t.k ? s.tabBtnActive : ""}`}
                onClick={() => setTab(t.k)}
              >
                {t.l}
              </button>
            ))}
          </div>

          <div className={s.previewWrap} key={tab}>
            {tab === "dashboard" && (
              <div className={s.dash}>
                <aside className={s.dashSide}>
                  <div className={s.dashSideLogo}>
                    <LogoMark size={28} />
                    <div>
                      <strong>Implofy</strong>
                      <span className="tag">Painel</span>
                    </div>
                  </div>
                  <nav className={s.dashNav}>
                    {[
                      { t: "Visão Geral", active: true, ico: <path d="M3 12 12 3l9 9M5 10v10h14V10" /> },
                      { t: "Alunos", ico: <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" /> },
                      { t: "Produtos", ico: <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /> },
                      { t: "Vendas", ico: <path d="M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /> },
                      { t: "Financeiro", ico: <path d="M3 3v18h18M7 14l4-4 4 4 6-6" /> },
                      { t: "Checkout", badge: 2, ico: <path d="M3 6h18l-2 13H5L3 6Z" /> },
                      { t: "Inteligência IA", badge: 3, ico: <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4ZM4 22a8 8 0 0 1 16 0" /> },
                      { t: "Conteúdo", ico: <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6ZM14 2v6h6" /> },
                      { t: "Gamificação", ico: <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M18 2H6v7a6 6 0 0 0 12 0V2Z" /> },
                      { t: "Relatórios", ico: <path d="M3 3v18h18M8 17V9M13 17V5M18 17v-6" /> },
                      { t: "Configurações", ico: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1Z" /></> },
                    ].map((it, i) => (
                      <div key={i} className={`${s.dashNavItem} ${it.active ? s.dashNavItemActive : ""}`}>
                        <svg viewBox="0 0 24 24">{it.ico}</svg>
                        <span>{it.t}</span>
                        {it.badge && <span className={s.badgeNum}>{it.badge}</span>}
                      </div>
                    ))}
                  </nav>
                  <div className={s.dashSideUser}>
                    <div className={s.avatar}>MC</div>
                    <div className="who">
                      <strong>Marcos Costa</strong>
                      <span>Mentor</span>
                    </div>
                    <span className="arrow">›</span>
                  </div>
                </aside>

                <div className={s.dashMain}>
                  <div className={s.dashTop}>
                    <div>
                      <h3>Domingo, 19 de Abril</h3>
                      <div className="sub">Atualizado às 01:04 · dados em tempo real</div>
                    </div>
                    <div className={s.dashFilters}>
                      {["Hoje", "Ontem", "7 dias", "30 dias", "Este mês", "Personalizado"].map((f, i) => (
                        <button key={f} className={`${s.dashFilter} ${i === 0 ? s.dashFilterActive : ""}`}>{f}</button>
                      ))}
                      <span className={s.dashLive}><span className={s.pulseDot} />AO VIVO — HOJE</span>
                    </div>
                  </div>

                  <div className={s.dashMetrics}>
                    {[
                      { l: "Vendas", v: "R$ 12.480", d: "↑ 18% vs ontem", ico: <path d="M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /> },
                      { l: "Total de Transações", v: "47", d: "↑ 9 hoje", ico: <><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></> },
                      { l: "Ticket Médio", v: "R$ 265", d: "+ R$ 32", ico: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></> },
                      { l: "Vendas por Pix", v: "R$ 8.140", d: "65% do total", ico: <path d="M3 7h18v10H3zM3 11h18M7 15h2" /> },
                      { l: "Vendas por Cartão", v: "R$ 3.620", d: "29% do total", ico: <><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></> },
                      { l: "Vendas por Boleto", v: "R$ 720", d: "6% do total", ico: <path d="M3 5h18v14H3z M7 5v14M11 5v14M15 5v14M19 5v14" /> },
                    ].map((m, i) => (
                      <div key={i} className={s.dashCard}>
                        <div className="ico"><svg viewBox="0 0 24 24">{m.ico}</svg></div>
                        <div className="label">{m.l}</div>
                        <div className="value">{m.v}</div>
                        <div className="delta">{m.d}</div>
                      </div>
                    ))}
                  </div>

                  <div className={s.dashGrid}>
                    <div className={s.dashBlock}>
                      <h4>Transações por dia</h4>
                      <div className="sub">Últimos 14 dias</div>
                      <div className={s.dashChart}>
                        <svg viewBox="0 0 600 200" preserveAspectRatio="none">
                          <g stroke="rgba(255,255,255,0.04)" strokeWidth="1">
                            <line x1="0" y1="40" x2="600" y2="40" />
                            <line x1="0" y1="90" x2="600" y2="90" />
                            <line x1="0" y1="140" x2="600" y2="140" />
                          </g>
                          <polyline fill="none" stroke="#c9a227" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                            points="0,150 45,140 90,120 135,135 180,100 225,115 270,85 315,90 360,60 405,75 450,50 495,65 540,40 600,55" />
                          <g fill="#c9a227">
                            <circle cx="540" cy="40" r="3" />
                            <circle cx="600" cy="55" r="3" />
                          </g>
                        </svg>
                      </div>
                    </div>
                    <div className={s.dashBlock}>
                      <h4>Produtos mais vendidos</h4>
                      <div className="sub">Top 3 desta semana</div>
                      {[
                        { r: 1, n: "Programa PATRON", p: "R$ 997" },
                        { r: 2, n: "Curso Identidade Restaurada", p: "R$ 199" },
                        { r: 3, n: "Imersão Presencial SP", p: "R$ 1.990" },
                      ].map((p) => (
                        <div key={p.r} className={s.productRow}>
                          <div className={s.rank}>{p.r}</div>
                          <div className="name">{p.n}</div>
                          <div className="price">{p.p}</div>
                        </div>
                      ))}
                      <div className={s.convGrid}>
                        {[
                          { v: "100%", l: "PIX", d: 100 },
                          { v: "100%", l: "Boleto", d: 100 },
                          { v: "0%", l: "Chargebacks", d: 0 },
                        ].map((c, i) => (
                          <div key={i} className={s.convCard}>
                            <svg className="ring" viewBox="0 0 36 36">
                              <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#c9a227" strokeWidth="3"
                                strokeDasharray={`${c.d}, 100`} strokeLinecap="round" transform="rotate(-90 18 18)" />
                            </svg>
                            <div className="value">{c.v}</div>
                            <div className="label">{c.l}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className={s.dashBlock} style={{ marginTop: 14 }}>
                    <h4>Atividade Recente</h4>
                    <div className="sub">Últimas movimentações da sua operação</div>
                    <div className={s.activityList}>
                      {[
                        { ico: <path d="M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />, t: <>Nova venda: <strong>Programa PATRON</strong> — Maria F. pagou via PIX</>, time: "22:48" },
                        { ico: <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M18 2H6v7a6 6 0 0 0 12 0V2Z" />, t: <>Conquista desbloqueada: <strong>Lucas R.</strong> completou módulo 3</>, time: "21:30" },
                        { ico: <path d="M12 9v4M12 17h.01M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />, t: <>Alerta IA: <strong>3 alunos</strong> com risco de abandono detectado</>, time: "19:12" },
                      ].map((a, i) => (
                        <div key={i} className={s.activityItem}>
                          <div className="ico"><svg viewBox="0 0 24 24">{a.ico}</svg></div>
                          <div className="text">{a.t}</div>
                          <div className="time">{a.time}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === "ia" && (
              <div className={s.tabPane}>
                <div className={s.tabPaneHead}>
                  <h3>Alertas de IA · ranqueados por risco</h3>
                  <span className={s.dashLive}><span className={s.pulseDot} />MONITORANDO 1.247 ALUNOS</span>
                </div>
                <div className={s.aiList}>
                  {[
                    { name: "João Oliveira", days: 8, risk: 92, level: "Alto", color: "#e53e3e", action: "Enviar mensagem de reativação" },
                    { name: "Ana Silva", days: 5, risk: 71, level: "Médio", color: "#c9a227", action: "Sugerir próximo módulo" },
                    { name: "Pedro Henrique", days: 3, risk: 48, level: "Baixo", color: "#22c55e", action: "Acompanhar" },
                    { name: "Carla Mendes", days: 12, risk: 95, level: "Alto", color: "#e53e3e", action: "Ligação prioritária" },
                    { name: "Rafael Costa", days: 6, risk: 64, level: "Médio", color: "#c9a227", action: "Email com checkpoint" },
                  ].map((a, i) => (
                    <div key={i} className={s.aiRow}>
                      <div className={s.avatar} style={{ width: 38, height: 38, fontSize: 13 }}>
                        {a.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className={s.aiInfo}>
                        <strong>{a.name}</strong>
                        <span>Sem acesso há {a.days} dias · Ação: {a.action}</span>
                      </div>
                      <div className={s.aiScore}>
                        <div className={s.aiScoreBar}>
                          <div style={{ width: `${a.risk}%`, background: a.color }} />
                        </div>
                        <span>{a.risk}%</span>
                      </div>
                      <span className={s.aiBadge} style={{ color: a.color, borderColor: `${a.color}55`, background: `${a.color}14` }}>
                        {a.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "gami" && (
              <div className={s.tabPane}>
                <div className={s.tabPaneHead}>
                  <h3>Ranking & conquistas da sua mentoria</h3>
                  <span className={s.dashLive}><span className={s.pulseDot} />ATUALIZADO AGORA</span>
                </div>
                <div className={s.gamiGrid}>
                  <div className={s.dashBlock}>
                    <h4>Top alunos da semana</h4>
                    <div className="sub">Pontuação por módulos concluídos + engajamento</div>
                    {[
                      { r: 1, n: "Mariana Lopes", p: "2.480 pts" },
                      { r: 2, n: "Carlos Eduardo", p: "2.310 pts" },
                      { r: 3, n: "Beatriz Souza", p: "2.105 pts" },
                      { r: 4, n: "Felipe Andrade", p: "1.980 pts" },
                      { r: 5, n: "Larissa Pinto", p: "1.840 pts" },
                    ].map((p) => (
                      <div key={p.r} className={s.productRow}>
                        <div className={s.rank}>{p.r}</div>
                        <div className="name">{p.n}</div>
                        <div className="price">{p.p}</div>
                      </div>
                    ))}
                  </div>
                  <div className={s.dashBlock}>
                    <h4>Badges desbloqueadas hoje</h4>
                    <div className="sub">12 conquistas nas últimas 24h</div>
                    <div className={s.badgeGrid}>
                      {["Início", "Módulo 1", "Módulo 2", "Módulo 3", "Maratona", "Top 10"].map((b, i) => (
                        <div key={i} className={s.badgeItem}>
                          <div className={s.badgeIco}>
                            <svg viewBox="0 0 24 24"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>
                          </div>
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === "fin" && (
              <div className={s.tabPane}>
                <div className={s.tabPaneHead}>
                  <h3>Saldo & repasses</h3>
                  <button className={`${s.btn} ${s.btnPrimary}`}>Sacar agora <ArrowRight size={14} /></button>
                </div>
                <div className={s.finGrid}>
                  <div className={s.finBig}>
                    <span className="lbl">Saldo disponível</span>
                    <span className="val">R$ 38.420,90</span>
                    <span className="sub">Próximo repasse: hoje, 18h</span>
                  </div>
                  <div className={s.finBig} style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <span className="lbl">Saldo pendente</span>
                    <span className="val" style={{ color: "var(--text)" }}>R$ 12.180,00</span>
                    <span className="sub">Liberação em D+30 (cartão)</span>
                  </div>
                </div>
                <div className={s.dashBlock} style={{ marginTop: 14 }}>
                  <h4>Histórico de transações</h4>
                  <div className="sub">Últimas 5 movimentações</div>
                  <div className={s.activityList}>
                    {[
                      { t: <>Repasse PIX · <strong>R$ 8.140</strong> liberado</>, time: "Hoje · 14:02" },
                      { t: <>Venda · <strong>Programa PATRON</strong> · R$ 997 · cartão 12x</>, time: "Hoje · 13:48" },
                      { t: <>Saque · <strong>R$ 15.000</strong> para conta Itaú ****9821</>, time: "Ontem · 18:00" },
                      { t: <>Estorno · <strong>R$ 199</strong> · Curso Identidade</>, time: "Ontem · 11:21" },
                      { t: <>Repasse cartão · <strong>R$ 22.310</strong> liberado</>, time: "16/Abr · 18:00" },
                    ].map((a, i) => (
                      <div key={i} className={s.activityItem}>
                        <div className="ico">
                          <svg viewBox="0 0 24 24"><path d="M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                        </div>
                        <div className="text">{a.t}</div>
                        <div className="time">{a.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* AI */}
      <section id="ia" className={`${s.section} ${s.aiSection}`}>
        <div className={s.container}>
          <div className={s.aiCols}>
            <div>
              <span className={s.sectionTag}>Inteligência Artificial</span>
              <h2 className={s.aiH2}>Inteligência que protege sua receita</h2>
              <p className={s.aiLead}>
                Nossa IA monitora o comportamento de cada aluno e emite alertas antes que o abandono vire reembolso.
                Recomendações automáticas, scoring de risco e ações sugeridas — tudo no mesmo painel.
              </p>
              <div className={s.statsGrid}>
                {[
                  { n: "↓68%", l: "reembolsos" },
                  { n: "+3.2x", l: "retenção" },
                  { n: "2.400", l: "mentores" },
                  { n: "98%", l: "satisfação" },
                ].map((st, i) => (
                  <div key={i} className={s.stat}>
                    <div className="num">{st.n}</div>
                    <div className="lbl">{st.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className={s.alertsCol}>
              {[
                { color: "#e53e3e", level: "Risco alto", t: <><strong>Alerta de IA:</strong> João Oliveira sem acesso há 8 dias</>, time: "22:18" },
                { color: "#c9a227", level: "Risco médio", t: <><strong>Atenção:</strong> Ana Silva com progresso estagnado há 5 dias</>, time: "21:45" },
                { color: "#22c55e", level: "Recuperado", t: <><strong>Recomendação enviada:</strong> Pedro Henrique voltou a estudar</>, time: "20:12" },
              ].map((a, i) => (
                <div key={i} className={s.alertCard} style={{ borderLeftColor: a.color }}>
                  <div className={s.alertHead}>
                    <span style={{ color: a.color, background: `${a.color}14`, borderColor: `${a.color}40` }} className={s.alertBadge}>
                      {a.level}
                    </span>
                    <span className={s.alertTime}>{a.time}</span>
                  </div>
                  <div className={s.alertText}>{a.t}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className={s.section}>
        <div className={s.container}>
          <div className={s.sectionHead}>
            <span className={s.sectionTag}>Social proof</span>
            <h2>Mentores que já transformaram sua operação com a Implofy</h2>
            <p>Resultados reais de quem trocou planilhas, plataformas fragmentadas e contas confusas por um único painel.</p>
          </div>
          <div className={s.proofGrid}>
            {[
              { i: "MC", n: "Marcos Costa", nicho: "Marketing Digital", q: "Reduzi reembolsos em 71% no primeiro trimestre. A IA salva minha operação toda semana." },
              { i: "JS", n: "João Silva", nicho: "Copywriting", q: "Saí de 8 plataformas para 1. Meu time finalmente vê o mesmo número que eu." },
              { i: "AF", n: "Amanda Ferreira", nicho: "Mentoria Feminina", q: "A gamificação multiplicou por 3 a conclusão dos módulos. Aluno engajado não pede reembolso." },
              { i: "RL", n: "Rafael Lima", nicho: "Trader & Investimentos", q: "Em 6 meses fechei R$ 2.4M com mais clareza do que tive em 4 anos somando tudo antes." },
            ].map((p, i) => (
              <article key={i} className={s.proofCard}>
                <div className={s.proofHead}>
                  <div className={s.avatar}>{p.i}</div>
                  <div>
                    <strong>{p.n}</strong>
                    <span>{p.nicho}</span>
                  </div>
                </div>
                <p className={s.proofQuote}><span className={s.quoteMark}>“</span>{p.q}<span className={s.quoteMark}>”</span></p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* STUDENTS */}
      <section id="alunos" className={`${s.section} ${s.students}`}>
        <div className={s.container}>
          <div className={s.studentsIcon}>
            <svg viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" /></svg>
          </div>
          <span className={s.sectionTag}>Já é aluno?</span>
          <h2>Acesse sua área de membros e continue seus estudos</h2>
          <p>Entre na plataforma e retome de onde parou — suas conquistas estão te esperando.</p>
          <button className={`${s.btn} ${s.btnPrimary} ${s.btnLg}`} onClick={() => setAuthMode("login")}>
            Entrar na plataforma <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className={s.section}>
        <div className={s.container}>
          <div className={s.sectionHead}>
            <span className={s.sectionTag}>FAQ</span>
            <h2>Perguntas frequentes sobre a Implofy</h2>
            <p>Tudo que você precisa saber antes de começar — e o que mentores costumam perguntar no primeiro contato.</p>
          </div>
          <div className={s.faqWrap}>
            {faqs.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={i} className={`${s.faqItem} ${open ? s.faqItemOpen : ""}`}>
                  <button className={s.faqQ} onClick={() => setOpenFaq(open ? null : i)}>
                    <span>{f.q}</span>
                    {open ? <Minus size={18} color="#c9a227" /> : <Plus size={18} color="#c9a227" />}
                  </button>
                  <div className={s.faqA} style={{ maxHeight: open ? 240 : 0 }}>
                    <p>{f.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={s.footer}>
        <div className={s.container}>
          <div className={s.footerGrid}>
            <div className={s.footerBrand}>
              <a href="#" className={s.logo}>
                <LogoMark />
                <div className={s.logoText}>
                  <strong>Implofy</strong>
                  <span>Painel de Performance</span>
                </div>
              </a>
              <p>A plataforma onde mentores de elite gerenciam vendas, alunos e crescimento — tudo em um só painel.</p>
            </div>
            <div className={s.footerCol}>
              <h4>Produto</h4>
              <ul>
                <li><a href="#beneficios">Recursos</a></li>
                <li><a href="#preview">Dashboard</a></li>
                <li><a href="#ia">IA</a></li>
                <li><a href="#faq">Preços</a></li>
              </ul>
            </div>
            <div className={s.footerCol}>
              <h4>Empresa</h4>
              <ul>
                <li><a href="#">Sobre</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Contato</a></li>
                <li><a href="#">Carreiras</a></li>
              </ul>
            </div>
            <div className={s.footerCol}>
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Termos</a></li>
                <li><a href="#">Privacidade</a></li>
                <li><a href="#">Cookies</a></li>
              </ul>
            </div>
            <div className={s.footerCol}>
              <h4>Educação</h4>
              <ul>
                <li><a href="#">Academia Implofy</a></li>
                <li><a href="#">Webinars</a></li>
                <li><a href="#">Comunidade</a></li>
              </ul>
            </div>
          </div>
          <div className={s.footerBottom}>
            <span>© 2026 Implofy. Todos os direitos reservados.</span>
            <span>Feito com precisão para mentores que vendem.</span>
          </div>
        </div>
      </footer>

      <AuthModals mode={authMode} onModeChange={setAuthMode} />
    </div>
  );
};

export default Landing;
