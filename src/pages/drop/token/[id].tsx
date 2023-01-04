import { Badge, Box, Center, Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import { DropManager } from '@/modules/DropManager/DropManager';

interface TokenDropResponse {
  name: string;
  links: {
    id: number;
    link: string;
    hasClaimed: boolean;
  }[];
}

// TODO: mock implementation of drop links fetching
const fetcher = async () => {
  await new Promise((res) => setTimeout(res, 2000));
  return {
    name: 'Star Invader 3',
    links: [
      { id: 1, link: 'keypom.xyz/#2138h823h', hasClaimed: true },
      { id: 2, link: 'keypom.xyz/#2138h823h', hasClaimed: false },
      { id: 3, link: 'keypom.xyz/#c34fd2n32', hasClaimed: false },
      { id: 4, link: 'keypom.xyz/#rf5hhfaxm', hasClaimed: true },
    ],
  };
};

interface useDropSWRReturn {
  data: TokenDropResponse;
  isLoading: boolean;
  isError: Error;
}

const useDropSWR = (id: string): useDropSWRReturn => {
  const { data, error, isLoading } = useSWR(`/api/drop/${id}`, fetcher);

  return {
    data,
    isLoading,
    isError: error,
  };
};

const tableColumns = [
  { title: 'Link', selector: (row) => row.link },
  { title: 'Claim Status', selector: (row) => row.hasClaimed },
];

const getTableRows = (data: TokenDropResponse) => {
  if (data === undefined || !data?.links) return [];

  return data.links.map((item) => ({
    ...item,
    hasClaimed: item.hasClaimed ? (
      <Badge variant="lightgreen">Claimed</Badge>
    ) : (
      <Badge variant="gray">Unclaimed</Badge>
    ),
  }));
};

export default function TokenDropManager() {
  const {
    query: { id },
  } = useRouter();

  const { data, isLoading, isError } = useDropSWR(id as string);

  const tableRows = getTableRows(data);

  if (isLoading) {
    return (
      <Center>
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box>
      {data !== undefined && !isError && (
        <DropManager
          claimedHeaderText="Opened"
          claimedText="200/500"
          data={tableRows}
          dropName={data.name}
          showColumns={false}
          tableColumns={tableColumns}
        />
      )}
    </Box>
  );
}
