import { DropSummary } from '../DropSummary';

import { useCreateTokenDropContext } from './CreateTokenDropContext';

export const CreateTokenDropSummary = () => {
  const { getSummaryData, getPaymentData } = useCreateTokenDropContext();
  const summaryData = getSummaryData();
  const paymentData = getPaymentData();

  return <DropSummary paymentData={paymentData} summaryData={summaryData} />;
};
