import { Play, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroBanner() {
  return (
    <div className="relative rounded-2xl overflow-hidden glass card-hover animate-fade-slide-in">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent" />
      <div className="relative flex flex-col md:flex-row items-center gap-6 p-8 md:p-10">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
              Em andamento
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" strokeWidth={1.5} />
              Módulo 3 · Aula 7
            </span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl leading-tight">
            Dominando Vendas de<br />
            <span className="text-gradient">Alto Ticket</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-md">
            Continue de onde parou — você está a 3 aulas de completar o módulo atual.
          </p>
          <Button variant="hero" size="lg" className="mt-2">
            <Play className="h-4 w-4" strokeWidth={1.5} />
            Continuar Assistindo
          </Button>
        </div>
        <div className="w-full md:w-72 h-40 md:h-44 rounded-xl bg-secondary/50 flex items-center justify-center overflow-hidden">
          <div className="relative w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-primary/30 flex items-center justify-center backdrop-blur-sm">
              <Play className="h-6 w-6 text-primary-foreground ml-0.5" strokeWidth={1.5} />
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
              <div className="h-full w-[68%] bg-primary rounded-r-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
