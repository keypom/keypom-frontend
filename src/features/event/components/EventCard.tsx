import { Button, Flex, Heading, Text } from '@chakra-ui/react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { addKeys, addToBalance, formatNearAmount, generateKeys } from 'keypom-js';
import BN from 'bn.js';

import { set } from '@/utils/localStorage';
import { PENDING_TICKET_PURCHASE } from '@/constants/common';
import { formatSaleDate } from '@/utils/formatSaleDate';
import { DataTable } from '@/components/Table';

import { type EventMetadata } from '../types/common';

import { TicketCard } from './TicketCard';
import { eventTableColumn } from './TableColumn';

interface EventCardProps {
  ticketArray: EventMetadata[];
}

export const EventCard = ({ ticketArray = [] }: EventCardProps) => {
  // event details
  const eventId = `${ticketArray[0].eventId}`;

  const { handleSubmit, control, getValues, watch } = useForm({
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
    const currentDropPrice: string[] = [];
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

  const getTableRows = (data) => {
    if (data === undefined) return [];

    return fields.map((item, index) => {
      const {
        config: {
          sale: { price_per_key = 0, max_num_keys = undefined, start = undefined, end = undefined },
        } = {
          sale: {},
        },
      } = item;
      const time = !start || !end ? 'Available now' : formatSaleDate(start, end);

      const FIELD_NAME = `${eventId}.${index}.value` as const;

      return {
        id: item.id,
        ticket: (
          <>
            <Text fontWeight="500">{item.ticketName}</Text>
            <Text overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
              {item.description || ''}
            </Text>
          </>
        ),
        date: time,
        quantity: max_num_keys || 'Infinite',
        price: formatNearAmount(price_per_key, 4),
        action: (
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
                ticketPrice={item?.config?.sale?.price_per_key}
              />
            )}
          />
        ),
      };
    });
  };

  const totalTicketsPrice = watch()[eventId].reduce((acc, currentItem) => {
    const {
      config: {
        sale: { price_per_key = '0' },
      },
      value,
    } = currentItem;

    const ticketsPrice = (formatNearAmount(price_per_key, 4) as number) * value;

    return acc + ticketsPrice;
  }, 0);

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)}>
      <Heading mb="4">{ticketArray[0].eventName}</Heading>

      <DataTable
        columns={eventTableColumn}
        data={getTableRows(ticketArray)}
        layout="fixed"
        showColumns={true}
        size="sm"
        variant="tertiary"
      />
      <Flex justify="flex-end" mt="4">
        <Button type="submit">{`Buy ${totalTicketsPrice.toPrecision(3)} NEAR`}</Button>
      </Flex>
    </form>
  );
};
