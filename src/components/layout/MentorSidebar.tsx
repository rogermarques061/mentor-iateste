import { LayoutDashboard, Users, Brain, BarChart3, Settings, GraduationCap } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Overview", url: "/mentor", icon: LayoutDashboard },
  { title: "Alunos", url: "/mentor/students", icon: Users },
  { title: "Inteligência IA", url: "/mentor/ai", icon: Brain },
  { title: "Analytics", url: "/mentor/analytics", icon: BarChart3 },
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
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 hover:bg-accent/50"
                      activeClassName="bg-accent text-accent-foreground"
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
                to="/"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-accent/50 transition-all duration-200"
                activeClassName="bg-accent text-accent-foreground"
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
