import { Box, Button, Center, Heading, useBoolean, VStack } from '@chakra-ui/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { claimTrialAccountDrop, accountExists } from 'keypom-js';

import { IconBox } from '@/components/IconBox';
import { BoxWithShape } from '@/components/BoxWithShape';
import { StarIcon } from '@/components/Icons';
import { DropBox } from '@/components/DropBox/DropBox';
import keypomInstance from '@/lib/keypom';
import { useAppContext } from '@/contexts/AppContext';
import { ErrorBox } from '@/components/ErrorBox';
import { useClaimParams } from '@/hooks/useClaimParams';

import { ExistingWallet } from '../components/ExistingWallet';

interface TokenAsset {
  icon: string;
  value: string;
  symbol: string;
}

const TrialClaimPage = () => {
  const navigate = useNavigate();
  const { contractId, secretKey } = useClaimParams();
  const { setAppModal } = useAppContext();
  const [showInputWallet] = useBoolean(false);
  const [tokens] = useState<TokenAsset[]>([]);
  const [isClaimSuccessful, setIsClaimSuccessful] = useState(false);
  const [isClaimLoading, setIsClaimLoading] = useState(false);
  const [claimError, setClaimError] = useState('');
  const [isDropClaimed] = useState(false);
  const [openLoadingModal, setOpenLoadingModal] = useState(false);
  const [openResultModal, setOpenResultModal] = useState(false);
  const [searchParams] = useSearchParams();
  const appsStr = searchParams.get('apps');
  let apps;
  try {
    apps = JSON.parse(appsStr || '[]');
  } catch (e) {}

  const loadClaimInfo = async () => {
    try {
      await keypomInstance.getTokenClaimInformation(contractId, secretKey);
    } catch (e) {
      console.log(e);
      // `no drop ID for PK` is error we should pass through to the redirect URL
      setClaimError('No drop for this link!');
    }
  };

  useEffect(() => {
    if (secretKey === '') {
      navigate('/');
    }

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
    const root = '.linkdrop-beta.keypom.testnet';
    const desiredAccountId = walletAddress + root;

    console.log('attempting ', desiredAccountId);

    const exists = await accountExists(desiredAccountId);

    if (exists) {
      console.warn('exists');
      return;
    }

    setIsClaimLoading(true);
    setOpenLoadingModal(true);
    try {
      await claimTrialAccountDrop({
        secretKey,
        desiredAccountId,
      });
      setIsClaimSuccessful(true);
    } catch (e) {
      console.warn(e);
      // set claim error
    } finally {
      setOpenResultModal(true);
      setIsClaimLoading(false);
      setOpenLoadingModal(false);
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
      bodyComponent: (
        <>
          {apps.length > 0 ? (
            <Button onClick={() => window.open(apps[0], '_blank')}>Go to App</Button>
          ) : (
            <p>Account created successfully</p>
          )}
        </>
      ),
    });
  };

  if (isDropClaimed) {
    return <ErrorBox message="This drop has been claimed." />;
  }

  if (claimError.length > 0) {
    return (
      <Box mb={{ base: '5', md: '14' }} minH="100%" minW="100%" mt={{ base: '52px', md: '100px' }}>
        <Center>No drop for that link!</Center>
      </Box>
    );
  }

  return (
    <Box mb={{ base: '5', md: '14' }} minH="100%" minW="100%" mt={{ base: '52px', md: '100px' }}>
      <Center>
        {/** the additional gap is to accommodate for the absolute roundIcon size */}
        <VStack gap={{ base: 'calc(24px + 8px)', md: 'calc(32px + 10px)' }}>
          {/** Prompt text */}
          <Heading textAlign="center">{`You've received a Trial Account Drop!`}</Heading>

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
              <ExistingWallet
                claimErrorText={claimError}
                handleSubmit={handleClaim}
                isLoading={isClaimLoading}
                isSuccess={isClaimSuccessful}
                label={`Your Account Name`}
                message={`Create Your Account`}
                noBackIcon={true}
                onBack={showInputWallet.off}
              />
            </VStack>
          </IconBox>
        </VStack>
      </Center>
    </Box>
  );
};

export default TrialClaimPage;
