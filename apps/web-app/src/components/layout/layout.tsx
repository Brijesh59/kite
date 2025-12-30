import { SidebarInset, SidebarProvider } from "@kite/ui";
import { AppSidebar } from "./app-sidebar";
import { SiteHeader } from "./site-header";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-4 gap-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
