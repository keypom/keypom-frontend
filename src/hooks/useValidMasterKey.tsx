import { generateKeys, getKeysForDrop } from 'keypom-js';
import { useEffect, useState } from 'react';

import { MASTER_KEY } from '@/constants/common';
import { get } from '@/utils/localStorage';

interface useValidMasterKeyProps {
  dropId: string;
}

export const useValidMasterKey = ({ dropId }: useValidMasterKeyProps) => {
  const [valid, setValid] = useState(true);

  useEffect(() => {
    const validateMasterKey = async () => {
      const keyToCompare = await getKeysForDrop({ dropId });
      if (keyToCompare.length === 0) {
        setValid(true); // assume all keys have been claimed
        return;
      }
      const { publicKeys: publicKey } = await generateKeys({
        numKeys: 1,
        rootEntropy: `${get(MASTER_KEY) as string}-${dropId}`,
        metaEntropy: keyToCompare[0].key_id.toString(),
      });
      setValid(keyToCompare[0].key_id.toString() === publicKey[0]);
    };
    validateMasterKey();
  }, []);

  return {
    masterKeyValidity: valid,
  };
};
