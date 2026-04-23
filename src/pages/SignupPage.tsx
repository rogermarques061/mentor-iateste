import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowRight, ArrowLeft, Check, BarChart3, GraduationCap,
  Eye, EyeOff, Shield, Zap, Users, TrendingUp, Star, Lock,
  Building2, User
} from "lucide-react";

// ── masks ─────────────────────────────────────────────────────
function maskPhone(v: string) {
  const n = v.replace(/\D/g, "").slice(0, 11);
  if (n.length <= 2) return n;
  if (n.length <= 7) return `(${n.slice(0, 2)}) ${n.slice(2)}`;
  return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
}
function maskCPF(v: string) {
  const n = v.replace(/\D/g, "").slice(0, 11);
  if (n.length <= 3) return n;
  if (n.length <= 6) return `${n.slice(0, 3)}.${n.slice(3)}`;
  if (n.length <= 9) return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6)}`;
  return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6, 9)}-${n.slice(9)}`;
}
function maskCNPJ(v: string) {
  const n = v.replace(/\D/g, "").slice(0, 14);
  if (n.length <= 2) return n;
  if (n.length <= 5) return `${n.slice(0, 2)}.${n.slice(2)}`;
  if (n.length <= 8) return `${n.slice(0, 2)}.${n.slice(2, 5)}.${n.slice(5)}`;
  if (n.length <= 12) return `${n.slice(0, 2)}.${n.slice(2, 5)}.${n.slice(5, 8)}/${n.slice(8)}`;
  return `${n.slice(0, 2)}.${n.slice(2, 5)}.${n.slice(5, 8)}/${n.slice(8, 12)}-${n.slice(12)}`;
}

// ── pw strength ───────────────────────────────────────────────
function pwScore(v: string) {
  let s = 0;
  if (v.length >= 8) s++;
  if (/[A-Z]/.test(v)) s++;
  if (/[0-9]/.test(v)) s++;
  if (/[^A-Za-z0-9]/.test(v)) s++;
  return s;
}
const strengthMap = [
  { c: "#3f3f46", t: "" },
  { c: "#ef4444", t: "Fraca" },
  { c: "#f59e0b", t: "Média" },
  { c: "#f59e0b", t: "Boa" },
  { c: "#22c55e", t: "Forte" },
];

// ── data ──────────────────────────────────────────────────────
const niches = [
  "Marketing Digital", "Vendas", "Copywriting",
  "Finanças e Investimentos", "Saúde e Bem-estar",
  "Desenvolvimento Pessoal", "Empreendedorismo",
  "Tecnologia / TI", "Educação", "Espiritualidade", "Outro",
];

const revenueRanges = [
  { label: "Ainda não vendo", sub: "Estou começando agora" },
  { label: "Até R$ 5.000/mês", sub: "Fase inicial" },
  { label: "R$ 5k – R$ 20k/mês", sub: "Crescimento acelerado" },
  { label: "R$ 20k – R$ 100k/mês", sub: "Operação consolidada" },
  { label: "Acima de R$ 100k/mês", sub: "Alta performance" },
];

const BENEFITS = [
  { Icon: Zap, title: "Setup em 5 minutos", desc: "Sem cartão. Acesso imediato." },
  { Icon: TrendingUp, title: "Dashboard em tempo real", desc: "Vendas, alunos e métricas unificadas." },
  { Icon: Shield, title: "IA anti-abandono", desc: "Reduza reembolsos em até 68%." },
  { Icon: Star, title: "Gamificação nativa", desc: "Badges e ranking integrados." },
  { Icon: Users, title: "2.400 mentores ativos", desc: "Comunidade dos maiores do Brasil." },
];

const STEPS = ["Perfil", "Dados", "Segurança", "Negócio"];

// ── field styles ──────────────────────────────────────────────
const field =
  "w-full px-4 py-3 text-[14.5px] bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-lg " +
  "focus:outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#c9a227]/10 " +
  "placeholder:text-zinc-600 transition-all duration-150";

