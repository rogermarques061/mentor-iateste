import { LayoutDashboard, Users, Brain, BookOpen, Gamepad2, BarChart3, Settings, GraduationCap, Package, ShoppingCart, DollarSign, CreditCard } from "lucide-react";
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
  { title: "Checkout", url: "/mentor/checkout", icon: CreditCard, badge: 2 },
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
              <h2 className="text-[20px] font-[800] tracking-[0.05em] leading-none">
                <span className="text-foreground">IMPLOF</span><span style={{ color: '#FFD700' }}>Y</span>
              </h2>
              <span className="text-[13px] font-semibold text-muted-foreground mt-1 block">Painel de Performance</span>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-bold" style={{ color: '#FFD700' }}>I</span>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/mentor"}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-semibold transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-[rgba(255,255,255,0.03)]"
                      activeClassName="bg-[rgba(255,215,0,0.08)] border-l-[3px] border-l-primary text-foreground"
                    >
                      <item.icon className="h-5 w-5 shrink-0" strokeWidth={1.5} />
                      {!collapsed && (
                        <span className="flex-1">{item.title}</span>
                      )}
                      {!collapsed && item.badge && (
                        <span className="ml-auto min-w-5 h-5 flex items-center justify-center rounded-full bg-destructive text-[11px] font-mono font-bold text-destructive-foreground animate-fade-slide-in">
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
              <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                MC
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-bold truncate">Marcos Costa</div>
                  <div className="text-[12px] font-semibold text-muted-foreground">Mentor</div>
                </div>
              )}
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink
                to="/aluno"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-semibold text-muted-foreground hover:bg-[rgba(255,255,255,0.03)] transition-all duration-200"
                activeClassName=""
              >
                <GraduationCap className="h-5 w-5" strokeWidth={1.5} />
                {!collapsed && <span>Área do Aluno</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
