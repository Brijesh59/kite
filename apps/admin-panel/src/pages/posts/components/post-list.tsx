import { Card, CardContent, CardHeader, CardTitle } from "@kite/ui";
import { PostTable } from "./post-table";
import { PostPagination } from "./post-pagination";
import { PostSearchFilters } from "./post-search-filters";
import type { Post } from "@kite/types";

interface PaginationInfo {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}

interface PostListProps {
  posts: Post[];
  isLoading: boolean;
  search: string;
  sortBy: string;
  sortOrder: string;
  currentPage: number;
  pagination?: PaginationInfo;
  onSearchChange: (search: string) => void;
  onSortByChange: (sortBy: string) => void;
  onSortOrderChange: (sortOrder: string) => void;
  onPageChange: (page: number) => void;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
  onView: (post: Post) => void;
}

export function PostList({
  posts,
  isLoading,
  search,
  sortBy,
  sortOrder,
  currentPage,
  pagination,
  onSearchChange,
  onSortByChange,
  onSortOrderChange,
  onPageChange,
  onEdit,
  onDelete,
  onView,
}: PostListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Posts</CardTitle>
        <PostSearchFilters
          search={search}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSearchChange={onSearchChange}
          onSortByChange={onSortByChange}
          onSortOrderChange={onSortOrderChange}
        />
      </CardHeader>
      <CardContent>
        <PostTable
          posts={posts}
          isLoading={isLoading}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
        {pagination && !isLoading && (
          <PostPagination
            pagination={pagination}
            currentPage={currentPage}
            itemsCount={posts.length}
            onPageChange={onPageChange}
          />
        )}
      </CardContent>
    </Card>
  );
}
