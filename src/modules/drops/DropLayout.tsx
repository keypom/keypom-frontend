// Generic layout for all drop

import { ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Stack } from '@chakra-ui/react';

export const DropLayout = ({ children }) => {
  return (
    <Stack direction={{ base: 'column', md: 'row' }} maxW="1000px" spacing="auto">
      <Box>
        <Breadcrumb separator={<ChevronRightIcon color="gray.500" />} spacing="8px">
          <BreadcrumbItem>
            <BreadcrumbLink href="#">All drops</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink href="#">New Token Drop</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Box>
      <Box>{children}</Box>
    </Stack>
  );
};
