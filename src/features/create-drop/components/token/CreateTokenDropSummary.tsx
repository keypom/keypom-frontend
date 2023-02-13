import useSWR from 'swr';
import { DropSummary } from '@/features/create-drop/components/DropSummary';

import { useCreateTokenDropContext } from '../../contexts/CreateTokenDropContext';

export const CreateTokenDropSummary = () => {
  const { getSummaryData, getPaymentData, createLinksSWR } = useCreateTokenDropContext();

  const { data: paymentData, error, isLoading } = useSWR('drops/token/new', getPaymentData);
  if (error) {
    console.warn(error)
    return <div>failed to load</div>
  }
  if (isLoading) return <div>loading...</div>

  const summaryData = getSummaryData();
  const { data, handleDropConfirmation } = createLinksSWR;

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
