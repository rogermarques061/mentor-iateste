import { Check, Mail, Share2, ExternalLink, Clock, Star } from "lucide-react";

const purchase = {
  name: "Mentoria PATRON",
  value: "R$ 997,00",
  method: "PIX",
  orderId: "ORD-2025-001847",
  customerName: "Carlos Mendes",
  email: "carlos@email.com",
};

const upsell = {
  name: "Programa Avançado de Liderança",
  originalPrice: 497,
  offerPrice: 297,
  countdown: "14:59",
};

const PurchaseSuccess = () => {
  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-lg space-y-6">
        {/* Success Icon */}
        <div className="text-center animate-fade-slide-in">
          <div className="w-20 h-20 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-6 relative">
            <Check className="h-10 w-10 text-success" strokeWidth={2.5} />
            <div className="absolute inset-0 rounded-full border-2 border-success/30 animate-[ping_1.5s_ease-out_1]" />
          </div>
          <h1 className="font-display text-3xl mb-2">Compra confirmada! 🎉</h1>
          <p className="text-muted-foreground">
            Bem-vindo(a), {purchase.customerName}! Seu acesso já está liberado.
          </p>
        </div>

        {/* Order Summary */}
        <div className="glass rounded-2xl p-6 space-y-4 animate-fade-slide-in" style={{ animationDelay: '200ms' }}>
          <h3 className="font-semibold text-sm">Resumo da compra</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Produto</span>
              <span className="font-medium">{purchase.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Valor</span>
              <span className="font-mono text-[#F59E0B] font-medium">{purchase.value}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Método</span>
              <span>{purchase.method}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Nº do pedido</span>
              <span className="font-mono text-xs text-primary">{purchase.orderId}</span>
            </div>
          </div>
          <div className="glass rounded-xl p-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Mail className="h-3.5 w-3.5 shrink-0" />
            <span>Detalhes enviados para <strong className="text-foreground">{purchase.email}</strong></span>
          </div>
        </div>

        {/* Main CTA */}
        <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-4 text-base font-semibold glow-primary transition-all flex items-center justify-center gap-2 animate-fade-slide-in" style={{ animationDelay: '300ms' }}>
          Acessar meu curso agora <ExternalLink className="h-4 w-4" />
        </button>

        {/* Upsell */}
        <div className="glass rounded-2xl p-6 border border-[#F59E0B]/20 space-y-4 animate-fade-slide-in" style={{ animationDelay: '500ms' }}>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-[#F59E0B]" />
            <span className="text-xs font-medium text-[#F59E0B]">Oferta especial — Exclusivo para novos alunos</span>
          </div>
          <h3 className="font-semibold text-sm">{upsell.name}</h3>
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-2xl font-bold text-[#F59E0B]">R$ {upsell.offerPrice}</span>
            <span className="font-mono text-sm text-muted-foreground line-through">R$ {upsell.originalPrice}</span>
            <span className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-[#F59E0B]/15 text-[#F59E0B]">-{Math.round((1 - upsell.offerPrice / upsell.originalPrice) * 100)}%</span>
          </div>
          <div className="flex items-center gap-2 text-warning text-xs">
            <Clock className="h-3.5 w-3.5" />
            <span className="font-mono font-medium">Esta oferta expira em: {upsell.countdown}</span>
          </div>
          <div className="flex gap-3">
            <button className="flex-1 bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-black rounded-xl py-3 text-sm font-medium transition-all">
              Quero aproveitar
            </button>
            <button className="text-xs text-muted-foreground hover:text-foreground transition-all px-3">
              Não, obrigado
            </button>
          </div>
        </div>

        {/* Share */}
        <div className="text-center space-y-3 animate-fade-slide-in" style={{ animationDelay: '600ms' }}>
          <p className="text-xs text-muted-foreground">Conte para um amigo</p>
          <div className="flex justify-center gap-3">
            <button className="glass rounded-xl px-4 py-2 text-xs flex items-center gap-2 hover:bg-[rgba(255,255,255,0.06)] transition-all">
              <Share2 className="h-3.5 w-3.5" /> WhatsApp
            </button>
            <button className="glass rounded-xl px-4 py-2 text-xs flex items-center gap-2 hover:bg-[rgba(255,255,255,0.06)] transition-all">
              <Share2 className="h-3.5 w-3.5" /> Copiar link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSuccess;
