import { useClaimTicketFlow } from './ClaimTicketFlowContext';

export const ClaimTicketFlow = () => {
  const {
    currentFlowPage: { component },
  } = useClaimTicketFlow();

  return <>{component}</>;
};
