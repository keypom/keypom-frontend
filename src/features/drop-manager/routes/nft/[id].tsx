import { Badge, Box, Button, Text, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  deleteKeys,
  generateKeys,
  getDropInformation,
  getKeyInformationBatch,
  getKeySupplyForDrop,
  type ProtocolReturnedDrop,
} from 'keypom-js';

import { CopyIcon, DeleteIcon } from '@/components/Icons';
import { DropManager } from '@/features/drop-manager/components/DropManager';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import { get } from '@/utils/localStorage';
import { MASTER_KEY, PAGE_SIZE_LIMIT } from '@/constants/common';
import { usePagination } from '@/hooks/usePagination';
import { type DataItem } from '@/components/Table/types';
import { useAppContext } from '@/contexts/AppContext';
import getConfig from '@/config/config';
import { useValidMasterKey } from '@/hooks/useValidMasterKey';
import { share } from '@/utils/share';

import { tableColumns } from '../../components/TableColumn';
import { INITIAL_SAMPLE_DATA } from '../../constants/common';
import { setConfirmationModalHelper } from '../../components/ConfirmationModal';
import { setMasterKeyValidityModal } from '../../components/MasterKeyValidityModal';
import { setMissingDropModal } from '../../components/MissingDropModal';

export default function NFTDropManagerPage() {
  const navigate = useNavigate();
  const { setAppModal } = useAppContext();
  const toast = useToast();

  const { id: dropId } = useParams();
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('Untitled');
  const [dataSize, setDataSize] = useState<number>(0);
  const [claimed, setClaimed] = useState<number>(0);
  const [data, setData] = useState<DataItem[]>([INITIAL_SAMPLE_DATA[0]]);

  const [wallet, setWallet] = useState({});
  const { selector, accountId } = useAuthWalletContext();

  useEffect(() => {
    if (selector === null) return;

    const getWallet = async () => {
      setWallet(await selector.wallet());
    };
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
    }).catch((_) => {
      setMissingDropModal(setAppModal);
      navigate('/drops');
    });
    if (!drop)
      drop = {
        metadata: '{}',
      };

    setDataSize(drop.next_key_id);
    setClaimed(await getKeySupplyForDrop({ dropId }));

    const metadata = JSON.parse(((drop as ProtocolReturnedDrop).metadata as string) || '{}');
    if (metadata.dropName) setName(metadata.dropName);

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
        hasClaimed: keyInfo[i] === null,
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
      hasClaimed:
        item.hasClaimed === true ? (
          <Badge variant="lightgreen">Claimed</Badge>
        ) : (
          <Badge variant="gray">Unclaimed</Badge>
        ),
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
          {item.hasClaimed !== true && (
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
          claimedHeaderText="NFT editions claimed"
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
          showColumns={false}
          tableColumns={tableColumns}
        />
      )}
    </Box>
  );
}
