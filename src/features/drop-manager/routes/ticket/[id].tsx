import { Badge, Box, Button, Skeleton, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { CopyIcon, DeleteIcon } from '@/components/Icons';
import { DropManager } from '@/features/drop-manager/components/DropManager';
import { type ColumnItem } from '@/components/Table/types';

interface TicketDropResponse {
  name: string;
  links: Array<{
    id: number;
    slug: string;
    email: string;
    name: string;
    hasClaimed: boolean;
  }>;
}

const tableColumns: ColumnItem[] = [
  { title: 'Name', selector: (row) => row.name, loadingElement: <Skeleton height="30px" /> },
  { title: 'Email', selector: (row) => row.email, loadingElement: <Skeleton height="30px" /> },
  { title: 'Link', selector: (row) => row.link, loadingElement: <Skeleton height="30px" /> },
  {
    title: 'Status',
    selector: (row) => row.hasClaimed,
    loadingElement: <Skeleton height="30px" />,
  },
  {
    title: '',
    selector: (row) => row.action,
    tdProps: {
      display: 'flex',
      justifyContent: 'right',
      verticalAlign: 'middle',
    },
    loadingElement: <Skeleton height="30px" />,
  },
];

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

export default function TicketDropManagerPage() {
  const [loading, setLoading] = useState(true);

  // TODO: Remove this after backend is ready
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }, []);

  // TODO: consider moving these to DropManager if backend request are the same for NFT and Ticket
  const handleCopyClick = () => {
    // TODO: copy handler
  };
  const handleDeleteClick = () => {
    // TODO: copy handler
  };

  const getTableRows = () => {
    if (data === undefined || data?.links === undefined) return [];

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
          loading={loading}
          tableColumns={tableColumns}
          tableProps={{ variant: 'secondary' }}
        />
      )}
    </Box>
  );
}
