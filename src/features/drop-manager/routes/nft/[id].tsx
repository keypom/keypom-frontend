import { Badge, Box, Button, Skeleton, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { CopyIcon, DeleteIcon } from '@/components/Icons';
import { DropManager } from '@/features/drop-manager/components/DropManager';
import { type ColumnItem } from '@/components/Table/types';

interface NFTDropResponse {
  name: string;
  links: Array<{
    id: number;
    slug: string;
    hasClaimed: boolean;
  }>;
}

const tableColumns: ColumnItem[] = [
  { title: 'Link', selector: (row) => row.link, loadingElement: <Skeleton height="30px" /> },
  {
    title: 'Claim Status',
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

const data: NFTDropResponse = {
  name: 'Star Invader 3',
  links: [
    { id: 1, slug: '#2138h823h', hasClaimed: true },
    { id: 2, slug: '#2138h823h', hasClaimed: false },
    { id: 3, slug: '#c34fd2n32', hasClaimed: false },
    { id: 4, slug: '#rf5hhfaxm', hasClaimed: true },
  ],
};

export default function NFTDropManagerPage() {
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
          claimedHeaderText="NFT editions claimed"
          claimedText="200/500"
          data={getTableRows()}
          dropName={data.name}
          loading={loading}
          showColumns={false}
          tableColumns={tableColumns}
        />
      )}
    </Box>
  );
}
