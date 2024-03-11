// Generic layout for all drop

import { Box, Heading } from '@chakra-ui/react';

import { Breadcrumbs, type IBreadcrumbItem } from '@/components/Breadcrumbs';

export const CreateTicketDropLayout = ({
  breadcrumbs,
  description,
  children,
}: {
  breadcrumbs: IBreadcrumbItem[];
  description: string;
  children: React.ReactNode;
}) => {
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
