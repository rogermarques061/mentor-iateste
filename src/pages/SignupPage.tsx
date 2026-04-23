import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowRight, ArrowLeft, Check, BarChart3, GraduationCap,
  Eye, EyeOff, Shield, Zap, Users, TrendingUp, Star, Lock
} from "lucide-react";

// ── helpers ──────────────────────────────────────────────────
const inputCls =
  "w-full px-4 py-3 text-[15px] bg-[#111] border border-white/10 text-[#f5f5f5] rounded-xl focus:outline-none focus:border-[#c9a227] focus:shadow-[0_0_0_3px_rgba(201,162,39,0.12)] placeholder:text-[#444] transition-all";
const labelCls = "text-[12.5px] font-semibold text-[#888] block mb-1.5 uppercase tracking-wider";

function pwScore(v: string) {
  let s = 0;
  if (v.length >= 8) s++;
  if (/[A-Z]/.test(v)) s++;
  if (/[0-9]/.test(v)) s++;
  if (/[^A-Za-z0-9]/.test(v)) s++;
  return s;
}
const strengthMap = [
  { w: "0%", c: "#333", t: "" },
  { w: "25%", c: "#e53e3e", t: "Fraca" },
  { w: "55%", c: "#f59e0b", t: "Média" },
  { w: "80%", c: "#f59e0b", t: "Boa" },
  { w: "100%", c: "#22c55e", t: "Forte" },
];

const niches = [
  "Marketing Digital", "Vendas", "Copywriting", "Finanças e Investimentos",
  "Saúde e Bem-estar", "Desenvolvimento Pessoal", "Empreendedorismo",
  "Tecnologia / TI", "Educação", "Espiritualidade", "Outro",
];

const revenueRanges = [
  "Ainda não vendo", "Até R$ 5.000/mês", "R$ 5k – R$ 20k/mês",
  "R$ 20k – R$ 100k/mês", "Acima de R$ 100k/mês",
];

// ── side panel content ────────────────────────────────────────
const BENEFITS = [
  { Icon: Zap, title: "Setup em 5 minutos", desc: "Sem cartão. Acesso imediato a todos os recursos." },
  { Icon: TrendingUp, title: "Dashboard em tempo real", desc: "Vendas, alunos e métricas — tudo no mesmo painel." },
  { Icon: Shield, title: "IA anti-abandono", desc: "Reduza reembolsos em até 68% com alertas automáticos." },
  { Icon: Star, title: "Gamificação nativa", desc: "Badges e ranking que triplicam o engajamento dos alunos." },
  { Icon: Users, title: "2.400 mentores ativos", desc: "Comunidade dos maiores infoprodutores do Brasil." },
];

const STEPS = ["Perfil", "Dados", "Senha", "Negócio"];

