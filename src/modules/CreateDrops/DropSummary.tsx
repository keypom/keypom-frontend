import { LinkIcon } from '@chakra-ui/icons';
import { Box, Button, Divider, HStack } from '@chakra-ui/react';

import { IconBox } from '@/common/components/IconBox';
import { Text } from '@/common/components/Typography';

import { SummaryItem } from './types/types';
import { useDropFlowContext } from './contexts/DropFlowContext';

interface DropSummaryProps {
  summaryData: SummaryItem[];
}

// TODO: need to figure out how to form these data programmatically
const paymentData = [
  {
    title: 'Link cost',
    text: '20 x 3.50  700 NEAR',
  },
  {
    title: 'NEAR network fee',
    text: '50 NEAR',
  },
  {
    title: 'Keypom fee',
    text: 'Early bird discount 0 NEAR',
  },
];

export const DropSummary = ({ summaryData }: DropSummaryProps) => {
  const { onPrevious } = useDropFlowContext();
  const summaryItems = summaryData.map((item) => (
    <Box key={item.name} mb="5">
      <Text fontWeight="medium">{item.name}</Text>
      <Text fontSize={{ base: 'md', md: 'lg' }} mt="6px">
        {item.value}
      </Text>
    </Box>
  ));
  const paymentSummary = paymentData.map(({ title, text }) => (
    <HStack key={title} mb="6px" spacing="auto">
      <Text color="gray.600" fontSize={{ base: 'xs', md: 'sm' }}>
        {title}
      </Text>
      <Text color="gray.600" fontSize={{ base: 'xs', md: 'sm' }}>
        {text}
      </Text>
    </HStack>
  ));
  return (
    <IconBox icon={<LinkIcon />} maxW={{ base: '21.5rem', md: '36rem' }}>
      <Box mb="8" textAlign="left">
        {summaryItems}
      </Box>
      <Divider bgColor="gray.100" />
      <Box my="8">
        {paymentSummary}
        <HStack spacing="auto">
          <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="medium">
            Total cost
          </Text>
          <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="medium">
            750.15 NEAR
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
