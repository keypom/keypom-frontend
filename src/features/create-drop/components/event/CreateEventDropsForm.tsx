import { Box, Button, Flex, Input, useDisclosure } from '@chakra-ui/react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { AddIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';

import { IconBox } from '@/components/IconBox';
import { FormControl } from '@/components/FormControl';
import { LinkIcon } from '@/components/Icons';
import { useDropFlowContext } from '@/features/create-drop/contexts';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import { TicketCard } from '@/features/create-drop/components/TicketCard/TicketCard';

import { CreateTicketDrawer } from './CreateTicketDrawer';

// const { defaultWallet } = getConfig();

export const CreateEventDropsForm = () => {
  const [totalCost, setTotalCost] = useState(0);
  const [totalLinks, setTotalLinks] = useState(0);
  const [modalTicketIndex, setTicketIndex] = useState<number>(0);
  const [modalAction, setModalAction] = useState('create');
  const { onNext } = useDropFlowContext();
  const { account } = useAuthWalletContext();
  const {
    setValue,
    handleSubmit,
    control,
    watch,
    getValues,
    formState: { isDirty, isValid },
  } = useFormContext();

  const {
    fields,
    append,
    remove: removeTicket,
  } = useFieldArray({
    control,
    name: 'tickets',
  });

  const tickets = watch('tickets');

  const { isOpen, onClose, onOpen } = useDisclosure();

  const calcTotalCost = async () => {
    setTotalCost(0);
    // calculate all drops cost in this event
  };

  useEffect(() => {
    calcTotalCost();
  }, [totalLinks]);

  const handleSubmitClick = (data) => {
    onNext?.();
  };

  // const getEstimatedCost = async () => {
  //   await Promise.all(
  //     tickets.map(async () => {
  //       const { requiredDeposit } = await createDrop({
  //         wallet: await window.selector.wallet(),
  //         depositPerUseNEAR: amountPerLink,
  //         numKeys: totalLinks,
  //         returnTransactions: true,
  //       });
  //     }),
  //   );
  // };

  return (
    <IconBox
      icon={<LinkIcon h={{ base: '7', md: '9' }} />}
      maxW={{ base: '21.5rem', md: '36rem' }}
      mx="auto"
    >
      <form onSubmit={handleSubmit(handleSubmitClick)}>
        <Controller
          control={control}
          name="eventName"
          render={({ field, fieldState: { error } }) => {
            return (
              <FormControl errorText={error?.message} label="Event name">
                <Input
                  isInvalid={Boolean(error?.message)}
                  placeholder="NEARCon 2023"
                  type="text"
                  {...field}
                />
              </FormControl>
            );
          }}
        />

        <Button
          leftIcon={<AddIcon />}
          w="full"
          onClick={() => {
            append({
              name: 'Test ticket ',
              description: 'this is an awesome event',
              salesStartDate: '2023-04-01T00:00',
              salesEndDate: '2023-04-28T00:00',
              nearPricePerTicket: '1.5',
              numberOfTickets: '10',
            });
            setModalAction('create');
            setTicketIndex(fields.length);
            onOpen();
          }}
        >
          Add a ticket
        </Button>

        <Box mt="10">
          {tickets.map((ticket, index) => (
            <TicketCard
              key={fields?.[index]?.id}
              id={fields?.[index]?.id}
              ticket={ticket}
              onEditClick={() => {
                setTicketIndex(index);
                setModalAction('update');
                onOpen();
              }}
              onRemoveClick={() => {
                removeTicket(index);
              }}
            />
          ))}
        </Box>

        <Flex justifyContent="flex-end">
          <Button disabled={fields.length === 0 || !isDirty || !isValid} mt="10" type="submit">
            Continue to summary
          </Button>
        </Flex>
      </form>

      <CreateTicketDrawer
        isOpen={isOpen}
        ticketIndex={modalTicketIndex}
        onCancel={() => {
          console.log(modalAction);
          if (modalAction === 'create') {
            removeTicket(modalTicketIndex);
          }
          window.setTimeout(() => {
            onClose();
          }, 0);
        }}
        onClose={onClose}
      />
    </IconBox>
  );
};

/**
 * drop metadata
 * --------------
 * event id, event name, drop name, wallets
 * event id: 'drop name - event id'
 */
