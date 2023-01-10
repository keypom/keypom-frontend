import { DropSummary } from '../DropSummary';

import { useCreateNftDrop } from './CreateNftDropContext';

export const CreateNftDropSummary = () => {
  const { getSummaryData, getPaymentData, createLinksSWR } = useCreateNftDrop();
  const summaryData = getSummaryData();
  const paymentData = getPaymentData();
  const { data, handleDropConfirmation } = createLinksSWR;

  return (
    <DropSummary
      data={data}
      paymentData={paymentData}
      summaryData={summaryData}
      onConfirmClick={handleDropConfirmation}
    />
  );
};
