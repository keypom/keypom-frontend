import { createContext, type PropsWithChildren, useContext } from 'react';

import { type IBreadcrumbItem } from '@/components/Breadcrumbs';
import { useSteps } from '@/hooks/useSteps';
import { type IFlowPage } from '@/types/common';

interface TicketDropFlowProviderProps {
  flowPages: IFlowPage[];
  breadcrumbs: IBreadcrumbItem[];
}

interface TicketDropFlowContextProps {
  currentPageIndex: number;
  flowPages?: IFlowPage[];
  breadcrumbs: IBreadcrumbItem[];
  onNext?: () => void;
  onPrevious?: () => void;
  currentFlowPage: IFlowPage;
}

const TicketDropFlowContext = createContext<TicketDropFlowContextProps>({
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
export const TicketDropFlowProvider = ({
  children,
  breadcrumbs,
  flowPages,
}: PropsWithChildren<TicketDropFlowProviderProps>) => {
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

  return <TicketDropFlowContext.Provider value={values}>{children}</TicketDropFlowContext.Provider>;
};

export const useTicketDropFlowContext = () => useContext(TicketDropFlowContext);
