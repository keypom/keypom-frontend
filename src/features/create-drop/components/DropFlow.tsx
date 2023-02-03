// Generic drop flow
// Moves one component to one another

import { useDropFlowContext } from '../contexts/DropFlowContext';

import { DropLayout } from './DropLayout';

// Flow controller component for navigating pages
export const DropFlow = () => {
  const {
    currentFlowPage: { component },
  } = useDropFlowContext();

  return <DropLayout>{component}</DropLayout>;
};
