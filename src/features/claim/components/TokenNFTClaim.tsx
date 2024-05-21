import { Box, Center, Heading, Spinner, useBoolean, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { BoxWithShape } from '@/components/BoxWithShape';
import { IconBox } from '@/components/IconBox';
import { useAppContext } from '@/contexts/AppContext';
import keypomInstance from '@/lib/keypom';
import { storeClaimDrop } from '@/utils/claimedDrops';
import { ExistingWallet } from '@/features/claim/components/ExistingWallet';
import { CreateWallet } from '@/features/claim/components/CreateWallet';
import { type TokenAsset } from '@/types/common';
import { ErrorBox } from '@/components/ErrorBox';
import { type DROP_TYPES } from '@/constants/common';
import { DropClaimMetadata } from '@/features/claim/components/DropClaimMetadata';

interface TokenNFTClaimProps {
  icon: React.ReactNode;
  pageHeadingText: string;
  secretKey: string;
  contractId: string;
  isClaimInfoLoading: boolean;
  claimInfoError?: string;
  claimSuccessfulText: string;

  type: DROP_TYPES;
  wallets?: string[];
  redirectUrl?: string;
  metadata: {
    title?: string;
    nftImage?: string;
    description?: string;
    tokens?: TokenAsset[];
  };
}

/**
 * Component for showing token or nft assets and claiming
 */
export const TokenNFTClaim = ({
  icon,
  pageHeadingText,
  secretKey,
  contractId,
  isClaimInfoLoading,
  claimInfoError,
  claimSuccessfulText,
  type,
  metadata,
  wallets,
  redirectUrl,
}: TokenNFTClaimProps) => {
  const { setAppModal } = useAppContext();
  const [haveWallet, showInputWallet] = useBoolean(false);
  const [isClaimSuccessful, setIsClaimSuccessful] = useState(false);
  const [isClaimLoading, setIsClaimLoading] = useState(false);
  const [claimError, setClaimError] = useState('');
  const [openLoadingModal, setOpenLoadingModal] = useState(false);
  const [openResultModal, setOpenResultModal] = useState(false);

  useEffect(() => {
    if (openLoadingModal) {
      openTransactionLoadingModal();
    }
  }, [openLoadingModal]);

  useEffect(() => {
    if (openResultModal) {
      openTransactionResultModal();
    }
  }, [openResultModal, isClaimLoading]);

  const handleClaim = async (walletAddress: string) => {
    setClaimError('');
    setOpenResultModal(false);
    setIsClaimLoading(true);
    setOpenLoadingModal(true);
    try {
      await keypomInstance.claim(secretKey, walletAddress);
      storeClaimDrop(secretKey);
      setOpenLoadingModal(false);
      setOpenResultModal(true);
      setIsClaimLoading(false);
      setIsClaimSuccessful(true);
    } catch (err) {
      setClaimError(err.message);
      setIsClaimLoading(false);
      setOpenLoadingModal(false);
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
      message: claimError || claimSuccessfulText,
      options: [
        {
          label: 'Ok',
          func: () => {
            setAppModal({ isOpen: false });
          },
        },
      ],
    });
  };

  if (claimInfoError) {
    return <ErrorBox message={claimInfoError} />;
  }

  if (isClaimInfoLoading) {
    return (
      <Center h={{ base: '300px', md: '500px' }}>
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box mb={{ base: '5', md: '14' }} minH="100%" minW="100%" mt={{ base: '52px', md: '100px' }}>
      <Center>
        <VStack gap={{ base: 'calc(24px + 8px)', md: 'calc(32px + 10px)' }}>
          <Heading textAlign="center">{pageHeadingText}</Heading>

          {/** Claim token component */}
          <IconBox
            icon={icon}
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
              <DropClaimMetadata type={type} {...metadata} />
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
                  redirectUrl={redirectUrl}
                  secretKey={secretKey}
                  wallets={wallets}
                  onClick={showInputWallet.on}
                />
              ) : (
                <ExistingWallet
                  claimErrorText={claimError}
                  handleSubmit={handleClaim}
                  isLoading={isClaimLoading}
                  isSuccess={isClaimSuccessful}
                  onBack={showInputWallet.off}
                />
              )}
            </VStack>
          </IconBox>
        </VStack>
      </Center>
    </Box>
  );
};
