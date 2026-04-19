import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowRight, X, ArrowLeft, Check, BarChart3, GraduationCap } from "lucide-react";

export type AuthMode = "login" | "signup" | "recover" | null;

interface Props {
  mode: AuthMode;
  onModeChange: (m: AuthMode) => void;
}

const inputCls =
  "w-full px-3.5 py-3 text-sm bg-[#0d0d0d] border border-white/10 text-[#f5f5f5] rounded-lg focus:outline-none focus:border-[#c9a227] placeholder:text-[#5a5a5a] transition-colors";
const labelCls = "text-[12.5px] font-medium text-[#888] block mb-1.5";
const btnPrimary =
  "w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold text-[15px] bg-[#c9a227] text-[#1a1300] hover:bg-[#e6b830] transition disabled:opacity-60 disabled:cursor-not-allowed";

function passwordScore(v: string) {
  let s = 0;
  if (v.length >= 8) s++;
  if (/[A-Z]/.test(v)) s++;
  if (/[0-9]/.test(v)) s++;
  if (/[^A-Za-z0-9]/.test(v)) s++;
  return s;
}
const strengthMap = [
  { w: "0%", c: "#5a5a5a", t: "—" },
  { w: "25%", c: "#e53e3e", t: "Fraca" },
  { w: "55%", c: "#c9a227", t: "Média" },
  { w: "80%", c: "#c9a227", t: "Boa" },
  { w: "100%", c: "#22c55e", t: "Forte" },
];

