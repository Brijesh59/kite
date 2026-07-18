
import { Button } from "@/components/ui/button";

interface PaginationInfo {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}

interface PostPaginationProps {
  pagination: PaginationInfo;
  currentPage: number;
  itemsCount: number;
  onPageChange: (page: number) => void;
}

export function PostPagination({
  pagination,
  currentPage,
  itemsCount,
  onPageChange,
}: PostPaginationProps) {
  if (pagination.totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-4 flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {itemsCount} of {pagination.total} posts
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {currentPage} of {pagination.totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === pagination.totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
