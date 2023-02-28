import { Box, Center, Heading, Spinner, useBoolean, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { IconBox } from '@/components/IconBox';
import { BoxWithShape } from '@/components/BoxWithShape';
import { TicketIcon } from '@/components/Icons';
import { useAppContext } from '@/contexts/AppContext';
import keypomInstance from '@/lib/keypom';
import { checkClaimedDrop, storeClaimDrop } from '@/utils/claimedDrops';
import { ErrorBox } from '@/components/ErrorBox';
import { useClaimParams } from '@/hooks/useClaimParams';

import { CreateWallet } from '../components/CreateWallet';
import { ExistingWallet } from '../components/ExistingWallet';
import { NftReward } from '../components/nft/NftReward';

import ClaimTokenPage from './TokenClaimPage';

const ClaimGiftPage = () => {
  const navigate = useNavigate();
  const { secretKey, contractId } = useClaimParams();
  const { setAppModal } = useAppContext();
  const [haveWallet, showInputWallet] = useBoolean(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [nftImage, setNftImage] = useState('');
  const [walletsOptions, setWallets] = useState([]);
  const [isClaimSuccessful, setIsClaimSuccessful] = useState(false);
  const [isClaimLoading, setIsClaimLoading] = useState(false);
  const [claimError, setClaimError] = useState('');
  const [dropError, setDropError] = useState('');
  const [openLoadingModal, setOpenLoadingModal] = useState(false);
  const [openResultModal, setOpenResultModal] = useState(false);
  const [isClaimInfoLoading, setClaimInfoLoading] = useState(true);
  const [showTokenDrop, setShowTokenDrop] = useState(false);

  const loadClaimInfo = async () => {
    try {
      const remainingUses = await keypomInstance.checkTicketRemainingUses(contractId, secretKey);

      // should only show this page if claim remaining uses is 1
      if (remainingUses > 1) {
        navigate(`/claim/${contractId}#${secretKey}`);
        return;
      }
      const nftData = await keypomInstance.getTicketNftInformation(contractId, secretKey);

      setTitle(nftData.title);
      setDescription(nftData.description);
      setNftImage(nftData.media);
      setWallets(nftData.wallets);
    } catch (err) {
      if (err.message === 'NFT series not found') {
        // show tokens instead
        setShowTokenDrop(true);
        setClaimInfoLoading(false);
        return;
      }

      setDropError(err.message);
    }
    setClaimInfoLoading(false);
  };

  useEffect(() => {
    if (secretKey === '' || contractId === '') {
      navigate('/');
    }

    const hasDropClaimedBefore = checkClaimedDrop(secretKey);
    if (hasDropClaimedBefore) {
      setDropError('This drop has been claimed.');
      return;
    }

    // eslint-disable-next-line
    loadClaimInfo();
  }, []);

  useEffect(() => {
    if (openLoadingModal) {
      openTransactionLoadingModal();
    }
  }, [openLoadingModal]);

  useEffect(() => {
    if (openResultModal) {
      openTransactionResultModal();
    }
  }, [openResultModal]);

  const handleClaim = async (walletAddress: string) => {
    setClaimError('');
    setIsClaimLoading(true);
    setOpenLoadingModal(true);
    try {
      await keypomInstance.claim(secretKey, walletAddress);
      storeClaimDrop(secretKey);
      setOpenResultModal(true);
      setIsClaimLoading(false);
      setIsClaimSuccessful(true);
    } catch (err) {
      setClaimError(err.message);
      setIsClaimLoading(false);
      setOpenResultModal(true);
    }
  };

  const openTransactionLoadingModal = () => {
    setAppModal({
      isOpen: true,
      isLoading: true,
    });
  };

  const openTransactionResultModal = () => {
    setAppModal({
      isOpen: true,
      isLoading: false,
      isError: Boolean(claimError),
      isSuccess: isClaimSuccessful,
      message: claimError || 'NFT claimed!',
      options: [
        {
          label: 'Ok',
          func: () => {
            setAppModal({ isOpen: false });
            console.log('tx acknowledged');
          },
        },
      ],
    });
  };

  if (dropError) {
    return <ErrorBox message={dropError} />;
  }

  if (isClaimInfoLoading) {
    return (
      <Center h={{ base: '300px', md: '500px' }}>
        <Spinner size="xl" />
      </Center>
    );
  }

  // default to token drop if NFT series is not found
  if (showTokenDrop) {
    return <ClaimTokenPage skipLinkDropCheck />;
  }

  return (
    <Box mb={{ base: '5', md: '14' }} minH="100%" minW="100%" mt={{ base: '52px', md: '100px' }}>
      <Center>
        {/** the additional gap is to accommodate for the absolute roundIcon size */}
        <VStack gap={{ base: 'calc(24px + 8px)', md: 'calc(32px + 10px)' }}>
          {/** Prompt text */}
          <Heading textAlign="center">Collect your gifts</Heading>

          {/** Claim gift component */}
          <IconBox
            icon={<TicketIcon height={{ base: '8', md: '10' }} width={{ base: '8', md: '10' }} />}
            minW={{ base: 'inherit', md: '345px' }}
            p="0"
            pb="0"
            w={{ base: '345px', md: '30rem' }}
          >
            <BoxWithShape
              bg="white"
              borderTopRadius="8xl"
              pb={{ base: '6', md: '8' }}
              pt={{ base: '12', md: '16' }}
              px={{ base: '6', md: '8' }}
              shapeSize="md"
              w="full "
            >
              {/** div placeholder */}
              <NftReward artworkSrc={nftImage} description={description} nftName={title} />
            </BoxWithShape>
            <VStack
              bg="gray.50"
              borderBottomRadius="8xl"
              p="8"
              spacing={{ base: '4', md: '5' }}
              w="full"
            >
              {!haveWallet ? (
                <CreateWallet
                  contractId={contractId}
                  secretKey={secretKey}
                  wallets={walletsOptions}
                  onClick={showInputWallet.on}
                />
              ) : (
                <>
                  <ExistingWallet
                    claimErrorText={claimError}
                    handleSubmit={handleClaim}
                    isLoading={isClaimLoading}
                    isSuccess={isClaimSuccessful}
                    onBack={showInputWallet.off}
                  />
                </>
              )}
            </VStack>
          </IconBox>
        </VStack>
      </Center>
    </Box>
  );
};

export default ClaimGiftPage;
