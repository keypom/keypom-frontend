import { Badge, Box, Button, Text } from '@chakra-ui/react';

import { CopyIcon, DeleteIcon } from '@/common/components/Icons';

import { DropManager } from '@/modules/DropManager/DropManager';

interface TicketDropResponse {
  name: string;
  links: {
    id: number;
    slug: string;
    email: string;
    name: string;
    hasClaimed: boolean;
  }[];
}

const tableColumns = [
  { title: 'Name', selector: (row) => row.name },
  { title: 'Email', selector: (row) => row.email },
  { title: 'Link', selector: (row) => row.link },
  { title: 'Claim Status', selector: (row) => row.hasClaimed },
  {
    title: '',
    selector: (row) => row.action,
    tdProps: {
      display: 'flex',
      justifyContent: 'right',
      verticalAlign: 'middle',
    },
  },
];

export default function TicketDropManager({ data }: { data: TicketDropResponse }) {
  // TODO: consider moving these to DropManager if backend request are the same for NFT and Ticket
  const handleCopyClick = () => {
    // TODO: copy handler
  };
  const handleDeleteClick = () => {
    // TODO: copy handler
  };

  const getTableRows = () => {
    if (data === undefined || !data?.links) return [];

    return data.links.map((item) => ({
      ...item,
      name: <Text fontWeight="medium">{item.name}</Text>,
      email: <Text>{item.email}</Text>,
      link: (
        <Text color="gray.400" display="flex">
          keypom.xyz/
          <Text as="span" color="gray.800">
            {item.slug}
          </Text>
        </Text>
      ),
      hasClaimed: item.hasClaimed ? (
        <Badge variant="lightgreen">Claimed</Badge>
      ) : (
        <Badge variant="gray">Unclaimed</Badge>
      ),
      action: (
        <>
          <Button mr="1" size="sm" variant="icon" onClick={handleCopyClick}>
            <CopyIcon />
          </Button>
          <Button size="sm" variant="icon" onClick={handleDeleteClick}>
            <DeleteIcon color="red" />
          </Button>
        </>
      ),
    }));
  };

  return (
    <Box>
      {data !== undefined && (
        <DropManager
          claimedHeaderText="Scanned"
          claimedText="200/500"
          data={getTableRows()}
          dropName={data.name}
          tableColumns={tableColumns}
          tableProps={{ variant: 'secondary' }}
        />
      )}
    </Box>
  );
}

// TODO: temporary solution until we have SSR
export async function getStaticProps() {
  const data: TicketDropResponse = {
    name: 'Star Invader 3',
    links: [
      { id: 1, email: 'johndoe@mail.com', name: 'John Doe', slug: '#2138h823h', hasClaimed: true },
      {
        id: 2,
        email: 'chealseaislan@mail.com',
        name: 'Chelsea Islan',
        slug: '#2138h823h',
        hasClaimed: false,
      },
      {
        id: 3,
        email: 'pevitapearce@mail.com',
        name: 'Pevita Pearce',
        slug: '#c34fd2n32',
        hasClaimed: false,
      },
      {
        id: 4,
        email: 'maudyayunda@mail.com',
        name: 'Maudy Ayunda',
        slug: '#rf5hhfaxm',
        hasClaimed: true,
      },
    ],
  };
  return { props: { data } };
}

export async function getStaticPaths() {
  const paths = [
    {
      params: { id: '123' },
    },
  ];
  return { paths, fallback: false };
}
