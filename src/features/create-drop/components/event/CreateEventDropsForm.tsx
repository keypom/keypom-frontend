import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { AddIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';

import { IconBox } from '@/components/IconBox';
import { FormControl } from '@/components/FormControl';
import { LinkIcon } from '@/components/Icons';
import { useDropFlowContext } from '@/features/create-drop/contexts';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';

import { CreateTicketDrawer } from './CreateTicketDrawer';

// const { defaultWallet } = getConfig();

export const CreateEventDropsForm = () => {
  const [totalCost, setTotalCost] = useState(0);
  const [totalLinks, setTotalLinks] = useState(0);
  const { account } = useAuthWalletContext();

  const { onNext } = useDropFlowContext();
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

  const handleSubmitClick = () => {
    console.log('submit');
  };

  const getEstimatedCost = async () => {
    await Promise.all(
      tickets.map(async () => {
        const { requiredDeposit } = await createDrop({
          wallet: await window.selector.wallet(),
          depositPerUseNEAR: amountPerLink,
          numKeys: totalLinks,
          returnTransactions: true,
        });
      }),
    );
  };

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
              name: '',
              description: '',
              salesStartDate: '2023-03-31T02:00',
              salesEndDate: '2023-03-31T02:02',
              numberOfTickets: '',
            });
            onOpen();
          }}
        >
          Add a ticket
        </Button>

        <Box mt="10">
          {tickets.map((ticket, index) => (
            <Card
              key={fields[index]?.id}
              // border="2px solid black"
              // borderRadius="8xl"
              minH="200px"
              my="4"
              p="4"
              textAlign="left"
              w="full"
            >
              <CardHeader>
                <Heading size="sm">{ticket.name}</Heading>
              </CardHeader>
              <CardBody>
                <Text>Number of tickets: {ticket.numberOfTickets}</Text>
                {ticket.description && <Text>Description: {ticket.description}</Text>}
                <Text>
                  Sales period: {ticket.salesStartDate} - {ticket.salesStartDate}
                </Text>
              </CardBody>
              <Divider />
              <CardFooter>
                <Stack direction="row" justify="flex-end" w="full">
                  <Button variant="secondary">Edit</Button>
                  <Button
                    colorScheme="red"
                    ml="3"
                    variant="outline"
                    onClick={() => {
                      removeTicket(index);
                    }}
                  >
                    Remove
                  </Button>
                </Stack>
              </CardFooter>
            </Card>
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
        ticketIndex={fields.length - 1}
        onCancel={() => {
          removeTicket(fields.length - 1);
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
