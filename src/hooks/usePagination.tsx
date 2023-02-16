import { useMemo, useState } from 'react';

import { type Pagination } from '@/components/Table/types';
import { PAGE_SIZE_LIMIT } from '@/constants/common';

interface usePaginationProps {
  dataSize: number;
  handlePrevApiCall?: () => Promise<void>;
  handleNextApiCall?: () => Promise<void>;
}

export const usePagination = ({
  dataSize,
  handlePrevApiCall,
  handleNextApiCall,
}: usePaginationProps) => {
  const [{ pageIndex, pageSize }, setPagination] = useState<Pagination>({
    pageIndex: 0,
    pageSize: PAGE_SIZE_LIMIT, // can be changed with setPagination
  });
  const [{ previous, next }, setIsLoading] = useState({
    previous: false,
    next: false,
  });

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  const hasPagination = pagination?.pageSize < dataSize;
  const firstPage = pageIndex === 0;
  const lastPage = pagination?.pageSize * (pageIndex + 1) > dataSize;

  const handleNextPage = async () => {
    if (lastPage) return;
    setIsLoading((prev) => ({ ...prev, next: true }));
    if (handleNextApiCall) {
      await handleNextApiCall();
    }
    setPagination((prev) => ({
      pageIndex: prev.pageIndex + 1,
      pageSize: pagination?.pageSize,
    }));
    setIsLoading((prev) => ({ ...prev, next: false }));
  };

  const handlePrevPage = async () => {
    if (firstPage) return;
    setIsLoading((prev) => ({ ...prev, previous: true }));
    if (handlePrevApiCall) {
      await handlePrevApiCall();
    }
    setPagination((prev) => ({
      pageIndex: prev.pageIndex - 1,
      pageSize: pagination?.pageSize,
    }));
    setIsLoading((prev) => ({ ...prev, previous: false }));
  };

  return {
    hasPagination,
    pagination: { pageIndex, pageSize },
    firstPage,
    lastPage,
    loading: { previous, next },
    handleNextPage,
    handlePrevPage,
    setPagination, // use this to allow user to customise pageSize
  };
};