export function AuthModals({ mode, onModeChange }: Props) {
  const navigate = useNavigate();
  const open = mode !== null;

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginMsg, setLoginMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  // Signup state
  const [role, setRole] = useState<"mentor" | "aluno">("mentor");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupMsg, setSignupMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  // Recover state
  const [recoverEmail, setRecoverEmail] = useState("");
  const [recoverLoading, setRecoverLoading] = useState(false);
  const [recoverMsg, setRecoverMsg] = useState<string | null>(null);

  // Reset feedback when modal closes
  useEffect(() => {
    if (!open) {
      setLoginMsg(null);
      setSignupMsg(null);
      setRecoverMsg(null);
    }
  }, [open]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginMsg(null);
    const isMentor = loginEmail.toLowerCase().includes("mentor");
    setTimeout(() => {
      try {
        localStorage.setItem("implofy:user-role", isMentor ? "mentor" : "aluno");
      } catch {}
      setLoginMsg({
        kind: "ok",
        text: isMentor ? "Bem-vindo, mentor! Abrindo Painel..." : "Acesso liberado! Redirecionando...",
      });
      setLoginLoading(false);
      setTimeout(() => {
        onModeChange(null);
        navigate(isMentor ? "/mentor" : "/aluno");
      }, 700);
    }, 1000);
  }

  function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (pass !== confirm) {
      setSignupMsg({ kind: "err", text: "As senhas não coincidem" });
      return;
    }
    setSignupLoading(true);
    setSignupMsg(null);
    setTimeout(() => {
      try {
        localStorage.setItem("implofy:user-role", role);
      } catch {}
      setSignupMsg({ kind: "ok", text: "Conta criada com sucesso! Redirecionando..." });
      setSignupLoading(false);
      setTimeout(() => {
        onModeChange(null);
        navigate(role === "mentor" ? "/mentor" : "/aluno");
      }, 700);
    }, 1100);
  }

  function handleRecover(e: React.FormEvent) {
    e.preventDefault();
    setRecoverLoading(true);
    setRecoverMsg(null);
    setTimeout(() => {
      setRecoverMsg("Link de recuperação enviado! Verifique sua caixa de entrada.");
      setRecoverLoading(false);
    }, 900);
  }

  const score = passwordScore(pass);
  const sObj = strengthMap[score];

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onModeChange(null)}>
      <DialogContent
        className="max-w-[440px] p-0 border-0 bg-transparent shadow-none"
        style={{ fontFamily: "Inter, system-ui, sans-serif" }}
      >
        <div className="relative bg-[#161616] border border-white/10 rounded-[14px] p-8 max-h-[90vh] overflow-y-auto text-[#f5f5f5]">
          <button
            onClick={() => onModeChange(null)}
            className="absolute top-4 right-4 w-8 h-8 grid place-items-center rounded-lg text-[#888] hover:bg-white/5 hover:text-[#f5f5f5] transition"
            aria-label="Fechar"
          >
            <X size={16} />
          </button>

          {mode === "login" && (
            <>
              <div className="mb-5">
                <h3 className="text-[22px] font-bold tracking-[-0.01em] m-0">Bem-vindo de volta</h3>
                <p className="text-[#888] text-[13.5px] mt-1.5 m-0">
                  Entre para acessar seu painel ou área do aluno.
                </p>
              </div>
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label className={labelCls}>Email</label>
                  <input
                    className={inputCls}
                    type="email"
                    placeholder="seu@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className={labelCls}>Senha</label>
                  <input
                    className={inputCls}
                    type="password"
                    placeholder="••••••••"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center justify-between mb-4 text-[13px]">
                  <label className="flex items-center gap-2 text-[#888] cursor-pointer">
                    <input type="checkbox" /> Lembrar
                  </label>
                  <button
                    type="button"
                    onClick={() => onModeChange("recover")}
                    className="text-[#c9a227] font-medium hover:underline"
                  >
                    Esqueci minha senha
                  </button>
                </div>
                <button type="submit" className={btnPrimary} disabled={loginLoading}>
                  {loginLoading ? "Entrando..." : "Entrar"}
                </button>
                {loginMsg && (
                  <div
                    className="mt-3 p-3 rounded-lg text-[13px]"
                    style={{
                      background: loginMsg.kind === "ok" ? "rgba(34,197,94,0.1)" : "rgba(229,62,62,0.1)",
                      border: `1px solid ${loginMsg.kind === "ok" ? "rgba(34,197,94,0.3)" : "rgba(229,62,62,0.3)"}`,
                      color: loginMsg.kind === "ok" ? "#22c55e" : "#e53e3e",
                    }}
                  >
                    {loginMsg.kind === "ok" ? "✓ " : "✗ "}{loginMsg.text}
                  </div>
                )}
              </form>
              <div className="mt-4 text-center text-[13px] text-[#888]">
                Ainda não tem conta?{" "}
                <button onClick={() => onModeChange("signup")} className="text-[#c9a227] font-medium hover:underline">
                  Criar agora
                </button>
              </div>
            </>
          )}

          {mode === "signup" && (
            <>
              <div className="mb-5">
                <h3 className="text-[22px] font-bold tracking-[-0.01em] m-0">Crie sua conta</h3>
                <p className="text-[#888] text-[13.5px] mt-1.5 m-0">Comece em menos de 1 minuto. Sem cartão.</p>
              </div>
              <form onSubmit={handleSignup}>
                <div className="grid grid-cols-2 gap-2.5 mb-4">
                  {(["mentor", "aluno"] as const).map((r) => {
                    const selected = role === r;
                    const Icon = r === "mentor" ? BarChart3 : GraduationCap;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className="p-3.5 rounded-lg text-center transition"
                        style={{
                          background: selected ? "rgba(201,162,39,0.12)" : "#0d0d0d",
                          border: `1px solid ${selected ? "#c9a227" : "rgba(255,255,255,0.06)"}`,
                        }}
                      >
                        <Icon size={22} className="mx-auto mb-1.5" color="#c9a227" strokeWidth={1.7} />
                        <strong className="block text-[13.5px] font-semibold">
                          {r === "mentor" ? "Sou Mentor" : "Sou Aluno"}
                        </strong>
                        <span className="text-[11px] text-[#888]">
                          {r === "mentor" ? "Vender e gerenciar" : "Estudar e crescer"}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="mb-3.5">
                  <label className={labelCls}>Nome completo</label>
                  <input
                    className={inputCls}
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3.5">
                  <label className={labelCls}>Email</label>
                  <input
                    className={inputCls}
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3.5">
                  <label className={labelCls}>Senha</label>
                  <input
                    className={inputCls}
                    type="password"
                    placeholder="••••••••"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    required
                  />
                  <div className="mt-2 flex items-center gap-2 text-[11.5px] text-[#888]">
                    <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all"
                        style={{ width: sObj.w, background: sObj.c }}
                      />
                    </div>
                    <span style={{ color: sObj.c }}>{sObj.t}</span>
                  </div>
                </div>
                <div className="mb-4">
                  <label className={labelCls}>Confirmar senha</label>
                  <input
                    className={inputCls}
                    type="password"
                    placeholder="••••••••"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className={btnPrimary} disabled={signupLoading}>
                  {signupLoading ? "Criando sua conta..." : "Criar conta"}
                </button>
                {signupMsg && (
                  <div
                    className="mt-3 p-3 rounded-lg text-[13px]"
                    style={{
                      background: signupMsg.kind === "ok" ? "rgba(34,197,94,0.1)" : "rgba(229,62,62,0.1)",
                      border: `1px solid ${signupMsg.kind === "ok" ? "rgba(34,197,94,0.3)" : "rgba(229,62,62,0.3)"}`,
                      color: signupMsg.kind === "ok" ? "#22c55e" : "#e53e3e",
                    }}
                  >
                    {signupMsg.kind === "ok" ? <Check size={14} className="inline mr-1" /> : "✗ "}
                    {signupMsg.text}
                  </div>
                )}
              </form>
              <div className="mt-4 text-center text-[13px] text-[#888]">
                Já tem conta?{" "}
                <button onClick={() => onModeChange("login")} className="text-[#c9a227] font-medium hover:underline">
                  Entrar
                </button>
              </div>
            </>
          )}

          {mode === "recover" && (
            <>
              <div className="mb-5">
                <button
                  onClick={() => onModeChange("login")}
                  className="text-[#888] text-[13px] inline-flex items-center gap-1.5 mb-3 hover:text-[#f5f5f5] transition"
                >
                  <ArrowLeft size={14} /> Voltar
                </button>
                <h3 className="text-[22px] font-bold tracking-[-0.01em] m-0">Recuperar acesso</h3>
                <p className="text-[#888] text-[13.5px] mt-1.5 m-0">
                  Enviaremos um link de redefinição para seu email.
                </p>
              </div>
              <form onSubmit={handleRecover}>
                <div className="mb-4">
                  <label className={labelCls}>Email cadastrado</label>
                  <input
                    className={inputCls}
                    type="email"
                    placeholder="seu@email.com"
                    value={recoverEmail}
                    onChange={(e) => setRecoverEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className={btnPrimary} disabled={recoverLoading}>
                  {recoverLoading ? (
                    "Enviando..."
                  ) : (
                    <>
                      Enviar link <ArrowRight size={14} />
                    </>
                  )}
                </button>
                {recoverMsg && (
                  <div
                    className="mt-3 p-3 rounded-lg text-[13px]"
                    style={{
                      background: "rgba(34,197,94,0.1)",
                      border: "1px solid rgba(34,197,94,0.3)",
                      color: "#22c55e",
                    }}
                  >
                    ✓ {recoverMsg}
                  </div>
                )}
              </form>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
