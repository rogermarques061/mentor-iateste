import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Check, Mail, Share2, ExternalLink, Clock, Star, Copy } from "lucide-react";
import { usePlatform, formatCurrency } from "@/contexts/PlatformContext";

const PurchaseSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, switchRole } = usePlatform();
  const [countdown, setCountdown] = useState(899);
  const [confetti, setConfetti] = useState(true);
  const [copied, setCopied] = useState(false);

  // Find the transaction
  const txn = state.transactions.find(t => t.id === id);
  const product = txn ? state.products.find(p => p.id === txn.checkoutId) : null;

  useEffect(() => {
    const t = setTimeout(() => setConfetti(false), 3000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const int = setInterval(() => setCountdown(p => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(int);
  }, []);

  const formatTimer = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const customerName = txn?.customer.name || "Aluno";
  const customerEmail = txn?.customer.email || "";
  const maskedEmail = customerEmail.replace(/^(.{3}).*(@.*)$/, "$1***$2");
  const productName = product?.name || txn?.productName || "Produto";
  const amount = txn ? formatCurrency(txn.amount) : "R$ 0,00";
  const method = txn?.method === "pix" ? "PIX" : txn?.method === "card" ? "Cartão" : "Boleto";

  // Find upsell product (another published product not linked to this checkout)
  const upsellProduct = state.products.find(p => p.status === "published" && p.id !== txn?.checkoutId);

  const handleAccessCourse = () => {
    // Switch to student role and navigate
    const student = state.students.find(s => s.email === customerEmail);
    if (student) {
      switchRole("student", student.id);
    }
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {confetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="absolute w-2 h-2 rounded-full animate-bounce"
              style={{ left: `${Math.random() * 100}%`, top: `-${Math.random() * 20}%`,
                background: ["#FFD700", "#B8860B", "#34D399", "#60A5FA", "#F59E0B"][i % 5],
                animationDelay: `${Math.random() * 2}s`, animationDuration: `${2 + Math.random() * 3}s`, opacity: 1 - (i / 40) * 0.5 }} />
          ))}
        </div>
      )}

      <div className="w-full max-w-lg space-y-6 relative z-10">
        <div className="text-center animate-fade-slide-in">
          <div className="w-20 h-20 rounded-full bg-[rgba(52,211,153,0.15)] flex items-center justify-center mx-auto mb-6 relative">
            <Check className="h-10 w-10 text-[#34D399]" strokeWidth={2.5} />
            <div className="absolute inset-0 rounded-full border-2 border-[rgba(52,211,153,0.3)] animate-[ping_1.5s_ease-out_1]" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl mb-2">Compra confirmada! 🎉</h1>
          <p className="text-[#9B9AA8]">Bem-vindo(a), {customerName}! Seu acesso já está liberado.</p>
        </div>

        <div className="glass rounded-2xl p-6 space-y-4 animate-fade-slide-in" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center gap-2 text-xs text-[#34D399]"><Check className="h-3.5 w-3.5" /> Pedido confirmado</div>
          <div className="space-y-3">
            {[
              { label: "Produto", value: productName },
              { label: "Valor", value: amount, mono: true, gold: true },
              { label: "Método", value: method },
              { label: "Nº do pedido", value: `#${txn?.id || id}`, mono: true, primary: true },
            ].map((row, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-[#9B9AA8]">{row.label}</span>
                <span className={`${row.mono ? "font-mono" : ""} ${row.gold ? "text-[#F59E0B] font-medium" : ""} ${row.primary ? "text-[#FFD700] text-xs" : ""}`}>{row.value}</span>
              </div>
            ))}
          </div>
          <div className="glass rounded-xl p-3 flex items-center gap-2 text-xs text-[#9B9AA8]">
            <Mail className="h-3.5 w-3.5 shrink-0" />
            <span>Detalhes enviados para <strong className="text-[#F1F0F5]">{maskedEmail}</strong></span>
          </div>
        </div>

        <button onClick={handleAccessCourse}
          className="w-full bg-[#FFD700] hover:bg-[#FFD700]/90 text-white rounded-xl py-4 text-base font-semibold glow-primary transition-all flex items-center justify-center gap-2 animate-fade-slide-in active:scale-[0.98]"
          style={{ animationDelay: "300ms" }}>
          Acessar meu curso agora <ExternalLink className="h-4 w-4" />
        </button>

        {upsellProduct && (
          <div className="glass rounded-2xl p-6 border border-[rgba(245,158,11,0.2)] space-y-4 animate-fade-slide-in" style={{ animationDelay: "500ms" }}>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-[#F59E0B]" />
              <span className="text-xs font-medium text-[#F59E0B]">Oferta especial — Exclusivo para novos alunos</span>
            </div>
            <h3 className="font-display text-base">{upsellProduct.name}</h3>
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-2xl font-bold text-[#F59E0B]">{formatCurrency(upsellProduct.price * 0.7)}</span>
              <span className="font-mono text-sm text-[#9B9AA8] line-through">{formatCurrency(upsellProduct.price)}</span>
              <span className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-[rgba(245,158,11,0.15)] text-[#F59E0B]">-30%</span>
            </div>
            <div className="flex items-center gap-2 text-[#FBBF24] text-xs">
              <Clock className="h-3.5 w-3.5" />
              <span className="font-mono font-medium">Esta oferta expira em: {formatTimer(countdown)}</span>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-black rounded-xl py-3.5 text-sm font-semibold transition-all active:scale-[0.98]">Quero aproveitar</button>
              <button className="text-xs text-[#9B9AA8] hover:text-[#F1F0F5] transition-all px-4">Não, obrigado</button>
            </div>
          </div>
        )}

        <div className="text-center space-y-3 animate-fade-slide-in" style={{ animationDelay: "600ms" }}>
          <p className="text-xs text-[#9B9AA8]">Conte para alguém que também precisa disso</p>
          <div className="flex justify-center gap-3">
            <button className="glass rounded-xl px-5 py-2.5 text-xs flex items-center gap-2 hover:bg-[rgba(255,255,255,0.06)] transition-all"><Share2 className="h-3.5 w-3.5" /> WhatsApp</button>
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
              className="glass rounded-xl px-5 py-2.5 text-xs flex items-center gap-2 hover:bg-[rgba(255,255,255,0.06)] transition-all">
              {copied ? <Check className="h-3.5 w-3.5 text-[#34D399]" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copiado!" : "Copiar link"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSuccess;
