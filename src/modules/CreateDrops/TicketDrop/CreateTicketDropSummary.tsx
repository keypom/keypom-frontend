import { DropSummary } from '../DropSummary';

import { useCreateTicketDropContext } from './CreateTicketDropContext/CreateTicketDropContext';

export const CreateTicketDropSummary = () => {
  const contextData = useCreateTicketDropContext();
  const summaryData = contextData.getSummaryData();
  const paymentData = contextData.getPaymentData();
  const { data, handleDropConfirmation } = contextData.createLinksSWR;

  return (
    <DropSummary
      confirmButtonText="Create links"
      data={data}
      paymentData={paymentData}
      summaryData={summaryData}
      onConfirmClick={handleDropConfirmation}
    />
  );
};
