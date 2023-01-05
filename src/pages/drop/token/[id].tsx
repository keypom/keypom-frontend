import { Badge, Box, Text } from '@chakra-ui/react';

import { DropManager } from '@/modules/DropManager/DropManager';

interface TokenDropResponse {
  name: string;
  links: {
    id: number;
    slug: string;
    hasClaimed: boolean;
  }[];
}

const tableColumns = [
  { title: 'Link', selector: (row) => row.link },
  { title: 'Claim Status', selector: (row) => row.hasClaimed },
];

const getTableRows = (data: TokenDropResponse) => {
  if (data === undefined || !data?.links) return [];

  return data.links.map((item) => ({
    ...item,
    link: (
      <Text color="gray.400" display="flex">
        keypom.xyz/<Text color="gray.800">{item.slug}</Text>
      </Text>
    ),
    hasClaimed: item.hasClaimed ? (
      <Badge variant="lightgreen">Claimed</Badge>
    ) : (
      <Badge variant="gray">Unclaimed</Badge>
    ),
  }));
};

export default function TokenDropManager({ data }: { data: TokenDropResponse }) {
  const tableRows = getTableRows(data);

  return (
    <Box>
      {data !== undefined && (
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

// TODO: temporary solution until we have SSR
export async function getStaticProps({ params }) {
  const data = {
    name: 'Star Invader 3',
    links: [
      { id: 1, slug: '#2138h823h', hasClaimed: true },
      { id: 2, slug: '#2138h823h', hasClaimed: false },
      { id: 3, slug: '#c34fd2n32', hasClaimed: false },
      { id: 4, slug: '#rf5hhfaxm', hasClaimed: true },
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
