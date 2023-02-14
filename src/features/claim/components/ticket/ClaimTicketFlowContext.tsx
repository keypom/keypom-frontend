import { type PropsWithChildren, createContext, useContext, useState } from 'react';

import { type IFlowPage } from '@/types/common';

interface ClaimTicketFlowContextProps {
  flowPages: IFlowPage[];
}

interface ClaimTicketFlowContextType extends ClaimTicketFlowContextProps {
  currentPageIndex: number;
  onNext: () => void;
  onPrevious: () => void;
  currentFlowPage: IFlowPage;
}

const ClaimTicketFlowContext = createContext<ClaimTicketFlowContextType>({
  currentPageIndex: 0,
  flowPages: [
    {
      name: '',
      description: '',
      component: <></>,
    },
  ],
  onNext: function (): void {
    throw new Error('Function not implemented.');
  },
  onPrevious: function (): void {
    throw new Error('Function not implemented.');
  },
  currentFlowPage: {
    name: '',
    description: '',
    component: <></>,
  },
});

export const ClaimTicketFlowProvider = ({
  flowPages,
  children,
}: PropsWithChildren<ClaimTicketFlowContextProps>) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const onNext = () => {
    if (currentPageIndex + 1 < flowPages.length) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const onPrevious = () => {
    if (currentPageIndex - 1 >= 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };
  return (
    <ClaimTicketFlowContext.Provider
      value={{
        currentPageIndex,
        flowPages,
        onNext,
        onPrevious,
        currentFlowPage: flowPages[currentPageIndex],
      }}
    >
      {children}
    </ClaimTicketFlowContext.Provider>
  );
};

export const useClaimTicketFlow = (): ClaimTicketFlowContextType => {
  const context = useContext(ClaimTicketFlowContext);

  if (context === null) {
    throw new Error('useClaimTicketFlow must be used within a ClaimTicketFlowContextProvider');
  }

  return context;
};
