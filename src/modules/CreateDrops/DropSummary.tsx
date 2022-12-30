import { LinkIcon } from '@chakra-ui/icons';
import { Box, Divider, HStack } from '@chakra-ui/react';

import { IconBox } from '@/common/components/IconBox';
import { Text } from '@/common/components/Typography';

import { SummaryItem } from './types/types';

interface DropSummaryProps {
  summaryData: SummaryItem[];
}

export const DropSummary = ({ summaryData }) => {
  const summaryItems = summaryData.map((item) => (
    <Box key={item.name} mb="5">
      <Text fontWeight="medium">{item.name}</Text>
      <Text fontSize={{ base: 'md', md: 'lg' }} mt="6px">
        {item.value}
      </Text>
    </Box>
  ));
  return (
    <IconBox icon={<LinkIcon />} maxW={{ base: '21.5rem', md: '36rem' }}>
      <Box mb="8" textAlign="left">
        {summaryItems}
      </Box>
      <Divider bgColor="gray.100" />
      {/* TODO: get these variables! */}
      <HStack spacing="auto">
        <Text>Link cost</Text>
        <Text>20 x 3.50 700 NEAR</Text>
      </HStack>
      <HStack spacing="auto">
        <Text>NEAR network fee</Text>
        <Text>50 NEAR</Text>
      </HStack>
      <HStack spacing="auto">
        <Text>Keypom fee</Text>
        <Text>Early burd 0 NEAR</Text>
      </HStack>
      <HStack spacing="auto">
        <Text>Total cost</Text>
        <Text> 750 NEAR</Text>
      </HStack>
    </IconBox>
  );
};
