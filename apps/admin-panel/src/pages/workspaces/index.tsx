import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getWorkspacesApi } from "@/api/workspaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading";
import { Search } from "lucide-react";

export default function WorkspacesPage() {
  const [search, setSearch] = useState("");
  const [page] = useState(1);
  const [limit] = useState(50);

  const { data: workspacesData, isLoading } = useQuery({
    queryKey: ["admin-workspaces", page, limit, search],
    queryFn: () => getWorkspacesApi({ page, limit, search }),
  });

  const workspaces = workspacesData?.data.data.items || [];
  const total = workspacesData?.data.data.total || 0;

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Workspaces</h1>
        <p className="mt-2 text-gray-600">
          View all workspaces across the platform
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Workspaces ({total})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search workspaces..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {workspaces.length === 0 ? (
            <p className="py-8 text-center text-gray-500">No workspaces found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Posts</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workspaces.map((workspace) => (
                  <TableRow key={workspace.id}>
                    <TableCell className="font-medium">
                      {workspace.name}
                    </TableCell>
                    <TableCell>
                      <code className="rounded bg-gray-100 px-2 py-1 text-xs">
                        {workspace.slug}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {workspace.owner?.name || "Unknown"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {workspace.owner?.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {workspace._count?.members || 0}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {workspace._count?.posts || 0}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={workspace.isActive ? "default" : "secondary"}>
                        {workspace.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(workspace.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
