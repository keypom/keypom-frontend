// Generic layout for all drop

import { Box, Heading } from '@chakra-ui/react';
import { type PropsWithChildren } from 'react';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { useDropFlowContext } from '@/features/create-drop/contexts/DropFlowContext';

export const CreateTicketDropLayout = ({ children }: PropsWithChildren) => {
  const {
    breadcrumbs,
    currentFlowPage: { description },
  } = useDropFlowContext();
  return (
    <Box transform="scale(0.85)" transformOrigin="center">
      <Box flexGrow="1" maxW="full">
        <Breadcrumbs items={breadcrumbs} />
        <Heading mt={{ base: '2', md: '4' }} paddingBottom="14">
          {description}
        </Heading>
      </Box>
      <Box flexGrow="1" maxW="full">
        {children}
      </Box>
    </Box>
  );
};
