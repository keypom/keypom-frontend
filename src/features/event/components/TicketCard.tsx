import { Button, FormControl, HStack, Input, useNumberInput } from '@chakra-ui/react';
import { type ControllerFieldState, type ControllerRenderProps } from 'react-hook-form';
import { type ProtocolReturnedPublicSaleConfig } from 'keypom-js';

import { type EventMetadata } from '../types/common';

interface TicketCardProps {
  name: string;
  field: ControllerRenderProps<Record<string, EventMetadata>, `${string}.${number}.value`>;
  fieldState: ControllerFieldState;
  ticketName: string;
  ticketPrice: ProtocolReturnedPublicSaleConfig['price_per_key'];
}

export const TicketCard = ({ name, field }: TicketCardProps) => {
  const { getIncrementButtonProps, getDecrementButtonProps, getInputProps } = useNumberInput({
    min: 0,
    value: field.value,
    onChange: (_, valueAsNumber) => {
      field.onChange(valueAsNumber);
    },
  });

  return (
    <FormControl>
      <HStack justify="center">
        <Button h="12" variant="outline" {...getDecrementButtonProps()}>
          -
        </Button>
        <Input h="12" {...getInputProps()} {...field} bg="white" name={name} />
        <Button h="12" variant="outline" {...getIncrementButtonProps()}>
          +
        </Button>
      </HStack>
    </FormControl>
  );
};
