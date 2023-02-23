import { get, set } from './localStorage';

const CLAIMED_DROPS_KEY = 'claimed_drop_keys';

// check if local storage if drop has been claimed before
export const checkClaimedDrop = (secretKey: string) => {
  const claimedDropItem: string[] = get(CLAIMED_DROPS_KEY);

  if (claimedDropItem === undefined) {
    return false;
  }

  if (claimedDropItem.includes(secretKey)) {
    return true;
  }

  return false;
};

// store in local storage after claim is done
export const storeClaimDrop = (secretKey: string) => {
  const claimedDropItem: string[] = get(CLAIMED_DROPS_KEY);

  if (claimedDropItem === undefined) {
    set(CLAIMED_DROPS_KEY, [secretKey]);
    return;
  }

  set(CLAIMED_DROPS_KEY, [...claimedDropItem, secretKey]);
};
