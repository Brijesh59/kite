import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@kite/ui";
import { Button } from "@kite/ui";
import {
  UserPlusIcon,
  PlusIcon,
  SettingsIcon,
  UsersIcon,
  FileTextIcon,
  BarChart3Icon,
} from "lucide-react";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  variant?: "default" | "secondary" | "outline";
}

export function QuickActionsSection() {
  const navigate = useNavigate();
  const [hoveredActionId, setHoveredActionId] = useState<string | null>(null);

  const quickActions: QuickAction[] = [
    {
      id: "create-user",
      title: "Create User",
      description: "Add a new user to the system",
      icon: <UserPlusIcon className="h-5 w-5" />,
      action: () => navigate("/users?action=create"),
      variant: "default",
    },
    {
      id: "create-post",
      title: "Create Post",
      description: "Add a new blog post",
      icon: <PlusIcon className="h-5 w-5" />,
      action: () => navigate("/posts?action=create"),
      variant: "default",
    },
    {
      id: "view-users",
      title: "Manage Users",
      description: "View and manage all users",
      icon: <UsersIcon className="h-5 w-5" />,
      action: () => navigate("/users"),
      variant: "outline",
    },
    {
      id: "view-posts",
      title: "Manage Posts",
      description: "View and manage all posts",
      icon: <FileTextIcon className="h-5 w-5" />,
      action: () => navigate("/posts"),
      variant: "outline",
    },
    {
      id: "view-analytics",
      title: "Analytics",
      description: "View system analytics",
      icon: <BarChart3Icon className="h-5 w-5" />,
      action: () => navigate("/analytics"),
      variant: "secondary",
    },
    {
      id: "settings",
      title: "Settings",
      description: "Configure system settings",
      icon: <SettingsIcon className="h-5 w-5" />,
      action: () => navigate("/settings"),
      variant: "secondary",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Quick Actions</CardTitle>
        <CardDescription>Common administrative tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant={action.variant || "outline"}
              className={`h-auto p-4 justify-start transition-all duration-200 ${
                hoveredActionId === action.id
                  ? "scale-[1.02] shadow-md"
                  : "hover:scale-[1.01]"
              }`}
              onClick={action.action}
              onMouseEnter={() => setHoveredActionId(action.id)}
              onMouseLeave={() => setHoveredActionId(null)}
            >
              <div className="flex items-start space-x-3 text-left w-full">
                <div className="flex-shrink-0 mt-0.5">{action.icon}</div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium leading-5">
                    {action.title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 leading-4">
                    {action.description}
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
