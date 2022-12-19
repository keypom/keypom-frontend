import {
  Badge,
  Box,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

import { PageHead } from '@/common/components/PageHead';
import { Heading } from '@/common/components/Typography';
import { Td } from '@/common/components/Table/Td';
import { Table } from '@/common/components/Table/Table';

import { DROPS_MENU_ITEMS } from './dropsMenuItems';

export default function AllDrops() {
  const dropMenuItems = DROPS_MENU_ITEMS.map((item) => (
    <MenuItem key={item.name} as="a" href={item.href}>
      {item.name}
    </MenuItem>
  ));
  return (
    <Box minH="100%" minW="100%" mt="20">
      <PageHead
        removeTitleAppend
        description="Page containing all drops created by user"
        name="All Drops"
      />
      {/* Header Bar */}
      <HStack spacing="auto">
        <Heading>All drops</Heading>
        <Menu>
          {({ isOpen }) => (
            <>
              <MenuButton
                as={Button}
                isActive={isOpen}
                rightIcon={<ChevronDownIcon />}
                variant="secondary"
              >
                Create a drop
              </MenuButton>
              <MenuList>{dropMenuItems}</MenuList>
            </>
          )}
        </Menu>
      </HStack>

      {/* Table */}
      <TableContainer>
        <Table mt="30px">
          <Thead>
            <Tr>
              <Th>Drop name</Th>
              <Th>Drop Type</Th>
              <Th>Claimed</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Star Invader 3</Td>
              <Td>Token</Td>
              <Td>
                <Badge colorScheme="green">90 / 100 Claimed</Badge>
              </Td>
            </Tr>
            <Tr>
              <Td>Maplestory vs DoTA</Td>
              <Td>Ticket</Td>
              <Td>
                <Badge colorScheme="green">2000 / 3000 Claimed</Badge>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
