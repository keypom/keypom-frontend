import { Box, Button, Flex, Heading, Show, SimpleGrid, Text } from '@chakra-ui/react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { addKeys, addToBalance, formatNearAmount, generateKeys, getUserBalance } from 'keypom-js';
import { DateTime } from 'luxon';
import { useEffect } from 'react';
import BN from 'bn.js';

import { IconBox } from '@/components/IconBox';
import { set } from '@/utils/localStorage';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import { PENDING_TICKET_PURCHASE } from '@/constants/common';

import { type EventMetadata } from '../types/common';

import { TicketCard } from './TicketCard';

interface EventCardProps {
  ticketArray: EventMetadata[];
}

export const EventCard = ({ ticketArray = [] }: EventCardProps) => {
  /** to delete */
  const { accountId } = useAuthWalletContext();

  useEffect(() => {
    const getBalance = async () => {
      console.log('userbalance:', formatNearAmount(await getUserBalance({ accountId }), 4));
    };
    getBalance();
  }, []);
  /** ** */

  // event details
  const eventId = `${ticketArray[0].eventId}`;
  const { config: { sale: { start = undefined, end = undefined } } = { sale: {} } } =
    ticketArray[0];
  const time =
    !start || !end
      ? `undefined date`
      : `${DateTime.fromMillis(start).toLocaleString(DateTime.DATETIME_SHORT)}
   - 
   ${DateTime.fromMillis(end).toLocaleString(DateTime.DATETIME_SHORT)}`;

  const { handleSubmit, control, getValues } = useForm({
    defaultValues: {
      [eventId]: ticketArray.map((ticket) => ({
        dropId: ticket.drop_id,
        ticketId: `${ticket.eventId}`,
        ticketName: `${ticket.dropName}`,
        value: 0,
        ...ticket,
      })),
    },
  });
  const { fields } = useFieldArray({
    control,
    name: eventId,
  });

  const handleOnSubmit = async () => {
    const wallet = await window.selector.wallet();

    let totalAmount = new BN(0);
    const currentDropPrice = [];
    const currentPk: string[][] = [];
    const currentSk: string[][] = [];
    const currentDropId: string[] = [];
    await Promise.all(
      getValues(eventId).map(async (field) => {
        const { value, dropId, next_key_id, config: { sale: { price_per_key } } = {} } = field;

        if (!value || value === 0) return {};

        const { publicKeys, secretKeys } = await generateKeys({
          numKeys: value,
          rootEntropy: `${dropId as string}`,
          autoMetaNonceStart: next_key_id,
        });

        const totalPrice = new BN(price_per_key).mul(new BN(value));

        return {
          publicKeys,
          secretKeys,
          totalPrice,
          ...(await addKeys({
            wallet,
            publicKeys,
            dropId,
            extraDepositYocto: totalPrice,
            numKeys: publicKeys.length,
            returnTransactions: true,
          })),
        };
      }),
    ).then(async (transactions) => {
      console.log('transactions', transactions);
      transactions.forEach((tx) => {
        const {
          requiredDeposit = 0,
          publicKeys = [],
          secretKeys = [],
          dropId = '',
          totalPrice = new BN(0),
        } = tx;
        if (requiredDeposit !== 0 && publicKeys.length > 0 && secretKeys.length > 0 && dropId) {
          totalAmount = totalAmount.add(new BN(requiredDeposit));

          currentDropPrice.push(formatNearAmount(totalPrice.toString(), 4));
          currentPk.push(publicKeys);
          currentSk.push(secretKeys);
          currentDropId.push(dropId);
        }
      });

      console.log('totalAmount', totalAmount, totalAmount.toString());
      const pendingTicketPurchase = {
        publicKeys: currentPk,
        secretKeys: currentSk,
        dropIds: currentDropId,
        dropPrices: currentDropPrice,
      };
      set(PENDING_TICKET_PURCHASE, pendingTicketPurchase);
      await addToBalance({
        wallet,
        amountYocto: totalAmount.toString(),
        successUrl: `${window.location.origin}/events/${accountId}/pending`,
      });
    });
  };

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)}>
      <IconBox
        borderRadius={{ base: '1rem', md: '8xl' }}
        overflow="hidden"
        p="0"
        pb="0"
        position="relative"
        w="full"
      >
        <Show above="md">
          <Box
            bg="linear-gradient(180deg, rgba(255, 207, 234, 0) 0%, #30c9f34b 100%)"
            bottom="-123px"
            filter="blur(100px)"
            h="793px"
            overflow="hidden"
            position="absolute"
            right="-123px"
            transform="rotate(30deg)"
            w="606px"
            zIndex="1"
          />
        </Show>
        <Flex
          flexDir="column"
          position="relative"
          px={{ base: '8', md: '16' }}
          py={{ base: '8', md: 'auto' }}
          zIndex="2"
        >
          <Flex
            flex={{ base: 'auto', md: '1' }}
            flexDir="column"
            justify="center"
            mb="8"
            overflow="hidden"
            position="relative"
            textAlign="left"
          >
            <Heading>{ticketArray[0].eventName}</Heading>
            <Text>{time}</Text>
          </Flex>
          <SimpleGrid columns={3} mb="4" spacingX="40px" spacingY="40px">
            {fields.map((item, index) => {
              const FIELD_NAME = `${eventId}.${index}.value` as const;
              return (
                <Controller
                  key={item.id}
                  control={control}
                  name={FIELD_NAME}
                  render={({ field, fieldState }) => (
                    <TicketCard
                      field={field}
                      fieldState={fieldState}
                      name={FIELD_NAME}
                      ticketName={item.ticketName}
                      ticketPrice={item.config.sale.price_per_key}
                    />
                  )}
                />
              );
            })}
          </SimpleGrid>
          <Flex justify="center" mt="12">
            <Button type="submit" w="full">
              Buy
            </Button>
          </Flex>
        </Flex>
      </IconBox>
    </form>
  );
};
