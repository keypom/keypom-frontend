import { DropSummary } from '@/features/create-drop/components/DropSummary';

import { useCreateNftDrop } from '../../contexts/CreateNftDropContext';

export const CreateNftDropSummary = () => {
  const { getSummaryData, getPaymentData, createLinksSWR } = useCreateNftDrop();
  const summaryData = getSummaryData();
  const paymentData = getPaymentData();
  const { data, handleDropConfirmation } = createLinksSWR;

  return (
    <DropSummary
      confirmButtonText="Pay and create links"
      data={data}
      paymentData={paymentData}
      summaryData={summaryData}
      onConfirmClick={handleDropConfirmation}
    />
  );
};
