import { Box, HStack, Input, Text, VStack } from '@chakra-ui/react';

import { FormControlComponent } from '@/components/FormControl';

import { type TicketInfoFormMetadata } from './CreateTicketsForm';

interface TicketPriceSelectorProps {
  errors: Record<string, string>;
  currentTicket: TicketInfoFormMetadata;
  setCurrentTicket: (ticket: TicketInfoFormMetadata) => void;
}

export default function TicketPriceSelector({
  errors,
  currentTicket,
  setCurrentTicket,
}: TicketPriceSelectorProps) {
  const presetPrices = [0, 5, 10, 50];

  const handlePresetPriceClick = (price: number) => {
    setCurrentTicket({ ...currentTicket, price: String(price) });
  };

  const handleCustomPriceChange = (e: any) => {
    setCurrentTicket({ ...currentTicket, price: e.target.value });
  };

  return (
    <FormControlComponent errorText={errors.price} label="Price per ticket (NEAR)*">
      <VStack alignItems="flex-start">
        <HStack justifyContent="space-between" width="100%">
          {presetPrices.map((price) => (
            <Box
              key={price}
              alignItems="center"
              border="2px solid transparent"
              borderRadius="12px"
              color={currentTicket.price === String(price) ? 'blue.500' : 'gray.500'}
              display="flex"
              height="40px"
              justifyContent="center"
              sx={{
                bg:
                  currentTicket.price === String(price)
                    ? 'linear-gradient(to bottom, var(--chakra-colors-blue-100), var(--chakra-colors-blue-100)) padding-box, linear-gradient(0deg, rgba(255,207,234,1) 0%, rgba(182,232,247,1) 100%) border-box'
                    : 'gray.100', // Selected item background
                cursor: 'pointer',
                ':hover': {
                  background:
                    'linear-gradient(to bottom, var(--chakra-colors-blue-100), var(--chakra-colors-blue-100)) padding-box, linear-gradient(0deg, rgba(255,207,234,1) 0%, rgba(182,232,247,1) 100%) border-box',
                },
              }}
              width="15%"
              onClick={() => {
                handlePresetPriceClick(price);
              }}
            >
              {price}
            </Box>
          ))}
          <Input
            key="custom"
            _hover={{
              borderColor: 'blue.500 !important', // Change to your preferred border color on hover
            }}
            border="2px solid transparent"
            borderRadius="12px"
            color={presetPrices.includes(Number(currentTicket.price)) ? 'gray.500' : 'blue.500'}
            height="40px"
            id="customPriceInput"
            placeholder="Custom"
            size="md"
            sx={{
              bg: !presetPrices.includes(Number(currentTicket.price))
                ? 'linear-gradient(to bottom, var(--chakra-colors-blue-100), var(--chakra-colors-blue-100)) padding-box, linear-gradient(0deg, rgba(255,207,234,1) 0%, rgba(182,232,247,1) 100%) border-box'
                : 'gray.100', // Selected item background
            }}
            textAlign="center"
            value={presetPrices.includes(Number(currentTicket.price)) ? '' : currentTicket.price}
            width="30%"
            onChange={handleCustomPriceChange}
          />
        </HStack>
        <Text color="gray.400" fontSize="sm" fontWeight="400">
          {parseInt(currentTicket.price) > 0
            ? `You receive ${parseInt(currentTicket.price) - 0.15} NEAR. Buyer pays ${parseInt(
                currentTicket.price,
              )} NEAR.`
            : `Ticket is free`}
        </Text>
      </VStack>
    </FormControlComponent>
  );
}
