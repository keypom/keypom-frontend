import { Box, Center, Heading, useBoolean, VStack } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
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

import { claimTrialAccountDrop, accountExists, claim } from 'keypom-js';

interface TokenAsset {
  icon: string;
  value: string;
  symbol: string;
}

const TrialClaimPage = () => {
  const navigate = useNavigate();
  const { contractId, secretKey } = useClaimParams();
  const { setAppModal } = useAppContext();
  const [haveWallet, showInputWallet] = useBoolean(false);
  const [tokens, setTokens] = useState<TokenAsset[]>([]);
  const [walletsOptions, setWallets] = useState([]);
  const [isClaimSuccessful, setIsClaimSuccessful] = useState(false);
  const [isClaimLoading, setIsClaimLoading] = useState(false);
  const [claimError, setClaimError] = useState('');
  const [isDropClaimed, setIsDropClaimed] = useState(false);
  const [openLoadingModal, setOpenLoadingModal] = useState(false);
  const [openResultModal, setOpenResultModal] = useState(false);

  const loadClaimInfo = async () => {
    try {
      const drop = await keypomInstance.getTokenClaimInformation(contractId, secretKey);
      console.log(drop)
    } catch(e) {
      console.log(e)
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

    const root = '.linkdrop-beta.keypom.testnet'
    const desiredAccountId = walletAddress + root

    console.log('attempting ', walletAddress);

    const exists = await accountExists(desiredAccountId);

    if (exists) {
      return console.warn('exists')
    }

    try {
      await claimTrialAccountDrop({
        secretKey: '4MVfyqUDiWV66c3dMmqcU3rMsavNQqongEJCfd316eNToqi3rfR95Ehj7wm57rYmZrrM5FopxyUaeWuFepvzfbj4',
        desiredAccountId,
      })
    } catch(e) {
      console.log(e)
    }
    

    // setIsClaimLoading(true);
    // setOpenLoadingModal(true);
    // try {
    //   await keypomInstance.claim(secretKey, walletAddress);
    //   storeClaimDrop(secretKey);
    // } catch (err) {
    //   setClaimError(err);
    // }
    // setOpenResultModal(true);
    // setIsClaimLoading(false);
    // setIsClaimSuccessful(true);
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
    });
  };

  if (isDropClaimed) {
    return <ErrorBox message="This drop has been claimed." />;
  }

  if (claimError.length > 0) {
    return <Box mb={{ base: '5', md: '14' }} minH="100%" minW="100%" mt={{ base: '52px', md: '100px' }}>
    <Center>
      No drop for that link!
      </Center>
      </Box>
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
                noBackIcon={true}
                message={`Create Your Account`}
                label={`Your Account Name`}
                claimErrorText={claimError}
                handleSubmit={handleClaim}
                isLoading={isClaimLoading}
                isSuccess={isClaimSuccessful}
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
