import { createContext, type PropsWithChildren, useContext } from 'react';

import { type IBreadcrumbItem } from '@/components/Breadcrumbs';
import { useSteps } from '@/hooks/useSteps';
import { type IFlowPage } from '@/types/common';

interface DropFlowProviderProps {
  flowPages: IFlowPage[];
  breadcrumbs: IBreadcrumbItem[];
}

interface DropFlowContextProps {
  currentPageIndex: number;
  flowPages?: IFlowPage[];
  breadcrumbs: IBreadcrumbItem[];
  onNext?: () => void;
  onPrevious?: () => void;
  currentFlowPage: IFlowPage;
}

const DropFlowContext = createContext<DropFlowContextProps>({
  currentPageIndex: 0,
  flowPages: undefined,
  breadcrumbs: [],
  onNext: undefined,
  onPrevious: undefined,
  currentFlowPage: {
    name: '',
    component: <></>,
    description: '',
  },
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
  const {
    onNext,
    onPrevious,
    currentIndex: currentPageIndex,
  } = useSteps({ maxSteps: flowPages.length });

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
