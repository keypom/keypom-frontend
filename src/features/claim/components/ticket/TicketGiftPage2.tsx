import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { DROP_TYPE } from '@/constants/common';
import { TokenNFTClaim } from '@/features/claim/components/TokenNFTClaim';
import { useClaimParams } from '@/hooks/useClaimParams';
import keypomInstance from '@/lib/keypom';
import { checkClaimedDrop } from '@/utils/claimedDrops';
import { TicketIcon } from '@/components/Icons';
import ClaimTokenPage from '@/features/claim/routes/TokenClaimPage';

const TicketGiftPage = () => {
  const navigate = useNavigate();
  const { contractId, secretKey } = useClaimParams();

  // metadata
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [nftImage, setNftImage] = useState('');
  const [wallets, setWallets] = useState([]);

  // claim info
  const [isClaimInfoLoading, setClaimInfoLoading] = useState(true);
  const [claimInfoError, setClaimInfoError] = useState('');

  const [showTokenDrop, setShowTokenDrop] = useState(false);

  const loadClaimInfo = async () => {
    try {
      const nftData = await keypomInstance.getNFTClaimInformation(contractId, secretKey);

      setTitle(nftData.title);
      setDescription(nftData.description);
      setNftImage(nftData.media);
      setWallets(nftData.wallets);
    } catch (err) {
      if (err.message === 'NFT series not found') {
        // show tokens instead TODO
        setShowTokenDrop(true);
        setClaimInfoLoading(false);
        return;
      }

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

  // TODO!!!!!!
  if (showTokenDrop) {
    return <ClaimTokenPage />;
  }

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
      }}
      pageHeadingText="Collect your gifts"
      secretKey={secretKey}
      type={DROP_TYPE.NFT}
      wallets={wallets}
    />
  );
};

export default TicketGiftPage;
