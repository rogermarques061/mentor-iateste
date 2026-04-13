import { LayoutDashboard, Users, Brain, BookOpen, Gamepad2, BarChart3, Settings, GraduationCap, Package, ShoppingCart, DollarSign } from "lucide-react";
import { NavLink } from "@/components/NavLink";
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
  { title: "Visão Geral", url: "/mentor", icon: LayoutDashboard },
  { title: "Alunos", url: "/mentor/students", icon: Users },
  { title: "Produtos", url: "/mentor/products", icon: Package },
  { title: "Vendas", url: "/mentor/sales", icon: ShoppingCart },
  { title: "Financeiro", url: "/mentor/financial", icon: DollarSign },
  { title: "Inteligência IA", url: "/mentor/ai", icon: Brain, badge: 3 },
  { title: "Conteúdo", url: "/mentor/content", icon: BookOpen },
  { title: "Gamificação", url: "/mentor/gamification", icon: Gamepad2 },
  { title: "Relatórios", url: "/mentor/reports", icon: BarChart3 },
  { title: "Configurações", url: "/mentor/settings", icon: Settings },
];

export function MentorSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarContent className="pt-6">
        <div className="px-4 mb-8">
          {!collapsed && (
            <div>
              <h2 className="font-display text-lg text-gradient">MentorIA</h2>
              <span className="text-xs text-muted-foreground">Painel do Mentor</span>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-display text-gradient">M</span>
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
                      end={item.url === "/mentor"}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 text-[hsl(240,8%,42%)] hover:text-[hsl(240,8%,65%)] hover:bg-[rgba(255,255,255,0.03)]"
                      activeClassName="bg-[rgba(139,92,246,0.12)] border-l-[3px] border-l-primary text-[hsl(260,20%,96%)]"
                    >
                      <item.icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.5} />
                      {!collapsed && (
                        <span className="flex-1">{item.title}</span>
                      )}
                      {!collapsed && item.badge && (
                        <span className="ml-auto min-w-5 h-5 flex items-center justify-center rounded-full bg-destructive text-[10px] font-mono font-medium text-destructive-foreground animate-fade-slide-in">
                          {item.badge}
                        </span>
                      )}
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
            <div className={`px-3 py-3 ${!collapsed ? 'flex items-center gap-3' : 'flex flex-col items-center gap-2'}`}>
              <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-xs font-medium text-primary shrink-0">
                MC
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">Marcos Costa</div>
                  <div className="text-[11px] text-muted-foreground">Mentor</div>
                </div>
              )}
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink
                to="/"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-[rgba(255,255,255,0.03)] transition-all duration-200"
                activeClassName=""
              >
                <GraduationCap className="h-[18px] w-[18px]" strokeWidth={1.5} />
                {!collapsed && <span>Área do Aluno</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
