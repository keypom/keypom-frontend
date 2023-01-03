import { LinkIcon } from '@chakra-ui/icons';
import { Box, Button, Divider, HStack } from '@chakra-ui/react';

import { IconBox } from '@/common/components/IconBox';
import { Text } from '@/common/components/Typography';

import { PaymentItem, SummaryItem } from './types/types';
import { useDropFlowContext } from './contexts/DropFlowContext';

interface DropSummaryProps {
  summaryData: SummaryItem[];
  paymentData: PaymentItem[];
}

// TODO: need to figure out how to form these data programmatically
// const paymentData = [
//   {
//     title: 'Link cost',
//     text: '20 x 3.50  700 NEAR',
//   },
//   {
//     title: 'NEAR network fee',
//     text: '50 NEAR',
//   },
// ];

export const DropSummary = ({ summaryData, paymentData }: DropSummaryProps) => {
  const { onPrevious } = useDropFlowContext();
  const summaryItems = summaryData.map((item) => (
    <Box key={item.name} mb="5">
      <Text fontWeight="medium">{item.name}</Text>
      <Text fontSize={{ base: 'md', md: 'lg' }} mt="6px">
        {item.value}
      </Text>
    </Box>
  ));
  const paymentSummary = paymentData
    .filter((payment) => payment.name !== 'Total cost')
    .map((payment) => {
      const { name, total, symbol, isDiscount, discountText, helperText } = payment;
      return (
        <HStack key={name} mb="6px" spacing="auto">
          <Text fontSize={{ base: 'xs', md: 'sm' }}>{name}</Text>
          <Text alignItems="center" display="flex" fontSize={{ base: 'xs', md: 'sm' }}>
            {isDiscount && (
              <Text
                background="linear-gradient(271.49deg, #73D6F3 0%, #30C9F3 100%)"
                backgroundClip="text"
                color="transparent"
                fontWeight="medium"
                mr="1.5"
              >
                {discountText}
              </Text>
            )}
            {helperText && <> {helperText} </>}
            {total} {symbol}
          </Text>
        </HStack>
      );
    });
  const paymentTotalCost = paymentData.find((payment) => payment.name === 'Total cost');
  return (
    <IconBox icon={<LinkIcon />} maxW={{ base: '21.5rem', md: '36rem' }}>
      <Box mb="8" textAlign="left">
        {summaryItems}
      </Box>
      <Divider bgColor="gray.100" />
      <Box my="8">
        {paymentSummary}
        <HStack spacing="auto">
          <Text color="gray.800" fontSize={{ base: 'md', md: 'lg' }} fontWeight="medium">
            Total cost
          </Text>
          <Text color="gray.800" fontSize={{ base: 'md', md: 'lg' }} fontWeight="medium">
            {paymentTotalCost.total} {paymentTotalCost.symbol}
          </Text>
        </HStack>
      </Box>
      <HStack spacing="auto">
        <Button variant="secondary" onClick={onPrevious}>
          Go back
        </Button>
        <Button>Create links</Button>
      </HStack>
    </IconBox>
  );
};
