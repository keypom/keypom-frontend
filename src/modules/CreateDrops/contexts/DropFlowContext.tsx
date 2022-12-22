import React, { createContext, PropsWithChildren, useContext, useReducer } from 'react';

import { IBreadcrumbItem } from '@/common/components/Breadcrumbs';

import { IFlowPage } from '../types/types';

interface IState {
  currentPageIndex: number;
  maxPages: number;
}

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

const dropFlowReducer = (state: IState, action): IState => {
  const { type, payload } = action;

  switch (type) {
    case 'SET_MAX_PAGES':
      return { ...state, maxPages: payload };
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPageIndex: payload };
    default:
      return state;
  }
};

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
  const initialState: IState = {
    currentPageIndex: 0,
    maxPages: flowPages.length,
  };

  const [state, dispatch] = useReducer(dropFlowReducer, initialState);
  const { currentPageIndex, maxPages } = state;

  const onNext = () => {
    if (currentPageIndex + 1 < maxPages) {
      dispatch({ type: 'SET_CURRENT_PAGE', payload: currentPageIndex + 1 });
    }
  };

  const onPrevious = () => {
    if (currentPageIndex - 1 > 0) {
      dispatch({ type: 'SET_CURRENT_PAGE', payload: currentPageIndex - 1 });
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
