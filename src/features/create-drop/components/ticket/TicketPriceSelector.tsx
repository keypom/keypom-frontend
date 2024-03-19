import { Box, HStack, Input, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';

import keypomInstance from '@/lib/keypom';
import { FormControlComponent } from '@/components/FormControl';
import { yoctoPerFreeKey } from '@/lib/eventsHelpers';

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
  const [customPrice, setCustomPrice] = useState('');
  const presetPrices = [0, 5, 10, 50];

  const handleCustomPriceSubmit = () => {
    setCurrentTicket({ ...currentTicket, price: customPrice });
  };

  const handlePresetPriceClick = (price: number) => {
    setCustomPrice('');
    setCurrentTicket({ ...currentTicket, price: String(price) });
  };

  const handleCustomPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = e.target.value;
    setCustomPrice(newPrice);
  };

  return (
    <FormControlComponent
      errorText={errors.price}
      label="Price per ticket (NEAR)*"
      labelProps={{ fontSize: { base: 'xs', md: 'sm' } }}
      marginBottom="4 !important"
    >
      <VStack alignItems="flex-start">
        <HStack justifyContent="space-between" width="100%">
          <HStack width="75%">
            {presetPrices.map((price) => (
              <Box
                key={price}
                alignItems="center"
                border="2px solid transparent"
                borderRadius="5xl"
                color={currentTicket.price === String(price) ? 'blue.500' : 'gray.500'}
                display="flex"
                fontSize="sm"
                height="30px"
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
                width="20%"
                onClick={() => {
                  handlePresetPriceClick(price);
                }}
              >
                {price}
              </Box>
            ))}
          </HStack>
          <Input
            key="custom"
            _hover={{
              borderColor: 'blue.500 !important', // Change to your preferred border color on hover
            }}
            border="2px solid transparent"
            borderRadius="5xl"
            color={presetPrices.includes(Number(currentTicket.price)) ? 'gray.500' : 'blue.500'}
            height="30px"
            id="customPriceInput"
            placeholder="Custom"
            size="sm"
            sx={{
              bg: !presetPrices.includes(Number(currentTicket.price))
                ? 'linear-gradient(to bottom, var(--chakra-colors-blue-100), var(--chakra-colors-blue-100)) padding-box, linear-gradient(0deg, rgba(255,207,234,1) 0%, rgba(182,232,247,1) 100%) border-box'
                : 'gray.100', // Selected item background
            }}
            textAlign="center"
            type="number"
            value={customPrice}
            width="30%"
            onBlur={handleCustomPriceSubmit}
            onChange={handleCustomPriceChange}
          />
        </HStack>
        <Text color="gray.400" fontSize="xs" fontWeight="400" marginTop="0 !important">
          {parseInt(currentTicket.price) > 0
            ? `You receive ${
                parseInt(currentTicket.price) -
                parseFloat(keypomInstance.yoctoToNear(yoctoPerFreeKey().toString()))
              } NEAR. Buyer pays ${parseInt(currentTicket.price)} NEAR.`
            : `Ticket is free`}
        </Text>
      </VStack>
    </FormControlComponent>
  );
}
