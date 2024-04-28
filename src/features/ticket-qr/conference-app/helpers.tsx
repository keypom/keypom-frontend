import keypomInstance from '@/lib/keypom';

export const claimEventDrop = async ({
  dropInfo,
  qrDataSplit,
  accountId,
  setScanStatus,
  setStatusMessage,
  secretKey,
}) => {
  const factoryAccount = dropInfo?.asset_data[1].config.root_account_id;

  const dropId = qrDataSplit[1];
  let scavId;
  if (qrDataSplit.length > 2) {
    scavId = qrDataSplit[2];
  }

  const tokenDropInfo = await keypomInstance.viewCall({
    contractId: factoryAccount,
    methodName: 'get_drop_information',
    args: { drop_id: dropId },
  });
  const claimsForAccount: string[] = await keypomInstance.viewCall({
    contractId: factoryAccount,
    methodName: 'claims_for_account',
    args: { account_id: accountId, drop_id: dropId },
  });

  // If it's a scavenger hunt, the scavID will be in the claims for account when claimed
  // If it's a regular drop, when claiming, the drop ID will be in the list as well
  // So all we need to check is if the scavenger ID is in the list (since it defaults to the drop ID)
  if (claimsForAccount.includes(scavId || dropId)) {
    setScanStatus('error');
    setStatusMessage('You already scanned this drop');
    return {
      shouldBreak: true,
    };
  }

  await keypomInstance.claimEventTokenDrop({
    secretKey,
    accountId,
    dropId,
    scavId,
    factoryAccount,
  });

  return {
    shouldBreak: false,
    isScavenger: scavId !== undefined,
    numFound: claimsForAccount.length + 1,
    numRequired: tokenDropInfo?.scavenger_ids?.length || 0,
    numClaimed: tokenDropInfo?.amount,
  };
};
