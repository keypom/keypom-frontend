import { DropSummary } from '@/features/create-drop/components/DropSummary';

import { useCreateTokenDropContext } from '../../contexts/CreateTokenDropContext';

export const CreateTokenDropSummary = () => {
  const { getSummaryData, getPaymentData, createLinksSWR } = useCreateTokenDropContext();
  const summaryData = getSummaryData();
  const paymentData = getPaymentData();
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
