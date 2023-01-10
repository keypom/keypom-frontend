import { Box, Image, Text } from '@chakra-ui/react';

import { SummaryItem } from '../types/types';

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
      <Box
        borderRadius={{ base: '5xl', md: '6xl' }}
        h={{ base: '7.5rem', md: '11.25rem' }}
        mt="6px"
        position="relative"
        w={{ base: '7.5rem', md: '11.25rem' }}
      >
        <Image
          alt={value[0].name}
          borderRadius={{ base: '5xl', md: '6xl' }}
          objectFit="cover"
          src={previewSource}
        />
      </Box>
    </Box>
  );
};
