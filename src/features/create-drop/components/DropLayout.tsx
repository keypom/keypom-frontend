// Generic layout for all drop

import { Box, Heading, Stack } from '@chakra-ui/react';
import { type PropsWithChildren } from 'react';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { useDropFlowContext } from '@/features/create-drop/contexts/DropFlowContext';

export const DropLayout = ({ children }: PropsWithChildren) => {
  const {
    breadcrumbs,
    currentFlowPage: { description },
  } = useDropFlowContext();
  return (
    <Stack
      direction={{ base: 'column', md: 'row' }}
      maxW={{ base: '21.5rem', md: '62.125rem' }}
      mx="auto"
      spacing={{ base: '14', md: '5' }}
    >
      <Box flexGrow="1" maxW={{ base: 'full', md: '26.625rem' }}>
        <Breadcrumbs items={breadcrumbs} />
        <Heading mt={{ base: '2', md: '4' }}>{description}</Heading>
      </Box>
      <Box flexGrow="1">{children}</Box>
    </Stack>
  );
};
