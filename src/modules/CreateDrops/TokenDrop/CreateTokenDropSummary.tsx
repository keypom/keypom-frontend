import useSWR from 'swr';
import { DropSummary } from '../DropSummary';

import { useCreateTokenDropContext } from './CreateTokenDropContext';
import { useRouter } from 'next/router';

export const CreateTokenDropSummary = () => {
  const { getSummaryData, getPaymentData, createLinksSWR } = useCreateTokenDropContext();
  const router = useRouter();

  const summaryData = getSummaryData();
  const { data: paymentData, error, isLoading } = useSWR('drops/token/new', getPaymentData);
  if (error) {
    console.warn(error)
    return <div>failed to load</div>
  }
  if (isLoading) return <div>loading...</div>

  const { data, handleDropConfirmation } = createLinksSWR;

  console.log('SWR DATA', data)

  return (
    <DropSummary
      confirmButtonText="Create links"
      data={data}
      paymentData={paymentData}
      summaryData={summaryData}
      onConfirmClick={() => handleDropConfirmation(router)}
    />
  );
};
