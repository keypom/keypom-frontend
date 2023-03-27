import { Box, Center, Heading, useBoolean, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { IconBox } from '@/components/IconBox';
import { BoxWithShape } from '@/components/BoxWithShape';
import { TicketIcon } from '@/components/Icons';
import { useAppContext } from '@/contexts/AppContext';
import keypomInstance from '@/lib/keypom';
import { storeClaimDrop } from '@/utils/claimedDrops';
import { useClaimParams } from '@/hooks/useClaimParams';
import { DropClaimMetadata } from '@/features/claim/components/DropClaimMetadata';
import { CreateWallet } from '@/features/claim/components/CreateWallet';
import { ExistingWallet } from '@/features/claim/components/ExistingWallet';
import { useTicketClaim } from '@/features/claim/contexts/TicketClaimContext';

// TODO: use SimpleClaimPage instead
const TicketGiftPage = () => {
  const { secretKey, contractId } = useClaimParams();
  const { setAppModal } = useAppContext();
  const [haveWallet, showInputWallet] = useBoolean(false);
  const [isClaimSuccessful, setIsClaimSuccessful] = useState(false);
  const [isClaimLoading, setIsClaimLoading] = useState(false);
  const [claimError, setClaimError] = useState('');
  const [openLoadingModal, setOpenLoadingModal] = useState(false);
  const [openResultModal, setOpenResultModal] = useState(false);
  const { getDropMetadata } = useTicketClaim();

  const { title, description, nftImage, tokens, giftType, wallets } = getDropMetadata();

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

  return (
    <Box mb={{ base: '5', md: '14' }} minH="100%" minW="100%" mt={{ base: '52px', md: '100px' }}>
      <Center>
        <VStack gap={{ base: 'calc(24px + 8px)', md: 'calc(32px + 10px)' }}>
          <Heading textAlign="center">Collect your gifts</Heading>
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
              <DropClaimMetadata
                description={description}
                nftImage={nftImage}
                title={title}
                tokens={tokens}
                type={giftType}
              />
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
                  wallets={wallets}
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

export default TicketGiftPage;
