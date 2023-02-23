import copy from 'copy-to-clipboard';
import { Box, Button, Text, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  deleteKeys,
  generateKeys,
  getDropInformation,
  getKeyInformationBatch,
  getKeySupplyForDrop,
} from 'keypom-js';

import { CopyIcon, DeleteIcon } from '@/components/Icons';
import { DropManager } from '@/features/drop-manager/components/DropManager';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import { MASTER_KEY, PAGE_SIZE_LIMIT } from '@/constants/common';
import { get } from '@/utils/localStorage';
import { usePagination } from '@/hooks/usePagination';
import { type DataItem } from '@/components/Table/types';
import { useAppContext } from '@/contexts/AppContext';
import getConfig from '@/config/config';

import { getClaimStatus } from '../../utils/getClaimStatus';
import { getBadgeType } from '../../utils/getBadgeType';
import { tableColumns } from '../../components/TableColumn';
import { INITIAL_SAMPLE_DATA } from '../../constants/common';
import { type TicketClaimStatus } from '../../types/types';
import { setConfirmationModalHelper } from '../../components/ConfirmationModal';

export default function TicketDropManagerPage() {
  const { setAppModal } = useAppContext();
  const toast = useToast();

  const { id: dropId } = useParams();
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('Drop');
  const [dataSize, setDataSize] = useState<number>(0);
  const [claimed, setClaimed] = useState<number>(0);
  const [data, setData] = useState<DataItem[]>([INITIAL_SAMPLE_DATA[1]]);

  const [wallet, setWallet] = useState({});
  const { selector, accountId } = useAuthWalletContext();

  useEffect(() => {
    const getWallet = async () => {
      setWallet(await selector.wallet());
    };
    getWallet();
  }, []);

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
    let drop = await getDropInformation({
      dropId,
    });
    if (!drop)
      drop = {
        metadata: '{}',
      };

    setDataSize(drop.next_key_id);
    setClaimed(await getKeySupplyForDrop({ dropId }));

    setName(JSON.parse(drop.metadata as unknown as string).dropName);

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
        publicKey: publicKeys[i],
        link: `https://keypom.xyz/claim/${getConfig().contractId}#${key.replace('ed25519:', '')}`,
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

  const handleCopyClick = (link: string) => {
    copy(link);
    toast({ title: 'Copied!', status: 'success', duration: 1000, isClosable: true });
  };

  const handleDeleteClick = async (pubKey: string) => {
    setConfirmationModalHelper(
      setAppModal,
      async () => {
        await deleteKeys({
          wallet,
          dropId,
          publicKeys: pubKey,
        });
      },
      () => null,
      'key',
    );
  };

  const getTableRows = () => {
    if (data === undefined) return [];

    return data.map((item) => ({
      ...item,
      dropId,
      dropLink: item.link,
      link: (
        <Text color="gray.400" display="flex">
          keypom.xyz/
          <Text as="span" color="gray.800">
            {item.slug}
          </Text>
        </Text>
      ),
      hasClaimed: getBadgeType(item.claimStatus as TicketClaimStatus),
      action: (
        <>
          <Button
            mr="1"
            size="sm"
            variant="icon"
            onClick={() => {
              handleCopyClick(item.link as string);
            }}
          >
            <CopyIcon />
          </Button>
          <Button
            size="sm"
            variant="icon"
            onClick={async () => {
              await handleDeleteClick(item.publicKey as string);
            }}
          >
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
          claimedText={`${dataSize - claimed} / ${dataSize}`}
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
