import { Badge, Box, Button, Skeleton, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  getDropInformation,
  generateKeys,
  getKeySupplyForDrop,
  getKeyInformationBatch,
} from 'keypom-js';

import { CopyIcon, DeleteIcon } from '@/components/Icons';
import { DropManager } from '@/features/drop-manager/components/DropManager';
import { type ColumnItem } from '@/components/Table/types';
import { get } from '@/utils/localStorage';
import { MASTER_KEY } from '@/constants/common';

const tableColumns: ColumnItem[] = [
  { title: 'Link', selector: (row) => row.link, loadingElement: <Skeleton height="30px" /> },
  {
    title: 'Claim Status',
    selector: (row) => row.hasClaimed,
    loadingElement: <Skeleton height="30px" />,
  },
  {
    title: 'Action',
    selector: (row) => row.action,
    tdProps: {
      display: 'flex',
      justifyContent: 'right',
      verticalAlign: 'middle',
    },
    loadingElement: <Skeleton height="30px" />,
  },
];

export default function TokenDropManagerPage() {
  const { id: dropId } = useParams();
  const [loading, setLoading] = useState(true);

  // TODO make these state vars and controllable by user
  const PAGE_SIZE = 20;
  const PAGE_OFFSET = 0;

  const [name, setName] = useState('Drop');
  const [data, setData] = useState([
    {
      id: 1,
      link: 'https://example.com',
      slug: 'https://example.com',
      hasClaimed: false,
      action: 'delete',
    },
  ]);
  // const [wallet, setWallet] = useState({});
  // const { selector, accountId } = useAuthWalletContext();

  const handleGetDrops = async () => {
    if (!accountId) return;
    const drop = await getDropInformation({
      dropId,
    });

    setName(JSON.parse(drop.metadata).name);

    const keySupply = await getKeySupplyForDrop({
      dropId,
    });

    console.log(keySupply);

    const { secretKeys } = await generateKeys({
      numKeys: Math.min(drop.next_key_id, PAGE_SIZE),
      rootEntropy: `${get(MASTER_KEY) as string}-${dropId}`,
      autoMetaNonceStart: PAGE_OFFSET,
    });

    const keyInfo = await getKeyInformationBatch({
      secretKeys,
    });

    console.log(keyInfo);

    setData(
      secretKeys.map((key, i) => ({
        id: i,
        link: 'https://keypom.xyz/claim/' + key.replace('ed25519:', ''),
        slug: key.substring(8, 16),
        hasClaimed: keyInfo[i] !== null,
        action: 'delete',
      })),
    );

    setLoading(false);
  };

  // TODO: Remove this after backend is ready
  useEffect(() => {
    handleGetDrops();
  }, [accountId]);

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
          claimedHeaderText="Opened"
          claimedText="200/500"
          data={getTableRows()}
          dropName={name}
          loading={loading}
          showColumns={false}
          tableColumns={tableColumns}
        />
      )}
    </Box>
  );
}
