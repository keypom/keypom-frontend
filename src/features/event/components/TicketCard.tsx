import { Button, FormControl, HStack, Input, useNumberInput } from '@chakra-ui/react';
import { type ControllerRenderProps } from 'react-hook-form';

import { type EventMetadata } from '../types/common';

interface TicketCardProps {
  name: string;
  field: ControllerRenderProps<Record<string, EventMetadata>, `${string}.${number}.value`>;
  maxValue?: number;
  isDisabled?: boolean;
}

export const TicketCard = ({ name, maxValue, isDisabled, field }: TicketCardProps) => {
  const { getIncrementButtonProps, getDecrementButtonProps, getInputProps } = useNumberInput({
    min: 0,
    max: maxValue ?? undefined,
    value: field.value,
    onChange: (_, valueAsNumber) => {
      field.onChange(valueAsNumber);
    },
  });

  return (
    <FormControl>
      <HStack justify="center">
        <Button h="12" isDisabled={isDisabled} variant="outline" {...getDecrementButtonProps()}>
          -
        </Button>
        <Input
          h="12"
          isDisabled={isDisabled}
          {...getInputProps()}
          {...field}
          bg="white"
          name={name}
        />
        <Button h="12" isDisabled={isDisabled} variant="outline" {...getIncrementButtonProps()}>
          +
        </Button>
      </HStack>
    </FormControl>
  );
};
