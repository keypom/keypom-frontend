import {
  Badge,
  Box,
  Button,
  HStack,
  Show,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

import { PageHead } from '@/common/components/PageHead';
import { Heading, Text } from '@/common/components/Typography';
import { Td } from '@/common/components/Table/Td';
import { Table } from '@/common/components/Table/Table';
import { DeleteIcon, LinkIcon } from '@/common/components/Icons';
import { Menu, MenuItemProps } from '@/common/components/Menu';

const TABLE_DATA = [
  // sample data until we integrate with SDK
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
    claimed: '10 / 444', // Need to figure out what determines the badge color
  },
];

const MENU_ITEMS: MenuItemProps[] = [
  {
    label: 'Token drop',
    as: 'a',
    href: '/drop/new',
    icon: <LinkIcon h="4" w="4" />,
  },
  {
    label: 'NFT drop',
    as: 'a',
    href: '/drop/new',
    icon: <LinkIcon h="4" w="4" />,
  },
  {
    label: 'Ticket drop',
    as: 'a',
    href: '/drop/new',
    icon: <LinkIcon h="4" w="4" />,
  },
];

export default function AllDrops() {
  const getDesktopTableBody = () =>
    TABLE_DATA.map((drop) => (
      <Tr key={drop.name}>
        <Td>{drop.name}</Td>
        <Td>{drop.type}</Td>
        <Td>
          <Badge variant="lightgreen">{drop.claimed} Claimed</Badge>
        </Td>
        <Td display="flex" justifyContent="right">
          <Button size="sm" variant="action">
            <DeleteIcon color="red" />
          </Button>
        </Td>
      </Tr>
    ));

  const getMobileTableBody = () =>
    TABLE_DATA.map((drop) => (
      <Tr key={drop.name}>
        <Td>
          <Text color="gray.800">{drop.name}</Text>
          <Text fontWeight="normal" mt="0.5">
            {drop.type}
          </Text>
          <Text>
            <Badge mt="3" size="sm" variant="lightgreen">
              {drop.claimed} Claimed
            </Badge>
          </Text>
        </Td>
        <Td verticalAlign="middle">
          <Button float="right" size="sm" variant="action">
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
      <HStack alignItems="center" display="flex" spacing="auto">
        <Heading>All drops</Heading>

        {/* Desktop Dropdown Menu */}
        <Show above="sm">
          <Menu items={MENU_ITEMS}>Create a drop</Menu>
        </Show>

        {/* Mobile Menu Button */}
        <Show below="sm">
          <Button px="6" py="3" rightIcon={<ChevronDownIcon />} variant="secondary">
            Create a drop
          </Button>
        </Show>
      </HStack>

      {/* Desktop Table */}
      <Show above="sm">
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
            <Tbody>{getDesktopTableBody()}</Tbody>
          </Table>
        </TableContainer>
      </Show>

      {/* Mobile Table */}
      <Show below="sm">
        <TableContainer>
          <Table mt="30px">
            <Tbody>{getMobileTableBody()}</Tbody>
          </Table>
        </TableContainer>
      </Show>
    </Box>
  );
}
