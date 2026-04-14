import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { StudentSidebar } from "./StudentSidebar";
import { MentorSidebar } from "./MentorSidebar";
import { useLocation } from "react-router-dom";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const isMentor = location.pathname.startsWith("/mentor");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {isMentor ? <MentorSidebar /> : <StudentSidebar />}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b border-border/50 px-4 lg:px-8 bg-background">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="ml-auto flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">JS</span>
              </div>
            </div>
          </header>
          <main className="flex-1 p-5 md:p-6 lg:p-10 xl:px-12 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