const label = "block text-[13px] font-medium text-zinc-400 mb-1.5";

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
  const [docType, setDocType] = useState<"cpf" | "cnpj">("cpf");
  const [cpf, setCpf] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [razaoSocial, setRazaoSocial] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [platformName, setPlatformName] = useState("");
  const [niche, setNiche] = useState("");
  const [revenue, setRevenue] = useState("");
  const [revenueExact, setRevenueExact] = useState("");

  const score = pwScore(pass);
  const sObj = strengthMap[score];
  const stepsToShow = role === "mentor" ? STEPS : STEPS.slice(0, 3);
  const totalSteps = stepsToShow.length;

  const validate = () => {
    if (step === 1) {
      if (name.trim().length < 3) return setError("Digite seu nome completo."), false;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Email inválido."), false;
      if (phone.replace(/\D/g, "").length < 10) return setError("WhatsApp inválido."), false;
      if (docType === "cpf" && cpf.replace(/\D/g, "").length !== 11)
        return setError("CPF inválido — insira os 11 dígitos."), false;
      if (docType === "cnpj") {
        if (cnpj.replace(/\D/g, "").length !== 14) return setError("CNPJ inválido — insira os 14 dígitos."), false;
        if (razaoSocial.trim().length < 3) return setError("Informe a Razão Social da empresa."), false;
      }
    }
    if (step === 2) {
      if (pass.length < 8) return setError("Senha deve ter no mínimo 8 caracteres."), false;
      if (pass !== confirm) return setError("As senhas não coincidem."), false;
    }
    if (step === 3) {
      if (!niche) return setError("Selecione seu nicho de atuação."), false;
      if (!revenue) return setError("Selecione sua faixa de faturamento."), false;
    }
    setError(null);
    return true;
  };

  const next = () => {
    if (!validate()) return;
    if (step < totalSteps - 1) setStep(s => s + 1);
    else {
      setLoading(true);
      setTimeout(() => {
        try { localStorage.setItem("implofy:user-role", role); } catch {}
        navigate(role === "mentor" ? "/mentor" : "/aluno");
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex font-sans">

      {/* ── LEFT FORM ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-16 xl:px-24 max-w-[560px] mx-auto w-full">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 mb-12 w-fit">
            <div className="w-8 h-8 rounded-md bg-[#c9a227] flex items-center justify-center">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#1a1300" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 17 L10 11 L14 15 L20 7" /><circle cx="20" cy="7" r="1.5" fill="#1a1300" />
              </svg>
            </div>
            <span className="text-zinc-100 font-semibold text-[16px] tracking-tight">Implofy</span>
          </Link>

          {/* Step indicator */}
          <div className="flex items-center gap-0 mb-10">
            {stepsToShow.map((s, i) => (
              <div key={i} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-200 ${
                    i < step
                      ? "bg-[#c9a227] text-[#1a1300]"
                      : i === step
                      ? "bg-zinc-800 text-[#c9a227] ring-1 ring-[#c9a227]"
                      : "bg-zinc-900 text-zinc-600 ring-1 ring-zinc-800"
                  }`}>
                    {i < step ? <Check size={12} strokeWidth={3} /> : i + 1}
                  </div>
                  <span className={`text-[12px] font-medium hidden sm:block ${
                    i === step ? "text-zinc-200" : i < step ? "text-zinc-500" : "text-zinc-700"
                  }`}>{s}</span>
                </div>
                {i < stepsToShow.length - 1 && (
                  <div className={`w-8 h-px mx-2 transition-all duration-300 ${i < step ? "bg-[#c9a227]/50" : "bg-zinc-800"}`} />
                )}
              </div>
            ))}
          </div>

          {/* ── STEP 0: Tipo de conta ── */}
          {step === 0 && (
            <div>
              <h1 className="text-[30px] font-bold text-zinc-50 tracking-tight leading-tight mb-2">
                Crie sua conta grátis
              </h1>
              <p className="text-zinc-500 text-[14.5px] mb-8">14 dias sem custo. Sem cartão de crédito.</p>

              <p className="text-[12px] font-semibold text-zinc-600 uppercase tracking-widest mb-3">Como você vai usar a plataforma?</p>

              <div className="space-y-3 mb-8">
                {([
                  {
                    r: "mentor" as const,
                    label: "Sou Mentor / Produtor",
                    sub: "Crio e vendo cursos, mentorias e programas",
                    Icon: BarChart3,
                  },
                  {
                    r: "aluno" as const,
                    label: "Sou Aluno",
                    sub: "Quero acessar conteúdos e aprender",
                    Icon: GraduationCap,
                  },
                ]).map(({ r, label: lbl, sub, Icon }) => {
                  const sel = role === r;
                  return (
                    <button
                      key={r}
                      onClick={() => setRole(r)}
                      className="w-full p-4 rounded-xl text-left transition-all duration-150 border flex items-center gap-4 group"
                      style={{
                        background: sel ? "rgba(201,162,39,0.06)" : "rgba(255,255,255,0.02)",
                        borderColor: sel ? "rgba(201,162,39,0.5)" : "rgba(255,255,255,0.07)",
                      }}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all ${sel ? "bg-[#c9a227]/15" : "bg-zinc-800"}`}>
                        <Icon size={19} color={sel ? "#c9a227" : "#71717a"} strokeWidth={1.8} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-[14.5px] font-semibold leading-tight ${sel ? "text-zinc-100" : "text-zinc-400"}`}>{lbl}</div>
                        <div className="text-[12.5px] text-zinc-600 mt-0.5">{sub}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${sel ? "border-[#c9a227] bg-[#c9a227]" : "border-zinc-700"}`}>
                        {sel && <Check size={10} strokeWidth={3} color="#1a1300" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── STEP 1: Dados pessoais ── */}
          {step === 1 && (
            <div>
              <h1 className="text-[28px] font-bold text-zinc-50 tracking-tight leading-tight mb-1">Informações pessoais</h1>
              <p className="text-zinc-500 text-[14px] mb-8">Esses dados identificam sua conta.</p>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className={label}>Nome completo</label>
                    <input className={field} type="text" placeholder="Seu nome completo"
                      value={name} onChange={e => setName(e.target.value)} autoFocus />
                  </div>
                  <div>
                    <label className={label}>E-mail</label>
                    <input className={field} type="email" placeholder="seu@email.com"
                      value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                  <div>
                    <label className={label}>WhatsApp</label>
                    <input className={field} type="tel" placeholder="(00) 00000-0000"
                      value={phone} onChange={e => setPhone(maskPhone(e.target.value))} />
                  </div>
                </div>

                {/* Documento */}
                <div>
                  <label className={label}>Tipo de documento</label>
                  <div className="flex rounded-lg overflow-hidden border border-zinc-800 p-0.5 bg-zinc-900 gap-0.5">
                    {(["cpf", "cnpj"] as const).map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setDocType(t)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-[13px] font-medium transition-all duration-150"
                        style={{
                          background: docType === t ? "#1c1c1e" : "transparent",
                          color: docType === t ? "#c9a227" : "#71717a",
                          boxShadow: docType === t ? "0 1px 3px rgba(0,0,0,0.4)" : "none",
                        }}
                      >
                        {t === "cpf" ? <User size={13} /> : <Building2 size={13} />}
                        {t === "cpf" ? "Pessoa Física (CPF)" : "Pessoa Jurídica (CNPJ)"}
                      </button>
                    ))}
                  </div>
                </div>

                {docType === "cpf" && (
                  <div>
                    <label className={label}>CPF</label>
                    <input className={field} type="text" placeholder="000.000.000-00"
                      value={cpf} onChange={e => setCpf(maskCPF(e.target.value))} maxLength={14} />
                  </div>
                )}

                {docType === "cnpj" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={label}>CNPJ</label>
                      <input className={field} type="text" placeholder="00.000.000/0000-00"
                        value={cnpj} onChange={e => setCnpj(maskCNPJ(e.target.value))} maxLength={18} />
                    </div>
                    <div>
                      <label className={label}>Razão Social</label>
                      <input className={field} type="text" placeholder="Nome da empresa"
                        value={razaoSocial} onChange={e => setRazaoSocial(e.target.value)} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 2: Senha ── */}
          {step === 2 && (
            <div>
              <h1 className="text-[28px] font-bold text-zinc-50 tracking-tight leading-tight mb-1">Crie uma senha segura</h1>
              <p className="text-zinc-500 text-[14px] mb-8">Mínimo de 8 caracteres com letras e números.</p>

              <div className="space-y-4">
                <div>
                  <label className={label}>Senha</label>
                  <div className="relative">
                    <input className={field} type={showPass ? "text" : "password"}
                      placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} autoFocus />
                    <button type="button" onClick={() => setShowPass(v => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors">
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {pass && (
                    <div className="mt-2.5 flex items-center gap-3">
                      <div className="flex-1 flex gap-1">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                            style={{ background: i <= score ? sObj.c : "#27272a" }} />
                        ))}
                      </div>
                      {sObj.t && <span className="text-[11.5px] font-medium shrink-0" style={{ color: sObj.c }}>{sObj.t}</span>}
                    </div>
                  )}
                </div>

                <div>
                  <label className={label}>Confirmar senha</label>
                  <div className="relative">
                    <input className={field} type={showConfirm ? "text" : "password"}
                      placeholder="••••••••" value={confirm} onChange={e => setConfirm(e.target.value)} />
                    <button type="button" onClick={() => setShowConfirm(v => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors">
                      {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {confirm && pass === confirm && (
                    <p className="text-[12px] text-emerald-500 mt-2 flex items-center gap-1.5">
                      <Check size={11} strokeWidth={3} /> Senhas coincidem
                    </p>
                  )}
                </div>

                {/* Password hints */}
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {[
                    { ok: pass.length >= 8, t: "8+ caracteres" },
                    { ok: /[A-Z]/.test(pass), t: "Letra maiúscula" },
                    { ok: /[0-9]/.test(pass), t: "Número" },
                    { ok: /[^A-Za-z0-9]/.test(pass), t: "Caractere especial" },
                  ].map(({ ok, t }) => (
                    <div key={t} className={`flex items-center gap-1.5 text-[12px] transition-colors ${ok ? "text-emerald-500" : "text-zinc-600"}`}>
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all ${ok ? "bg-emerald-500/15" : "bg-zinc-800"}`}>
                        {ok && <Check size={8} strokeWidth={3} />}
                      </div>
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3: Negócio (mentor only) ── */}
          {step === 3 && (
            <div>
              <h1 className="text-[28px] font-bold text-zinc-50 tracking-tight leading-tight mb-1">Sobre seu negócio</h1>
              <p className="text-zinc-500 text-[14px] mb-8">Personaliza sua experiência desde o primeiro acesso.</p>

              <div className="space-y-6">
                <div>
                  <label className={label}>Nome da plataforma ou marca</label>
                  <input className={field} type="text" placeholder="Ex: Academia do Mentor, Programa PATRON..."
                    value={platformName} onChange={e => setPlatformName(e.target.value)} autoFocus />
                </div>

                <div>
                  <label className={label}>Nicho de atuação</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
                    {niches.map(n => (
                      <button key={n} type="button" onClick={() => setNiche(n)}
                        className="px-3 py-2 rounded-lg text-[12.5px] font-medium text-left transition-all duration-150 border"
                        style={{
                          background: niche === n ? "rgba(201,162,39,0.08)" : "rgba(255,255,255,0.02)",
                          borderColor: niche === n ? "rgba(201,162,39,0.5)" : "rgba(255,255,255,0.07)",
                          color: niche === n ? "#c9a227" : "#71717a",
                        }}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={label}>Faixa de faturamento mensal</label>
                  <div className="space-y-2 mt-1">
                    {revenueRanges.map(r => (
                      <button key={r.label} type="button" onClick={() => setRevenue(r.label)}
                        className="w-full px-4 py-3 rounded-lg text-left flex items-center gap-3 transition-all duration-150 border group"
                        style={{
                          background: revenue === r.label ? "rgba(201,162,39,0.06)" : "rgba(255,255,255,0.02)",
                          borderColor: revenue === r.label ? "rgba(201,162,39,0.5)" : "rgba(255,255,255,0.07)",
                        }}>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                          revenue === r.label ? "border-[#c9a227]" : "border-zinc-700"
                        }`}>
                          {revenue === r.label && <div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-[13.5px] font-semibold leading-tight ${revenue === r.label ? "text-zinc-100" : "text-zinc-400"}`}>
                            {r.label}
                          </div>
                          <div className="text-[11.5px] text-zinc-600 mt-0.5">{r.sub}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Faturamento exato */}
                <div>
                  <label className={label}>
                    Faturamento mensal aproximado
                    <span className="ml-1.5 text-zinc-700 font-normal">(opcional)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-[13.5px] font-semibold select-none pointer-events-none">R$</span>
                    <input
                      className={field + " pl-10"}
                      type="text"
                      inputMode="numeric"
                      placeholder="0,00"
                      value={revenueExact}
                      onChange={e => {
                        const digits = e.target.value.replace(/\D/g, "");
                        if (!digits) { setRevenueExact(""); return; }
                        const cents = parseInt(digits, 10);
                        setRevenueExact(
                          (cents / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        );
                      }}
                    />
                  </div>
                  <p className="text-[11.5px] text-zinc-700 mt-1.5">Usado para calibrar métricas e metas no seu dashboard.</p>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-5 flex items-start gap-3 p-3.5 rounded-lg bg-red-500/5 border border-red-500/20">
              <div className="w-4 h-4 rounded-full bg-red-500/15 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-red-400 text-[9px] font-bold">!</span>
              </div>
              <p className="text-[13px] text-red-400">{error}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button
                onClick={() => { setStep(s => s - 1); setError(null); }}
                className="flex items-center gap-1.5 px-5 py-3 rounded-lg border border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 text-[14px] font-medium transition-all duration-150"
              >
                <ArrowLeft size={14} /> Voltar
              </button>
            )}
            <button
              onClick={next}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#c9a227] hover:bg-[#d4aa2d] text-[#1a1300] font-semibold text-[14.5px] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#1a1300]/20 border-t-[#1a1300] rounded-full animate-spin" />
                  Criando conta...
                </>
              ) : step === totalSteps - 1 ? (
                <>Criar minha conta <Check size={14} strokeWidth={2.5} /></>
              ) : (
                <>Continuar <ArrowRight size={14} /></>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between mt-6">
            <p className="text-[12px] text-zinc-700 flex items-center gap-1.5">
              <Lock size={10} /> SSL 256-bit · Sem spam
            </p>
            <p className="text-[12.5px] text-zinc-600">
              Já tem conta?{" "}
              <Link to="/" className="text-[#c9a227] font-medium hover:underline">Entrar</Link>
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ───────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-[400px] xl:w-[460px] shrink-0 border-l border-zinc-900 bg-[#0c0c0e] px-10 xl:px-12 py-14">

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c9a227]/8 border border-[#c9a227]/15 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a227] animate-pulse" />
            <span className="text-[11.5px] font-semibold text-[#c9a227] tracking-wide">2.400 mentores ativos</span>
          </div>

          <h2 className="text-[22px] font-bold text-zinc-100 leading-snug mb-2 tracking-tight">
            Tudo que você precisa para escalar sua mentoria
          </h2>
          <p className="text-[13.5px] text-zinc-600 mb-10">Sem planilhas. Sem ferramentas fragmentadas.</p>

          <div className="space-y-6">
            {BENEFITS.map(({ Icon, title, desc }, i) => (
              <div key={i} className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon size={15} color="#c9a227" strokeWidth={1.8} />
                </div>
                <div>
                  <div className="text-[13.5px] font-semibold text-zinc-200">{title}</div>
                  <div className="text-[12.5px] text-zinc-600 mt-0.5">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="mt-10">
          <div className="border border-zinc-800/80 rounded-xl p-5 bg-zinc-900/50">
            <div className="flex items-center gap-0.5 mb-3">
              {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="#c9a227" color="#c9a227" />)}
            </div>
            <p className="text-[13px] text-zinc-400 leading-relaxed mb-4">
              "Reduzi reembolsos em 71% no primeiro trimestre. A IA identifica quem está em risco antes do abandono acontecer."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#c9a227]/15 border border-[#c9a227]/20 flex items-center justify-center text-[11px] font-bold text-[#c9a227]">MC</div>
              <div>
                <div className="text-[12.5px] font-semibold text-zinc-300">Marcos Costa</div>
                <div className="text-[11.5px] text-zinc-600">Marketing Digital · R$ 2.4M/ano</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 mt-4">
            {[
              { n: "↓68%", l: "Reembolsos" },
              { n: "+3.2×", l: "Retenção" },
              { n: "98%", l: "Satisfação" },
            ].map((s, i) => (
              <div key={i} className="text-center p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                <div className="text-[17px] font-bold text-[#c9a227]">{s.n}</div>
                <div className="text-[11px] text-zinc-600 mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
