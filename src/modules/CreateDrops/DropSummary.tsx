import { LinkIcon } from '@chakra-ui/icons';
import { Box, Button, Divider, HStack, useDisclosure } from '@chakra-ui/react';
import { useEffect } from 'react';

import { IconBox } from '@/common/components/IconBox';
import { Text } from '@/common/components/Typography';

import { PaymentData, SummaryItem } from './types/types';
import { useDropFlowContext } from './contexts/DropFlowContext';
import { DropSummaryModal } from './DropSummaryModal';

interface DropSummaryProps {
  summaryData: SummaryItem[];
  paymentData: PaymentData;
  data: {
    success: boolean;
  };
  onConfirmClick: () => void;
}

export const DropSummary = ({
  summaryData,
  paymentData,
  data,
  onConfirmClick,
}: DropSummaryProps) => {
  const { onPrevious } = useDropFlowContext();
  const { costsData, confirmationText, totalCost } = paymentData;
  const { isOpen, onOpen } = useDisclosure();
  const summaryItems = summaryData.map((item) => (
    <Box key={item.name} mb="5">
      <Text fontWeight="medium">{item.name}</Text>
      <Text fontSize={{ base: 'md', md: 'lg' }} mt="6px">
        {item.value}
      </Text>
    </Box>
  ));
  const paymentSummary = costsData.map((payment) => {
    const { name, total, isDiscount, discountText, helperText } = payment;
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
          {total} NEAR
        </Text>
      </HStack>
    );
  });

  useEffect(() => {
    if (data?.success) {
      // TODO: redirect to token drop manager page (next task)
      console.log('transaction success..redirect to drop manager page');
    }
  }, [data?.success]);

  const handleConfirmClick = () => {
    onOpen();
    onConfirmClick();
  };

  return (
    <>
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
              {totalCost} NEAR
            </Text>
          </HStack>
        </Box>
        <HStack spacing="auto">
          <Button variant="secondary" onClick={onPrevious}>
            Go back
          </Button>
          <Button onClick={handleConfirmClick}>Create links</Button>
        </HStack>
      </IconBox>
      <DropSummaryModal
        confirmationText={confirmationText}
        isConfirmed={data?.success}
        isOpen={isOpen}
      />
    </>
  );
};