// ── component ─────────────────────────────────────────────────
const SignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // fields
  const [role, setRole] = useState<"mentor" | "aluno">("mentor");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [platformName, setPlatformName] = useState("");
  const [niche, setNiche] = useState("");
  const [revenue, setRevenue] = useState("");

  const score = pwScore(pass);
  const sObj = strengthMap[score];
  const stepsToShow = role === "mentor" ? STEPS : STEPS.slice(0, 3);
  const totalSteps = stepsToShow.length;
  const pct = ((step + 1) / totalSteps) * 100;

  const maskPhone = (v: string) => {
    const n = v.replace(/\D/g, "").slice(0, 11);
    if (n.length <= 2) return n;
    if (n.length <= 7) return `(${n.slice(0, 2)}) ${n.slice(2)}`;
    return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
  };

  const validateStep = () => {
    if (step === 1) {
      if (name.trim().length < 3) { setError("Digite seu nome completo."); return false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Email inválido."); return false; }
      if (phone.replace(/\D/g, "").length < 10) { setError("Telefone inválido."); return false; }
    }
    if (step === 2) {
      if (pass.length < 8) { setError("A senha precisa ter no mínimo 8 caracteres."); return false; }
      if (pass !== confirm) { setError("As senhas não coincidem."); return false; }
    }
    if (step === 3) {
      if (!niche) { setError("Selecione seu nicho."); return false; }
      if (!revenue) { setError("Selecione seu faturamento atual."); return false; }
    }
    setError(null);
    return true;
  };

  const next = () => {
    if (!validateStep()) return;
    if (step < totalSteps - 1) { setStep(s => s + 1); }
    else { handleSubmit(); }
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      try { localStorage.setItem("implofy:user-role", role); } catch {}
      navigate(role === "mentor" ? "/mentor" : "/aluno");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">

      {/* ── LEFT: FORM ── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-24">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 mb-10 w-fit group">
          <div className="w-9 h-9 rounded-lg bg-[#c9a227] flex items-center justify-center">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#1a1300" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 17 L10 11 L14 15 L20 7" /><circle cx="20" cy="7" r="1.5" fill="#1a1300" />
            </svg>
          </div>
          <span className="text-[#f5f5f5] font-bold text-[17px]">Implofy</span>
        </Link>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex gap-2">
              {stepsToShow.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                    i < step ? "bg-[#c9a227] text-[#1a1300]" : i === step ? "bg-[#c9a227]/20 text-[#c9a227] border border-[#c9a227]" : "bg-white/5 text-[#555]"
                  }`}>
                    {i < step ? <Check size={11} /> : i + 1}
                  </div>
                  <span className={`text-[12px] font-medium hidden sm:block ${i === step ? "text-[#c9a227]" : i < step ? "text-[#888]" : "text-[#444]"}`}>{s}</span>
                  {i < stepsToShow.length - 1 && <div className={`w-6 h-px ${i < step ? "bg-[#c9a227]" : "bg-white/10"}`} />}
                </div>
              ))}
            </div>
            <span className="text-[12px] text-[#555]">{step + 1}/{totalSteps}</span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-[#c9a227] rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* ── STEP 0: Role ── */}
        {step === 0 && (
          <div>
            <h1 className="text-[28px] sm:text-[34px] font-bold text-[#f5f5f5] tracking-tight mb-1">Crie sua conta grátis</h1>
            <p className="text-[#666] text-[15px] mb-8">14 dias de teste. Sem cartão de crédito.</p>
            <p className="text-[13px] font-semibold text-[#888] uppercase tracking-wider mb-4">Você é…</p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {([
                { r: "mentor" as const, label: "Sou Mentor", sub: "Vendo cursos e mentorias", Icon: BarChart3 },
                { r: "aluno" as const, label: "Sou Aluno", sub: "Quero aprender e crescer", Icon: GraduationCap },
              ]).map(({ r, label, sub, Icon }) => {
                const sel = role === r;
                return (
                  <button key={r} onClick={() => setRole(r)}
                    className="p-5 rounded-2xl text-left transition-all border"
                    style={{
                      background: sel ? "rgba(201,162,39,0.10)" : "#111",
                      borderColor: sel ? "#c9a227" : "rgba(255,255,255,0.07)",
                    }}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${sel ? "bg-[#c9a227]/20" : "bg-white/5"}`}>
                      <Icon size={20} color={sel ? "#c9a227" : "#666"} strokeWidth={1.7} />
                    </div>
                    <strong className="block text-[#f5f5f5] text-[15px] font-semibold">{label}</strong>
                    <span className="text-[13px] text-[#666]">{sub}</span>
                    {sel && (
                      <div className="mt-3 flex items-center gap-1.5 text-[#c9a227] text-[12px] font-medium">
                        <Check size={12} /> Selecionado
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── STEP 1: Dados pessoais ── */}
        {step === 1 && (
          <div>
            <h1 className="text-[28px] sm:text-[32px] font-bold text-[#f5f5f5] tracking-tight mb-1">Seus dados</h1>
            <p className="text-[#666] text-[15px] mb-8">Informações básicas para criar sua conta.</p>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Nome completo</label>
                <input className={inputCls} type="text" placeholder="Seu nome completo"
                  value={name} onChange={e => setName(e.target.value)} autoFocus />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input className={inputCls} type="email" placeholder="seu@email.com"
                  value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>WhatsApp</label>
                <input className={inputCls} type="tel" placeholder="(00) 00000-0000"
                  value={phone} onChange={e => setPhone(maskPhone(e.target.value))} />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: Senha ── */}
        {step === 2 && (
          <div>
            <h1 className="text-[28px] sm:text-[32px] font-bold text-[#f5f5f5] tracking-tight mb-1">Crie uma senha</h1>
            <p className="text-[#666] text-[15px] mb-8">Mínimo de 8 caracteres com letras e números.</p>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Senha</label>
                <div className="relative">
                  <input className={inputCls} type={showPass ? "text" : "password"}
                    placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} autoFocus />
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#888]">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {pass && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden flex gap-0.5">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex-1 rounded-full transition-all"
                          style={{ background: i <= score ? sObj.c : "transparent" }} />
                      ))}
                    </div>
                    {sObj.t && <span className="text-[12px] font-medium" style={{ color: sObj.c }}>{sObj.t}</span>}
                  </div>
                )}
              </div>
              <div>
                <label className={labelCls}>Confirmar senha</label>
                <div className="relative">
                  <input className={inputCls} type={showConfirm ? "text" : "password"}
                    placeholder="••••••••" value={confirm} onChange={e => setConfirm(e.target.value)} />
                  <button type="button" onClick={() => setShowConfirm(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#888]">
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {confirm && pass !== confirm && (
                  <p className="text-[12px] text-[#e53e3e] mt-1.5">As senhas não coincidem.</p>
                )}
                {confirm && pass === confirm && confirm.length > 0 && (
                  <p className="text-[12px] text-[#22c55e] mt-1.5 flex items-center gap-1"><Check size={11} /> Senhas conferem.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Negócio (mentor only) ── */}
        {step === 3 && (
          <div>
            <h1 className="text-[28px] sm:text-[32px] font-bold text-[#f5f5f5] tracking-tight mb-1">Sobre sua mentoria</h1>
            <p className="text-[#666] text-[15px] mb-8">Ajuda a personalizar sua experiência desde o início.</p>
            <div className="space-y-5">
              <div>
                <label className={labelCls}>Nome da sua plataforma / marca</label>
                <input className={inputCls} type="text" placeholder="Ex: Escola do Mentor, Programa PATRON..."
                  value={platformName} onChange={e => setPlatformName(e.target.value)} autoFocus />
              </div>
              <div>
                <label className={labelCls}>Seu nicho</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {niches.map(n => (
                    <button key={n} onClick={() => setNiche(n)}
                      className="px-3 py-2.5 rounded-xl text-[13px] font-medium text-left transition-all border"
                      style={{
                        background: niche === n ? "rgba(201,162,39,0.12)" : "#111",
                        borderColor: niche === n ? "#c9a227" : "rgba(255,255,255,0.07)",
                        color: niche === n ? "#c9a227" : "#888",
                      }}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelCls}>Faturamento mensal atual</label>
                <div className="space-y-2">
                  {revenueRanges.map(r => (
                    <button key={r} onClick={() => setRevenue(r)}
                      className="w-full px-4 py-3 rounded-xl text-[14px] font-medium text-left flex items-center justify-between transition-all border"
                      style={{
                        background: revenue === r ? "rgba(201,162,39,0.12)" : "#111",
                        borderColor: revenue === r ? "#c9a227" : "rgba(255,255,255,0.07)",
                        color: revenue === r ? "#c9a227" : "#888",
                      }}>
                      {r}
                      {revenue === r && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 rounded-xl text-[13px] border"
            style={{ background: "rgba(229,62,62,0.08)", borderColor: "rgba(229,62,62,0.25)", color: "#e53e3e" }}>
            ✗ {error}
          </div>
        )}

        {/* Navigation */}
        <div className={`flex gap-3 mt-8 ${step > 0 ? "flex-row" : ""}`}>
          {step > 0 && (
            <button onClick={() => { setStep(s => s - 1); setError(null); }}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl border border-white/10 text-[#888] hover:text-[#f5f5f5] hover:border-white/20 text-[14px] font-semibold transition-all">
              <ArrowLeft size={15} /> Voltar
            </button>
          )}
          <button onClick={next} disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#c9a227] hover:bg-[#e6b830] text-[#1a1300] font-bold text-[15px] transition-all disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]">
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#1a1300]/30 border-t-[#1a1300] rounded-full animate-spin" />
                Criando sua conta...
              </>
            ) : step === totalSteps - 1 ? (
              <>Criar minha conta <Check size={15} /></>
            ) : (
              <>Continuar <ArrowRight size={15} /></>
            )}
          </button>
        </div>

        {/* Security note */}
        <p className="text-[12px] text-[#444] flex items-center gap-1.5 mt-5">
          <Lock size={11} /> Seus dados são protegidos com criptografia SSL. Sem spam.
        </p>

        {/* Already have account */}
        <p className="text-[13.5px] text-[#555] mt-4 text-center">
          Já tem conta?{" "}
          <Link to="/" className="text-[#c9a227] font-semibold hover:underline">Entrar</Link>
        </p>
      </div>

      {/* ── RIGHT: BENEFITS PANEL ── */}
      <div className="hidden lg:flex flex-col justify-center w-[420px] xl:w-[480px] shrink-0 bg-[#0d0d0d] border-l border-white/5 px-12 py-16">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/20 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#c9a227] animate-pulse" />
            <span className="text-[12px] font-semibold text-[#c9a227]">2.400 mentores ativos</span>
          </div>
          <h2 className="text-[26px] font-bold text-[#f5f5f5] leading-snug mb-2">
            Tudo que você precisa para escalar sua mentoria
          </h2>
          <p className="text-[14px] text-[#555]">Sem planilhas, sem ferramentas fragmentadas.</p>
        </div>

        <div className="space-y-5 mb-10">
          {BENEFITS.map(({ Icon, title, desc }, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-lg bg-[#c9a227]/10 flex items-center justify-center shrink-0 mt-0.5">
                <Icon size={17} color="#c9a227" strokeWidth={1.8} />
              </div>
              <div>
                <div className="text-[14px] font-semibold text-[#f5f5f5]">{title}</div>
                <div className="text-[13px] text-[#555]">{desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div className="border border-white/6 rounded-2xl p-5 bg-[#111]">
          <div className="flex items-center gap-1 mb-3">
            {[1,2,3,4,5].map(i => <Star key={i} size={13} fill="#c9a227" color="#c9a227" />)}
          </div>
          <p className="text-[13.5px] text-[#aaa] leading-relaxed mb-4">
            "Reduzi reembolsos em 71% no primeiro trimestre. A IA identifica quem está em risco antes do abandono acontecer."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#c9a227]/20 flex items-center justify-center text-[12px] font-bold text-[#c9a227]">MC</div>
            <div>
              <div className="text-[13px] font-semibold text-[#f5f5f5]">Marcos Costa</div>
              <div className="text-[12px] text-[#555]">Marketing Digital · R$ 2.4M/ano</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { n: "↓68%", l: "Reembolsos" },
            { n: "+3.2x", l: "Retenção" },
            { n: "98%", l: "Satisfação" },
          ].map((s, i) => (
            <div key={i} className="text-center p-3 rounded-xl bg-[#111] border border-white/5">
              <div className="text-[18px] font-bold text-[#c9a227]">{s.n}</div>
              <div className="text-[11px] text-[#555]">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
