import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { DROP_TYPE, type DROP_TYPES } from '@/constants/common';
import { TokenNFTClaim } from '@/features/claim/components/TokenNFTClaim';
import { useClaimParams } from '@/hooks/useClaimParams';
import keypomInstance from '@/lib/keypom';
import { checkClaimedDrop } from '@/utils/claimedDrops';
import { TicketIcon } from '@/components/Icons';
import { type TokenAsset } from '@/types/common';

const TicketGiftPage = () => {
  const navigate = useNavigate();
  const { contractId, secretKey } = useClaimParams();

  // metadata
  const [type, setType] = useState<DROP_TYPES>(DROP_TYPE.NFT);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [nftImage, setNftImage] = useState('');
  const [wallets, setWallets] = useState([]);
  const [tokens, setTokens] = useState<TokenAsset[]>([]);

  // claim info
  const [isClaimInfoLoading, setClaimInfoLoading] = useState(true);
  const [claimInfoError, setClaimInfoError] = useState('');

  const loadClaimInfo = async () => {
    try {
      const data = await keypomInstance.getTicketNftInformation(contractId, secretKey);

      if (data.type === DROP_TYPE.NFT) {
        setTitle(data.title);
        setDescription(data.description);
        setNftImage(data.media);
      } else {
        setType(DROP_TYPE.TOKEN);
        const tokens: TokenAsset[] = [
          {
            icon: 'https://cryptologos.cc/logos/near-protocol-near-logo.svg?v=024',
            value: data.amountNEAR || '0',
            symbol: 'NEAR',
          },
        ];
        if (data.ftMetadata) {
          setTokens([
            ...tokens,
            {
              icon: data.ftMetadata.icon as string,
              value: data.amountTokens ?? '0',
              symbol: data.ftMetadata.symbol,
            },
          ]);
        }

        setTokens(tokens);
      }

      setWallets(data.wallets);
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
      claimSuccessfulText="Gifts claimed!"
      contractId={contractId}
      icon={<TicketIcon height={{ base: '8', md: '10' }} width={{ base: '8', md: '10' }} />}
      isClaimInfoLoading={isClaimInfoLoading}
      metadata={{
        title,
        description,
        nftImage,
        tokens,
      }}
      pageHeadingText="Collect your gifts"
      secretKey={secretKey}
      type={type}
      wallets={wallets}
    />
  );
};

export default TicketGiftPage;
