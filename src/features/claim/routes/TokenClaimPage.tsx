import { Box, Center, Heading, useBoolean, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { IconBox } from '@/components/IconBox';
import { BoxWithShape } from '@/components/BoxWithShape';
import { StarIcon } from '@/components/Icons';
import { DropBox } from '@/components/DropBox/DropBox';
import keypomInstance from '@/lib/keypom';
import { checkClaimedDrop, storeClaimDrop } from '@/utils/claimedDrops';
import { useAppContext } from '@/contexts/AppContext';
import { ErrorBox } from '@/components/ErrorBox';
import { useClaimParams } from '@/hooks/useClaimParams';

import { ExistingWallet } from '../components/ExistingWallet';
import { CreateWallet } from '../components/CreateWallet';

// TODO remove this after ETH Denver ethdenver
const redirectUrl = window.location.origin + '/ethdenver';

export interface TokenAsset {
  icon: string;
  value: string;
  symbol: string;
}

interface ClaimTokenPageProps {
  skipLinkDropCheck?: boolean;
}

const ClaimTokenPage = ({ skipLinkDropCheck = false }: ClaimTokenPageProps) => {
  const navigate = useNavigate();
  const { contractId, secretKey } = useClaimParams();
  const { setAppModal } = useAppContext();
  const [haveWallet, showInputWallet] = useBoolean(false);
  const [tokens, setTokens] = useState<TokenAsset[]>([]);
  const [walletsOptions, setWallets] = useState([]);
  const [isClaimSuccessful, setIsClaimSuccessful] = useState(false);
  const [isClaimLoading, setIsClaimLoading] = useState(false);
  const [claimError, setClaimError] = useState('');
  const [dropError, setDropError] = useState('');
  const [openLoadingModal, setOpenLoadingModal] = useState(false);
  const [openResultModal, setOpenResultModal] = useState(false);

  const loadClaimInfo = async () => {
    try {
      const { ftMetadata, amountNEAR, amountTokens, wallets } =
        await keypomInstance.getTokenClaimInformation(contractId, secretKey, skipLinkDropCheck);
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
      setDropError(err.message);
    }
  };

  useEffect(() => {
    if (secretKey === '') {
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
      message: claimError || 'Token claimed!',
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

  return (
    <Box mb={{ base: '5', md: '14' }} minH="100%" minW="100%" mt={{ base: '52px', md: '100px' }}>
      <Center>
        {/** the additional gap is to accommodate for the absolute roundIcon size */}
        <VStack gap={{ base: 'calc(24px + 8px)', md: 'calc(32px + 10px)' }}>
          {/** Prompt text */}
          <Heading textAlign="center">{`You've received a Keypom Drop!`}</Heading>

          {/** Claim token component */}
          <IconBox
            icon={<StarIcon height={{ base: '8', md: '10' }} width={{ base: '8', md: '10' }} />}
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
              <VStack>
                {/** div placeholder */}
                {tokens.map(({ icon, value, symbol }, index) => (
                  <DropBox key={index} icon={icon} symbol={symbol} value={value} />
                ))}
              </VStack>
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
                  wallets={walletsOptions}
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

export default ClaimTokenPage;
