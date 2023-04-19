import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { DROP_TYPE } from '@/constants/common';
import { TokenNFTClaim } from '@/features/claim/components/TokenNFTClaim';
import { useClaimParams } from '@/hooks/useClaimParams';
import keypomInstance from '@/lib/keypom';
import { type TokenAsset } from '@/types/common';
import { checkClaimedDrop } from '@/utils/claimedDrops';
import { StarIcon } from '@/components/Icons';

const TokenClaimPage = () => {
  const navigate = useNavigate();
  const { contractId, secretKey } = useClaimParams();

  // metadata
  const [tokens, setTokens] = useState<TokenAsset[]>([]);
  const [wallets, setWallets] = useState([]);

  // claim info
  const [isClaimInfoLoading, setClaimInfoLoading] = useState(true);
  const [claimInfoError, setClaimInfoError] = useState('');

  const loadClaimInfo = async () => {
    try {
      const { ftMetadata, amountNEAR, amountTokens, wallets } =
        await keypomInstance.getTokenClaimInformation(contractId, secretKey);
      const tokens: TokenAsset[] = [
        {
          icon: 'https://cryptologos.cc/logos/near-protocol-near-logo.svg?v=024',
          value: amountNEAR || '0',
          symbol: 'NEAR',
        },
      ];
      if (ftMetadata) {
        setTokens([
          ...tokens,
          {
            icon: ftMetadata.icon as string,
            value: amountTokens ?? '0',
            symbol: ftMetadata.symbol,
          },
        ]);
      }

      setTokens(tokens);
      setWallets(wallets);
    } catch (err) {
      setClaimInfoError(err.message);
    }

    setClaimInfoLoading(false);
  };

  useEffect(() => {
    if (secretKey === '') {
      navigate('/');
    }

    const hasDropClaimedBefore = checkClaimedDrop(secretKey);
    if (hasDropClaimedBefore) {
      setClaimInfoError('This drop has been claimed.');
      return;
    }

    // eslint-disable-next-line
    loadClaimInfo();
  }, []);

  return (
    <TokenNFTClaim
      claimInfoError={claimInfoError}
      claimSuccessfulText="Token claimed!"
      contractId={contractId}
      icon={<StarIcon height={{ base: '8', md: '10' }} width={{ base: '8', md: '10' }} />}
      isClaimInfoLoading={isClaimInfoLoading}
      metadata={{
        tokens,
      }}
      pageHeadingText="You've received a Keypom drop!"
      secretKey={secretKey}
      type={DROP_TYPE.TOKEN}
      wallets={wallets}
    />
  );
};

export default TokenClaimPage;
