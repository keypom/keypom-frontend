import { Badge, Box, Button, Skeleton, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  generateKeys,
  getDropInformation,
  getKeyInformationBatch,
  type ProtocolReturnedKeyInfo,
} from 'keypom-js';

import { CopyIcon, DeleteIcon } from '@/components/Icons';
import { DropManager } from '@/features/drop-manager/components/DropManager';
import { type ColumnItem } from '@/components/Table/types';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import { MASTER_KEY, PAGE_SIZE_LIMIT } from '@/constants/common';
import { get } from '@/utils/localStorage';
import { usePagination } from '@/hooks/usePagination';

type TicketClaimStatus = 'Unclaimed' | 'Viewed' | 'Attended' | 'Claimed';
const getClaimStatus = (key: ProtocolReturnedKeyInfo | null): TicketClaimStatus => {
  if (!key) return 'Claimed';
  const { cur_key_use } = key;

  switch (cur_key_use) {
    case 0:
      return 'Unclaimed';
    case 1:
      return 'Viewed';
    case 2:
    default:
      return 'Attended';
  }
};

const getBadgeType = (status: TicketClaimStatus): React.ReactNode => {
  switch (status) {
    case 'Unclaimed':
      return <Badge variant="gray">Unclaimed</Badge>;
    case 'Viewed':
      return <Badge variant="blue">Viewed</Badge>;
    case 'Attended':
      return <Badge variant="pink">Attended</Badge>;
    case 'Claimed':
    default:
      return <Badge variant="lightgreen">Claimed</Badge>;
  }
};

const tableColumns: ColumnItem[] = [
  { title: 'Name', selector: (row) => row.name, loadingElement: <Skeleton height="30px" /> },
  { title: 'Email', selector: (row) => row.email, loadingElement: <Skeleton height="30px" /> },
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

export default function TicketDropManagerPage() {
  const { id: dropId } = useParams();
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('Drop');
  const [dataSize, setDataSize] = useState<number>(0);
  const [data, setData] = useState([
    {
      id: 1,
      email: 'chealseaislan@mail.com',
      name: 'Chelsea Islan',
      slug: '#2138h823h',
      claimStatus: 'Unclaimed' as TicketClaimStatus,
      action: 'delete',
    },
  ]);

  const { accountId } = useAuthWalletContext();

  const {
    hasPagination,
    pagination,
    firstPage,
    lastPage,
    loading: paginationLoading,
    handleNextPage,
    handlePrevPage,
  } = usePagination({
    dataSize,
    handlePrevApiCall: async () => {
      await handleGetDrops({
        pageIndex: pagination.pageIndex - 1,
        pageSize: pagination.pageSize,
      });
    },
    handleNextApiCall: async () => {
      await handleGetDrops({
        pageIndex: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
      });
    },
  });

  const handleGetDrops = async ({ pageIndex = 0, pageSize = PAGE_SIZE_LIMIT }) => {
    if (!accountId) return;
    const drop = await getDropInformation({
      dropId,
    });

    setDataSize(drop.next_key_id);

    setName(JSON.parse(drop.metadata as string).dropName);

    const { publicKeys, secretKeys } = await generateKeys({
      numKeys: Math.min(drop.next_key_id, pageSize),
      rootEntropy: `${get(MASTER_KEY) as string}-${dropId}`,
      autoMetaNonceStart: pageIndex * pageSize,
    });

    const keyInfo = await getKeyInformationBatch({
      publicKeys,
      secretKeys,
    });

    setData(
      secretKeys.map((key, i) => ({
        id: i,
        name: 'chelsea',
        email: 'chelsea@gmail.com',
        link: 'https://keypom.xyz/claim/' + key.replace('ed25519:', ''),
        slug: key.substring(8, 16),
        claimStatus: getClaimStatus(keyInfo[i]),
        action: 'delete',
      })),
    );

    setLoading(false);
  };

  useEffect(() => {
    handleGetDrops({});
  }, []);

  // TODO: consider moving these to DropManager if backend request are the same for NFT and Ticket
  const handleCopyClick = () => {
    // TODO: copy handler
  };
  const handleDeleteClick = () => {
    // TODO: copy handler
  };

  const getTableRows = () => {
    if (data === undefined) return [];

    return data.map((item) => ({
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
      hasClaimed: getBadgeType(item.claimStatus),
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
          dropName={name}
          loading={loading}
          pagination={{
            hasPagination,
            id: 'token',
            paginationLoading,
            firstPage,
            lastPage,
            handleNextPage,
            handlePrevPage,
          }}
          tableColumns={tableColumns}
          tableProps={{ variant: 'secondary' }}
        />
      )}
    </Box>
  );
}
