import { Home, FileText, LogOut, User, Briefcase } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from "@/components/ui/sidebar";

import { useAuthStore } from "@/utils/auth-store";
import { useQueryClient } from "@tanstack/react-query";
import { WorkspaceSwitcher } from "@/components/workspace-switcher";
import { useWorkspaceStore } from "@/utils/workspace-store";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Posts",
    url: "/posts",
    icon: FileText,
  }
];

export function AppSidebar() {
  const location = useLocation();
  const { logout } = useAuthStore();
  const { clearWorkspaces } = useWorkspaceStore();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    // Clear all React Query cache
    queryClient.clear();
    // Clear workspace store
    clearWorkspaces();
    // Logout from auth store
    logout();
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-3 px-4 py-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-background shadow-sm ring-1 ring-border">
            <img
              src="/logo.png"
              alt="Kite logo"
              className="size-full scale-150 object-cover"
            />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate font-semibold">Kite</span>
            <span className="truncate text-xs text-muted-foreground">
              Workspace
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <div className="px-3 py-2 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <WorkspaceSwitcher />
        </div>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      item.url === "/"
                        ? location.pathname === "/" ||
                          location.pathname === "/dashboard"
                        : location.pathname.startsWith(item.url)
                    }
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === "/workspaces"}
                >
                  <Link to="/workspaces">
                    <Briefcase className="h-4 w-4" />
                    <span>Workspaces</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === "/profile"}
                >
                  <Link to="/profile">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              type="button"
              tooltip="Logout"
              onClick={handleLogout}
              className="group-data-[collapsible=icon]:size-10!"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
