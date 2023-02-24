import { Box, Button, Text, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  deleteKeys,
  generateKeys,
  getDropInformation,
  getKeyInformationBatch,
  getKeysForDrop,
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
import { useValidMasterKey } from '@/hooks/useValidMasterKey';
import { share } from '@/utils/share';
import { asyncWithTimeout } from '@/utils/asyncWithTimeout';

import { getClaimStatus } from '../../utils/getClaimStatus';
import { getBadgeType } from '../../utils/getBadgeType';
import { tableColumns } from '../../components/TableColumn';
import { INITIAL_SAMPLE_DATA } from '../../constants/common';
import { type TicketClaimStatus } from '../../types/types';
import { setConfirmationModalHelper } from '../../components/ConfirmationModal';
import { setMasterKeyValidityModal } from '../../components/MasterKeyValidityModal';

export default function TicketDropManagerPage() {
  const navigate = useNavigate();
  const { setAppModal } = useAppContext();
  const toast = useToast();

  const { id: dropId } = useParams();
  const [loading, setLoading] = useState(true);
  const [loadClaimNum, setLoadClaimNum] = useState(true);

  const [name, setName] = useState('Drop');
  const [dataSize, setDataSize] = useState<number>(0);
  const [claimed, setClaimed] = useState<number>(0);
  const [data, setData] = useState<DataItem[]>([INITIAL_SAMPLE_DATA[1]]);

  const [wallet, setWallet] = useState({});
  const { selector, accountId } = useAuthWalletContext();

  const getWallet = async () => {
    if (selector === null) {
      return;
    }
    try {
      const selectorWallet = await selector?.wallet();
      setWallet(selectorWallet);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getWallet();
  }, [selector]);

  const { masterKeyValidity } = useValidMasterKey({ dropId });
  useEffect(() => {
    if (!masterKeyValidity) {
      setMasterKeyValidityModal(
        setAppModal,
        () => {
          window.location.reload();
        },
        () => {
          navigate('/drops');
        },
      );
    }
  }, [masterKeyValidity]);

  // set Scanned item
  useEffect(() => {
    const getScannedKeys = async () => {
      const drop = await getDropInformation({ dropId });

      let index = 0;
      const size = 200; // max limit is 306
      let numberOfScannedKey = 0;

      while (index * size < drop.next_key_id) {
        const keyInfos = await asyncWithTimeout(
          getKeysForDrop({
            dropId,
            limit:
              (index + 1) * size > drop.next_key_id
                ? drop.next_key_id - index * size
                : Math.min(drop.next_key_id, size),
            start: index * size,
          }),
        ).catch((err) => {
          console.log('Reach timeout or the following error:', err); // eslint-disable-line no-console
        });

        const numScannedKey = keyInfos.filter((key) => getClaimStatus(key) === 'Attended');
        numberOfScannedKey = numberOfScannedKey + (numScannedKey.length as number);
        index = index + 1;

        console.log('scanned key:', numberOfScannedKey, 'loop index:', index); // eslint-disable-line no-console
      }

      setClaimed((await getKeySupplyForDrop({ dropId })) - numberOfScannedKey);
      setLoadClaimNum(false);
    };
    getScannedKeys();
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

    setName(JSON.parse(drop.metadata as unknown as string).dropName);

    const { publicKeys, secretKeys } = await generateKeys({
      numKeys:
        (pageIndex + 1) * pageSize > drop.next_key_id
          ? drop.next_key_id - pageIndex * pageSize
          : Math.min(drop.next_key_id, pageSize),
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
        link: `${window.location.origin}/claim/${getConfig().contractId}#${key.replace(
          'ed25519:',
          '',
        )}`,
        slug: key.substring(8, 16),
        claimStatus: getClaimStatus(keyInfo[i]),
        action: 'delete',
      })),
    );

    setLoading(false);
  };

  useEffect(() => {
    handleGetDrops({});
  }, [accountId]);

  const handleCopyClick = (link: string) => {
    share(link);
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
        window.location.reload();
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
          {item.claimStatus !== 'Claimed' && (
            <Button
              size="sm"
              variant="icon"
              onClick={async () => {
                await handleDeleteClick(item.publicKey as string);
              }}
            >
              <DeleteIcon color="red" />
            </Button>
          )}
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
          loading={loading || loadClaimNum}
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
