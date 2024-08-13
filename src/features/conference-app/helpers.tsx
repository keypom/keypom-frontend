import { TOKEN_FACTORY_CONTRACT } from '@/constants/common';
import eventHelperInstance from '@/lib/event';

export const getDynamicHeightPercentage = (vh: number, thresholds: number[], values: number[]) => {
  if (vh > thresholds[0]) return values[0];
  if (vh > thresholds[1]) {
    const range = thresholds[0] - thresholds[1];
    const diff = vh - thresholds[1];
    const ratio = diff / range;
    return values[1] + ratio * (values[0] - values[1]);
  }
  if (vh > thresholds[2]) {
    const range = thresholds[1] - thresholds[2];
    const diff = vh - thresholds[2];
    const ratio = diff / range;
    return values[2] + ratio * (values[1] - values[2]);
  }
  return values[2];
};

export const claimEventDrop = async ({
  qrDataSplit,
  accountId,
  setScanStatus,
  setStatusMessage,
  secretKey,
}) => {
  const dropId = qrDataSplit[1];
  let scavId;
  if (qrDataSplit.length > 2) {
    scavId = qrDataSplit[2];
  }

  // Fetch the drop information
  const claimedDropInfo = await eventHelperInstance.viewCall({
    contractId: TOKEN_FACTORY_CONTRACT,
    methodName: 'get_drop_information',
    args: { drop_id: dropId },
  });
  console.log("Claimed drop info: ", claimedDropInfo);

  // Fetch claimed drops for the account
  const claimsForAccount = await eventHelperInstance.viewCall({
    contractId: TOKEN_FACTORY_CONTRACT,
    methodName: 'get_claimed_drops_for_account',
    args: { account_id: accountId, drop_id: dropId },
  });
  console.log("Claims for account: ", claimsForAccount);

  let curDropClaimData = claimsForAccount.find(drop => drop.drop_id === dropId);
  console.log("Cur drop claim data: ", curDropClaimData);

  let alreadyClaimed = false;

  // If drop has no scavenger hunt, check if it was already claimed
  if (!claimedDropInfo?.base?.scavenger_hunt || claimedDropInfo === undefined) {
    alreadyClaimed = curDropClaimData !== undefined;
  } else {
    // Validate scavenger ID
    const validScavengerIds = claimedDropInfo.base.scavenger_hunt.map(item => item.piece);
    const isValidScavengerId = validScavengerIds.includes(scavId);
    if (!isValidScavengerId) {
      setScanStatus('error');
      setStatusMessage('Invalid scavenger piece');
      return { alreadyClaimed: true, error: 'Invalid scavenger piece' };
    }

    // Check if the scavenger piece has already been claimed
    let piecesToCheck = curDropClaimData?.found_scavenger_ids || [];
    alreadyClaimed = piecesToCheck.includes(scavId);
  }

  if (alreadyClaimed) {
    setScanStatus('error');
    setStatusMessage('You already scanned this drop');
    return {
      alreadyClaimed: true,
    };
  }

  // If not already claimed, proceed to claim the drop
  await eventHelperInstance.claimEventTokenDrop({
    secretKey,
    dropId,
    scavId,
  });

  console.log("is Scav: ", scavId);
  console.log("Claims for account: ", claimsForAccount);
  console.log("Claimed drop info: ", claimedDropInfo);

  return {
    alreadyClaimed: false,
    isScavenger: scavId !== undefined,
    numFound: (curDropClaimData?.found_scavenger_ids || []).length + 1,
    numRequired: claimedDropInfo?.base.scavenger_hunt?.length || 0,
    image: claimedDropInfo?.base?.image,
    name: claimedDropInfo?.base?.name,
    amount: claimedDropInfo?.amount,
  };
};
