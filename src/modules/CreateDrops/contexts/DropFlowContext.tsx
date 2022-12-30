import React, { createContext, PropsWithChildren, useContext, useState } from 'react';

import { IBreadcrumbItem } from '@/common/components/Breadcrumbs';

import { IFlowPage } from '../types/types';

interface DropFlowProviderProps {
  flowPages: IFlowPage[];
  breadcrumbs: IBreadcrumbItem[];
}

const DropFlowContext = createContext({
  currentPageIndex: 0,
  flowPages: undefined,
  breadcrumbs: [],
  onNext: undefined,
  onPrevious: undefined,
  currentFlowPage: undefined,
});

/**
 *
 * Context for controlling navigation of the drop flow pages
 * and sets layout information such as breadcrumbs, pages
 */
export const DropFlowProvider = ({
  children,
  breadcrumbs,
  flowPages,
}: PropsWithChildren<DropFlowProviderProps>) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const onNext = () => {
    if (currentPageIndex + 1 < flowPages.length) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const onPrevious = () => {
    if (currentPageIndex - 1 > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const values = {
    currentPageIndex,
    flowPages,
    breadcrumbs,
    onNext,
    onPrevious,
    currentFlowPage: flowPages[currentPageIndex],
  };

  return <DropFlowContext.Provider value={values}>{children}</DropFlowContext.Provider>;
};

export const useDropFlowContext = () => useContext(DropFlowContext);
