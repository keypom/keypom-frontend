import { Box, Button, Flex, Heading, Show, SimpleGrid, Text } from '@chakra-ui/react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { addKeys, addToBalance, formatNearAmount, generateKeys, getUserBalance } from 'keypom-js';
import { DateTime } from 'luxon';
import { useEffect } from 'react';

import { IconBox } from '@/components/IconBox';
import { get, set, del } from '@/utils/localStorage';
import { useAppContext } from '@/contexts/AppContext';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';

import { type EventMetadata } from '../types/common';

import { TicketCard } from './TicketCard';
import { setCartCheckoutModal } from './CartCheckoutModal';

interface EventCardProps {
  ticketArray: EventMetadata[];
}

export const EventCard = ({ ticketArray = [] }: EventCardProps) => {
  const { setAppModal } = useAppContext();
  const { accountId } = useAuthWalletContext();

  useEffect(() => {
    const currentDropId = get('current_cart_dropid') || '';
    const currentPk = get('current_cart_pk') || [];
    if (currentPk.length !== 0 && currentDropId.length !== 0) {
      const getBalance = async () => {
        console.log('userbalance:', formatNearAmount(await getUserBalance({ accountId }), 4));
      };
      getBalance();

      setCartCheckoutModal(
        setAppModal,
        async () => {
          const wallet = await window.selector.wallet();

          await Promise.all(
            currentPk.map(async (_, i) => {
              await addKeys({
                wallet,
                publicKeys: currentPk[i],
                dropId: currentDropId[i],
                numKeys: currentPk[i].length,
                useBalance: true,
              });
            }),
          )
            .catch(console.error)
            .finally(() => {
              console.log('deleting local storage cart');
              del('current_cart_pk');
              del('current_cart_dropid');
            });
        },
        () => {
          console.log('cancelling checkout');
          del('current_cart_pk');
          del('current_cart_dropid');
        },
      );
    }
  }, []);

  // event details
  const eventId = `${ticketArray[0].eventId}`;
  const { config: { sale: { start, end } } = { sale: {} } } = ticketArray[0];
  const time = `${DateTime.fromMillis(start).toLocaleString(
    DateTime.DATETIME_SHORT,
  )} - ${DateTime.fromMillis(end).toLocaleString(DateTime.DATETIME_SHORT)}`;

  const { handleSubmit, control, watch } = useForm({
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

    let totalAmount = 0;
    const currentPk: string[][] = [];
    const currentDropId: string[] = [];
    await Promise.all(
      watch(eventId).map(async (field) => {
        const { value, dropId, next_key_id } = field;

        const { publicKeys } = await generateKeys({
          numKeys: value,
          rootEntropy: `${dropId as string}`,
          autoMetaNonceStart: next_key_id,
        });

        return {
          publicKeys,
          ...(await addKeys({
            wallet,
            publicKeys,
            dropId,
            numKeys: publicKeys.length,
            returnTransactions: true,
          })),
        };
      }),
    ).then(async (result) => {
      console.log('result', result);
      result.forEach(({ requiredDeposit = 0, publicKeys = [], dropId = '' }) => {
        totalAmount += parseFloat(formatNearAmount(requiredDeposit as string, 4));
        currentPk.push(publicKeys);
        currentDropId.push(dropId);
      });
      console.log('totalAmount', totalAmount);
      set('current_cart_pk', currentPk);
      set('current_cart_dropid', currentDropId);
      await addToBalance({ wallet, amountNear: (totalAmount + 0.5).toString() }); // + 0.1 to prevent insufficient balance
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
          <Flex justify="flex-end">
            <Button type="submit" w="120px">
              Buy
            </Button>
          </Flex>
        </Flex>
      </IconBox>
    </form>
  );
};
