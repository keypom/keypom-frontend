import { Box, HStack, Input, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';

import keypomInstance from '@/lib/keypom';
import { FormControlComponent } from '@/components/FormControl';
import { yoctoPerFreeKey } from '@/lib/eventsHelpers';

import { type TicketDropFormData } from '../../routes/CreateTicketDropPage';

import { type TicketInfoFormMetadata } from './CreateTicketsForm';

interface TicketPriceSelectorProps {
  formData: TicketDropFormData;
  errors: Record<string, string>;
  currentTicket: TicketInfoFormMetadata;
  setCurrentTicket: (ticket: TicketInfoFormMetadata) => void;
}

export default function TicketPriceSelector({
  formData,
  errors,
  currentTicket,
  setCurrentTicket,
}: TicketPriceSelectorProps) {
  const [customPrice, setCustomPrice] = useState('');
  const presetPrices = [0, 5, 10, 50];

  const handleCustomPriceSubmit = () => {
    setCurrentTicket({ ...currentTicket, priceNear: customPrice });
  };

  const handlePresetPriceClick = (price: number) => {
    setCustomPrice('');
    setCurrentTicket({ ...currentTicket, priceNear: String(price) });
  };

  const handleCustomPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = e.target.value;
    setCustomPrice(newPrice);
  };

  const roundNumber = (num: number) => {
    return num.toFixed(2);
  };

  const priceMessage = () => {
    const toReceive =
      parseInt(currentTicket.priceNear) -
      parseFloat(keypomInstance.yoctoToNear(yoctoPerFreeKey().toString()));
    const buyerPays = parseInt(currentTicket.priceNear);

    const toReceiveUsd = roundNumber(toReceive * (formData.nearPrice || 1));
    const buyerPaysUsd = roundNumber(buyerPays * (formData.nearPrice || 1));

    if (parseInt(currentTicket.priceNear) > 0) {
      return `You receive ${roundNumber(toReceive)} NEAR${
        formData.nearPrice ? ` ($${toReceiveUsd})` : ''
      }. Buyer pays ${roundNumber(buyerPays)} NEAR${
        formData.nearPrice ? ` ($${buyerPaysUsd})` : ''
      }.`;
    }

    return `Ticket is free`;
  };

  return (
    <FormControlComponent
      errorText={errors.price}
      label="Price per ticket (NEAR)*"
      labelProps={{ fontSize: { base: 'xs', md: 'md' } }}
      marginY="2"
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
                color={currentTicket.priceNear === String(price) ? 'blue.500' : 'gray.500'}
                display="flex"
                fontSize={{ base: 'xs', md: 'sm' }}
                height="30px"
                justifyContent="center"
                sx={{
                  bg:
                    currentTicket.priceNear === String(price)
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
            color={presetPrices.includes(Number(currentTicket.priceNear)) ? 'gray.500' : 'blue.500'}
            height="30px"
            id="customPriceInput"
            placeholder="Custom"
            size={{ base: 'xs', md: 'sm' }}
            sx={{
              bg: !presetPrices.includes(Number(currentTicket.priceNear))
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
        <Text color="gray.400" fontSize="xs" fontWeight="400" marginTop="-2 !important">
          {priceMessage()}
        </Text>
      </VStack>
    </FormControlComponent>
  );
}
