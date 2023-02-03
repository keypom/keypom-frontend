import { Box, Text } from '@chakra-ui/react';

import { AvatarImage } from '@/components/AvatarImage';

import { type SummaryItem } from '../../types/types';

export const SummaryItemText = ({ name, value }: Omit<SummaryItem, 'type'>) => {
  return (
    <Box mb="5">
      <Text fontWeight="medium">{name}</Text>
      <Text fontSize={{ base: 'md', md: 'lg' }} mt="6px">
        {value}
      </Text>
    </Box>
  );
};

export const SummaryItemImage = ({ name, value }: Omit<SummaryItem, 'type'>) => {
  const previewSource = URL.createObjectURL(value[0]);

  return (
    <Box mb="5">
      <Text fontWeight="medium">{name}</Text>
      <AvatarImage altName={value[0].name} imageSrc={previewSource} />
    </Box>
  );
};
