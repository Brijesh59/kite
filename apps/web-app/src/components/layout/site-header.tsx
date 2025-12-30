import { SidebarTrigger } from "@kite/ui";
import { Separator } from "@kite/ui";
import { useLocation, Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@kite/ui";

const routeNames: Record<string, string> = {
  "/": "Dashboard",
  "/dashboard": "Dashboard",
  "/posts": "Posts",
  "/posts/new": "New Post",
  "/profile": "Profile",
};

export function SiteHeader() {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  // Get the current page name
  let currentPageName = routeNames[location.pathname];

  // Handle dynamic routes like /posts/edit/:id
  if (!currentPageName) {
    if (location.pathname.startsWith("/posts/edit/")) {
      currentPageName = "Edit Post";
    } else {
      currentPageName = pathSegments[pathSegments.length - 1] || "Dashboard";
      // Capitalize first letter
      currentPageName = currentPageName.charAt(0).toUpperCase() + currentPageName.slice(1);
    }
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink asChild>
                <Link to="/">Kite</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{currentPageName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
