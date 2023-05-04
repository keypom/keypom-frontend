import {
  Box,
  Button,
  Flex,
  FormControl,
  HStack,
  Input,
  Text,
  useNumberInput,
  VStack,
} from '@chakra-ui/react';
import { type ControllerFieldState, type ControllerRenderProps } from 'react-hook-form';
import { formatNearAmount, type ProtocolReturnedPublicSaleConfig } from 'keypom-js';

import { type EventMetadata } from '../types/common';

interface TicketCardProps {
  name: string;
  field: ControllerRenderProps<Record<string, EventMetadata>, `${string}.${number}.value`>;
  fieldState: ControllerFieldState;
  ticketName: string;
  ticketPrice: ProtocolReturnedPublicSaleConfig['price_per_key'];
}

export const TicketCard = ({
  name,
  field,
  fieldState,
  ticketName,
  ticketPrice,
}: TicketCardProps) => {
  const { getIncrementButtonProps, getDecrementButtonProps, getInputProps } = useNumberInput({
    min: 0,
    value: field.value,
    onChange: (_, valueAsNumber) => {
      field.onChange(valueAsNumber);
    },
  });

  const amountInNEAR = ticketPrice ? formatNearAmount(ticketPrice, 4) : 0;

  return (
    <FormControl>
      <Flex flexDir="column" w="full">
        <Box
          bg="white"
          borderRadius={{ base: '1rem', md: '4xl' }}
          boxShadow="md"
          mb="4"
          minH="120px"
          p="2"
          pb="2"
        >
          <VStack py="2">
            <Text size="lg">{ticketName}</Text>
            <Text>{amountInNEAR} NEAR</Text>
          </VStack>
        </Box>
        <HStack justify="center">
          <Button {...getDecrementButtonProps()}>-</Button>
          <Input {...getInputProps()} {...field} bg="white" name={name} />
          <Button {...getIncrementButtonProps()}>+</Button>
        </HStack>
      </Flex>
    </FormControl>
  );
};
