import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@kite/ui";
import { Badge } from "@kite/ui";
import { Button } from "@kite/ui";
import { ChevronRightIcon, UserIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "ORGANISER" | "USER";
  createdAt: string;
}

interface RecentUsersSectionProps {
  users: User[];
}

export function RecentUsersSection({ users }: RecentUsersSectionProps) {
  const navigate = useNavigate();
  const [hoveredUserId, setHoveredUserId] = useState<string | null>(null);

  const roleColors = {
    ADMIN: "bg-red-100 text-red-800",
    ORGANISER: "bg-blue-100 text-blue-800",
    USER: "bg-green-100 text-green-800",
  };

  const handleViewAllUsers = () => {
    navigate("/users");
  };

  const handleUserClick = (userId: string) => {
    navigate(`/users/${userId}`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-medium">Recent Users</CardTitle>
          <CardDescription>Latest user registrations</CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleViewAllUsers}
          className="ml-auto"
        >
          View All
          <ChevronRightIcon className="h-4 w-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <UserIcon className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-2 text-sm text-muted-foreground">
                No recent users found
              </p>
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${
                  hoveredUserId === user.id
                    ? "bg-muted/50 border-border"
                    : "hover:bg-muted/30"
                }`}
                onMouseEnter={() => setHoveredUserId(user.id)}
                onMouseLeave={() => setHoveredUserId(null)}
                onClick={() => handleUserClick(user.id)}
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserIcon className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <Badge
                    variant="secondary"
                    className={`text-xs ${roleColors[user.role]}`}
                  >
                    {user.role}
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(user.createdAt), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
