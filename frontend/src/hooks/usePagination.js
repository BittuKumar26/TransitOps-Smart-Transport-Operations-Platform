import { useMemo, useState } from 'react';

export function usePagination(items = [], initialPageSize = 10) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  const pagedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  return { page, pageSize, totalPages, pagedItems, setPage, setPageSize };
}
