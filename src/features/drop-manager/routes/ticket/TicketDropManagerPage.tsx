import { Button, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { CopyIcon, DeleteIcon } from '@/components/Icons';
import { DropManager, type GetDataFn } from '@/features/drop-manager/components/DropManager';
import keypomInstance from '@/lib/keypom';

import { getClaimStatus } from '../../utils/getClaimStatus';
import { getBadgeType } from '../../utils/getBadgeType';
import { tableColumns } from '../../components/TableColumn';
import placeholderImage from '../../constants/token-placeholder.png';

export default function TicketDropManagerPage() {
  const navigate = useNavigate();

  const { id: dropId = '' } = useParams();

  const [scannedAndClaimed, setScannedAndClaimed] = useState<number>(0);

  useEffect(() => {
    if (dropId === '') navigate('/drops');
  }, [dropId]);

  const getScannedKeys = async () => {
    const keysSupply = await keypomInstance.getAvailableKeys(dropId);
    const getScannedInner = async (scanned = 0, index = 0) => {
      const drop = await keypomInstance.getDropInfo({ dropId });

      const size = 200; // max limit is 306

      if (index * size >= drop.next_key_id) return;

      const keyInfos = await keypomInstance.getKeysForDrop({
        dropId,
        limit: size,
        start: index * size,
      });

      const scannedKeys = keyInfos.filter((key) => getClaimStatus(key) === 'Attended');
      scanned += scannedKeys.length;
      index = index + 1;

      setScannedAndClaimed(keysSupply - scanned);

      getScannedInner(scanned, index);
    };
    getScannedInner();
  };

  // set Scanned item
  useEffect(() => {
    getScannedKeys();
  }, []);

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
      hasClaimed: getBadgeType(item.keyInfo?.cur_key_use as number),
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
              <DeleteIcon color="red.400" />
            </Button>
          )}
        </>
      ),
    }));
  };

  return (
    <DropManager
      getClaimedText={(dropSize) => `${dropSize - scannedAndClaimed} / ${dropSize}`}
      getData={getTableRows}
      placeholderImage={placeholderImage}
      showColumns={false}
      tableColumns={tableColumns}
    />
  );
}
