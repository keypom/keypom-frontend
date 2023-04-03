import useSWR from 'swr';
import { DropSummary } from '@/features/create-drop/components/DropSummary';
import { useCreateTicketDropContext } from '@/features/create-drop/contexts/CreateTicketDropContext/CreateTicketDropContext';

export const CreateTicketDropSummary = () => {
  const { getSummaryData, getPaymentData, createLinksSWR } = useCreateTicketDropContext();
  const { data, handleDropConfirmation } = createLinksSWR;

  const { data: paymentData, error, isLoading } = useSWR('drop/nft/new', getPaymentData);
  if (error) {
    console.warn(error);
    return <div>failed to load</div>;
  }
  if (isLoading) return <div>loading...</div>;

  return (
    <DropSummary
      confirmButtonText="Create links"
      data={data}
      paymentData={paymentData}
      summaryData={getSummaryData()}
      onConfirmClick={() => handleDropConfirmation(paymentData)}
    />
  );
};
