// Generic layout for all drop

import { Box, Flex } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

import { Breadcrumbs } from '@/common/components/Breadcrumbs';
import { Heading } from '@/common/components/Typography';

import { useDropFlowContext } from './contexts/DropFlowContext';

// interface DropLayoutProps {
//   breadcrumbs: IBreadcrumbItem[];
//   description: string;
// }

export const DropLayout = ({ children }: PropsWithChildren) => {
  const {
    breadcrumbs,
    currentFlowPage: { description },
  } = useDropFlowContext();
  return (
    <Flex
      direction={{ base: 'column', md: 'row' }}
      maxW={{ base: '21.5rem', md: '62.125rem' }}
      mx="auto"
    >
      <Box flexGrow="1" maxW={{ base: 'full', md: '26.625rem' }}>
        <Breadcrumbs items={breadcrumbs} />
        <Heading mt="4">{description}</Heading>
      </Box>
      <Box flexGrow="1">{children}</Box>
    </Flex>
  );
};
