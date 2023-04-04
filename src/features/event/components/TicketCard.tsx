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
import { formatNearAmount } from 'keypom-js';

interface TicketCardProps {
  name: string;
  field: ControllerRenderProps<
    Record<
      string,
      Array<{
        ticketId: string;
        value: number;
      }>
    >,
    `${string}.${number}.value`
  >;
  fieldState: ControllerFieldState;
  ticketName: string;
  ticketPrice: string;
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

  const amountInNEAR = formatNearAmount(ticketPrice, 4);

  return (
    <FormControl>
      <Flex flexDir="column" w="full">
        <Box
          borderRadius={{ base: '1rem', md: '8xl' }}
          boxShadow="md"
          mb="4"
          minH="80px"
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
          <Input {...getInputProps()} {...field} name={name} />
          <Button {...getIncrementButtonProps()}>+</Button>
        </HStack>
      </Flex>
    </FormControl>
  );
};
