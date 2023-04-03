import { generateKeys, getKeysForDrop } from 'keypom-js';
import { useEffect, useState } from 'react';

import { MASTER_KEY } from '@/constants/common';
import { get } from '@/utils/localStorage';
import keypomInstance from '@/lib/keypom';

interface useValidMasterKeyProps {
  dropId: string;
}

export const useValidMasterKey = ({ dropId }: useValidMasterKeyProps) => {
  const [valid, setValid] = useState(true);

  useEffect(() => {
    const validateMasterKey = async () => {
      const drop = await keypomInstance.getDropInfo({ dropId });
      const { eventId } = keypomInstance.getDropMetadata(drop.metadata);
      if (eventId) {
        // if event drop, do not need to check for masterKey
        setValid(true);
      } else {
        const keys = await getKeysForDrop({ dropId, start: 0, limit: 1 });
        if (keys.length === 0) {
          setValid(true); // assume all keys have been claimed
          return;
        }
        const { publicKeys } = await generateKeys({
          numKeys: 1,
          rootEntropy: `${get(MASTER_KEY) as string}-${dropId}`,
          metaEntropy: keys[0].key_id.toString(),
        });

        setValid(keys[0].pk === publicKeys[0]);
      }
    };
    validateMasterKey();
  }, []);

  return {
    masterKeyValidity: valid,
  };
};
