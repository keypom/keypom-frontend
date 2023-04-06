import { useEffect, useState } from 'react';
import { Box, Spinner } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

import { DropSummary } from '@/features/create-drop/components/DropSummary';
import { useCreateEventDropsContext } from '@/features/create-drop/contexts/CreateEventDropsContext';
import { type PaymentData } from '@/features/create-drop/types/types';
import { TicketCard } from '@/features/create-drop/components/TicketCard/TicketCard';

export const CreateEventDropsSummary = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<PaymentData>();
  const { getSummaryData, getPaymentData, handleCreateDrops } = useCreateEventDropsContext();
  const { getValues } = useFormContext();

  const summaryData = getSummaryData();

  useEffect(() => {
    const fetchPaymentData = async () => {
      const data = await getPaymentData();
      setPaymentData(data);
      setIsLoading(false);
    };
    fetchPaymentData();
  }, []);

  if (isLoading && !paymentData)
    return (
      <Box>
        <Spinner />
      </Box>
    );

  const tickets = getValues('tickets');

  return (
    <DropSummary
      confirmButtonText="Create event"
      paymentData={paymentData as PaymentData}
      summaryData={summaryData}
      onConfirmClick={handleCreateDrops}
    >
      {tickets.map((ticket, index) => (
        <TicketCard key={index} id={index} ticket={ticket} />
      ))}
    </DropSummary>
  );
};
