import useSWR from 'swr';

import { DropSummary } from '@/features/create-drop/components/DropSummary';

import { useCreateNftDrop } from '../../contexts/CreateNftDropContext';

export const CreateNftDropSummary = () => {
  const { getSummaryData, getPaymentData, createLinksSWR } = useCreateNftDrop();
  const summaryData = getSummaryData();

  const { data: paymentData, error, isLoading } = useSWR('drop/nft/new', getPaymentData);
  if (error) {
    console.warn(error);
    return <div>failed to load</div>;
  }
  if (isLoading) return <div>loading...</div>;

  const { data, handleDropConfirmation } = createLinksSWR;

  return (
    <DropSummary
      confirmButtonText="Pay and create links"
      data={data}
      paymentData={paymentData!}
      summaryData={summaryData}
      onConfirmClick={() => {
        handleDropConfirmation(paymentData!);
      }}
    />
  );
};
