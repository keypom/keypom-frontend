// Generic drop flow
// Moves one component to one another

import { useDropFlowContext } from '../contexts/DropFlowContext';

import { CreateTicketDropLayout } from './CreateTicketDropLayout';

// Flow controller component for navigating pages
export const CreateTicketDropFlow = () => {
  const {
    currentFlowPage: { component },
  } = useDropFlowContext();

  return <CreateTicketDropLayout>{component}</CreateTicketDropLayout>;
};
