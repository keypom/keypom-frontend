import { DropSummary } from '@/features/create-drop/components/DropSummary';
import { useCreateTicketDropContext } from '@/features/create-drop/contexts/CreateTicketDropContext/CreateTicketDropContext';

export const CreateTicketDropSummary = () => {
  const { getSummaryData, getPaymentData, createLinksSWR } = useCreateTicketDropContext();
  const { data, handleDropConfirmation } = createLinksSWR;

  return (
    <DropSummary
      confirmButtonText="Create links"
      data={data}
      paymentData={getPaymentData()}
      summaryData={getSummaryData()}
      onConfirmClick={handleDropConfirmation}
    />
  );
};
