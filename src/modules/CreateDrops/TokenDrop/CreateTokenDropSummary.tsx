import { DropSummary } from '../DropSummary';

import { useCreateTokenDropContext } from './CreateTokenDropContext';

export const CreateTokenDropSummary = () => {
  const { getSummaryData, getPaymentData, createLinksSWR } = useCreateTokenDropContext();
  const summaryData = getSummaryData();
  const paymentData = getPaymentData();
  const { data, handleDropConfirmation } = createLinksSWR;

  return (
    <DropSummary
      data={data}
      mode="token"
      paymentData={paymentData}
      summaryData={summaryData}
      onConfirmClick={handleDropConfirmation}
    />
  );
};
