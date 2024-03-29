import { Badge, Button, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { CopyIcon, DeleteIcon } from '@/components/Icons';
import { DropManager, type GetDataFn } from '@/features/drop-manager/components/DropManager';
import keypomInstance from '@/lib/keypom';

import { tableColumns } from '../../components/TableColumn';

export default function NFTDropManagerPage() {
  const navigate = useNavigate();

  const { id: dropId = '' } = useParams();

  const [availableKeys, setAvailableKeys] = useState<number>(0);

  useEffect(() => {
    if (dropId === '') navigate('/drops');

    const getAvailableKeys = async () => {
      setAvailableKeys(await keypomInstance.getAvailableKeys(dropId));
    };

    getAvailableKeys();
  }, [dropId]);

  const getTableRows: GetDataFn = (data, handleDeleteClick, handleCopyClick) => {
    if (data === undefined) return [];

    return data.map((item) => ({
      id: item.id,
      dropId,
      dropLink: item.link,
      link: (
        <Text color="gray.400" display="flex">
          {window.location.hostname}/
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
          <Button
            mr="1"
            size="sm"
            variant="icon"
            onClick={() => {
              handleCopyClick(item.link);
            }}
          >
            <CopyIcon />
          </Button>
          {!item.hasClaimed && (
            <Button
              size="sm"
              variant="icon"
              onClick={async () => {
                await handleDeleteClick(item.publicKey);
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
    <DropManager
      claimedHeaderText="NFT editions claimed"
      getClaimedText={(dropSize) => `${dropSize - availableKeys} / ${dropSize}`}
      getData={getTableRows}
      showColumns={false}
      tableColumns={tableColumns}
    />
  );
}
