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
import { DeleteIcon } from '@/common/components/Icons';

import { DROPS_MENU_ITEMS } from './dropsMenuItems';

const TABLE_DATA = [
  {
    name: 'Star Invader 3',
    type: 'Token',
    claimed: '90 / 100',
  },
  {
    name: 'The International',
    type: 'Token',
    claimed: '10000 / 20000',
  },
  {
    name: 'Trumpy Apes',
    type: 'NFT',
    claimed: '10 / 444',
  },
];

export default function AllDrops() {
  const dropMenuItems = DROPS_MENU_ITEMS.map((item) => (
    <MenuItem key={item.name} as="a" href={item.href}>
      {item.name}
    </MenuItem>
  ));

  const tableBody = TABLE_DATA.map((drop) => (
    <Tr key={drop.name}>
      <Td>{drop.name}</Td>
      <Td>{drop.type}</Td>
      <Td>
        <Badge colorScheme="green">{drop.claimed} Claimed</Badge>
      </Td>
      <Td display="flex" justifyContent="right">
        <Button size="sm" variant="action">
          <DeleteIcon color="red" />
        </Button>
      </Td>
    </Tr>
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
              {/* Actions header */}
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>{tableBody}</Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
