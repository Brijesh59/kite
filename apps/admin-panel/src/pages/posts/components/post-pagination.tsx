import { Button } from "@kite/ui";

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
    <div className="flex items-center justify-between mt-4">
      <p className="text-sm text-gray-700">
        Showing {itemsCount} of {pagination.total} posts
      </p>
      <div className="flex items-center space-x-2">
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
