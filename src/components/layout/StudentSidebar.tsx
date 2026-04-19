import { Home, BookOpen, Trophy, BarChart3, Medal, PlayCircle, Settings } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Início", url: "/aluno", icon: Home },
  { title: "Meus Cursos", url: "/aluno/courses", icon: BookOpen },
  { title: "Player de Aula", url: "/aluno/player", icon: PlayCircle },
  { title: "Minha Evolução", url: "/aluno/evolution", icon: BarChart3 },
  { title: "Conquistas", url: "/aluno/achievements", icon: Trophy },
  { title: "Ranking", url: "/aluno/ranking", icon: Medal },
];

export function StudentSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarContent className="pt-6">
        <div className="px-4 mb-8">
          {!collapsed && (
            <h2 className="font-display text-lg font-bold tracking-tight">
              <span className="text-foreground">IMPLOF</span><span style={{ color: '#FFD700' }}>Y</span>
            </h2>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-bold" style={{ color: '#FFD700' }}>I</span>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/aluno"}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-[rgba(255,255,255,0.03)]"
                      activeClassName="bg-[rgba(255,215,0,0.08)] text-primary"
                    >
                      <item.icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="pb-6">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink
                to="/mentor"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-[rgba(255,255,255,0.03)] transition-all duration-200"
                activeClassName="bg-[rgba(255,215,0,0.08)] text-primary"
              >
                <Settings className="h-[18px] w-[18px]" strokeWidth={1.5} />
                {!collapsed && <span>Painel Mentor</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
