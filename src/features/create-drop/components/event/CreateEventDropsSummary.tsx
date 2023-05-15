import { useEffect, useState } from 'react';
import { Box, FormLabel, ListItem, OrderedList, Spinner } from '@chakra-ui/react';
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

  const [tickets, questions] = getValues(['tickets', 'questions']);

  console.log(getValues());

  return (
    <DropSummary
      confirmButtonText="Create event"
      paymentData={paymentData as PaymentData}
      summaryData={summaryData}
      onConfirmClick={handleCreateDrops}
    >
      <FormLabel>Your tickets</FormLabel>
      {tickets.map((ticket, index) => (
        <TicketCard key={index} id={index} ticket={ticket} />
      ))}
      {questions.length > 0 && (
        <>
          <FormLabel mt="10">Your Questions</FormLabel>
          <OrderedList textAlign="left">
            {questions
              .filter((q) => q.isSelected)
              .map((q) => (
                <ListItem key={q.id}>{q.text}</ListItem>
              ))}
          </OrderedList>
        </>
      )}
    </DropSummary>
  );
};
