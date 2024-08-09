import { Box, HStack, Input, VStack } from '@chakra-ui/react';
import { useState } from 'react';

import { FormControlComponent } from '@/components/FormControl';
import { CreatedDropForm } from './CreateDropModal';

interface DropTokenAmountSelectorProps {
  errors: any;
  currentDrop: CreatedDropForm;
  setCurrentDrop: (drop: CreatedDropForm) => void;
}

export default function DropTokenAmountSelector({
  errors,
  currentDrop,
  setCurrentDrop,
}: DropTokenAmountSelectorProps) {
  const [customAmount, setCustomAmount] = useState('');
  console.log('Incoming drop: ', currentDrop);
  const presetAmounts = [1, 5, 10, 50];

  const handleCustomAmountSubmit = () => {
    let amount = customAmount;
    try {
      if (parseFloat(amount) < 0.1 || isNaN(parseFloat(amount))) {
        amount = '0.1';
        setCustomAmount('0.1');
      }
    } catch (e) {
      amount = '';
      setCustomAmount('');
      console.log('Error parsing float: ', e);
    }
    setCurrentDrop({ ...currentDrop, amount: amount });
  };

  const handlePresetAmountClick = (amount: number) => {
    setCustomAmount('');
    setCurrentDrop({ ...currentDrop, amount: String(amount) });
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = e.target.value;
    setCustomAmount(newAmount);
  };

  return (
    <FormControlComponent
      errorText={errors.amount}
      label="Token amount*"
      labelProps={{ fontSize: { base: 'xs', md: 'md' } }}
      marginY="2"
    >
      <VStack alignItems="flex-start">
        <HStack justifyContent="space-between" width="100%">
          <HStack width="75%">
            {presetAmounts.map((amount) => (
              <Box
                key={amount}
                alignItems="center"
                border="2px solid transparent"
                borderRadius="5xl"
                color={currentDrop.amount === String(amount) ? 'blue.500' : 'gray.500'}
                display="flex"
                fontSize={{ base: 'xs', md: 'sm' }}
                height="30px"
                justifyContent="center"
                sx={{
                  bg:
                    currentDrop.amount === String(amount)
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
                  handlePresetAmountClick(amount);
                }}
              >
                {amount}
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
            color={presetAmounts.includes(Number(currentDrop.amount)) ? 'gray.500' : 'blue.500'}
            height="30px"
            id="customAmountInput"
            placeholder="Custom"
            size={{ base: 'xs', md: 'sm' }}
            sx={{
              bg: !presetAmounts.includes(Number(currentDrop.amount))
                ? 'linear-gradient(to bottom, var(--chakra-colors-blue-100), var(--chakra-colors-blue-100)) padding-box, linear-gradient(0deg, rgba(255,207,234,1) 0%, rgba(182,232,247,1) 100%) border-box'
                : 'gray.100', // Selected item background
            }}
            textAlign="center"
            type="number"
            value={customAmount}
            width="30%"
            onBlur={handleCustomAmountSubmit}
            onChange={handleCustomAmountChange}
          />
        </HStack>
      </VStack>
    </FormControlComponent>
  );
}
