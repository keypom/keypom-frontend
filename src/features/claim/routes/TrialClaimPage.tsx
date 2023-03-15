import { Box, Button, Center, Heading, Image, Text, useBoolean, VStack } from '@chakra-ui/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { accountExists, claimTrialAccountDrop } from 'keypom-js';
import _ from 'lodash';

import { IconBox } from '@/components/IconBox';
import { BoxWithShape } from '@/components/BoxWithShape';
import { StarIcon } from '@/components/Icons';
import { DropBox } from '@/components/DropBox/DropBox';
import keypomInstance from '@/lib/keypom';
import { useAppContext } from '@/contexts/AppContext';
import { useClaimParams } from '@/hooks/useClaimParams';
import { getIpfsData } from '@/utils/fetchIpfs';

import { ExistingWallet } from '../components/ExistingWallet';
import { NftReward } from '../components/nft/NftReward';

interface TokenAsset {
  icon: string;
  value: string;
  symbol: string;
}

interface TrialInfo {
  version: string;
  landing: {
    title: string;
    description: string;
    button: string;
    media?: string;
  };
  apps: Array<{
    title: string;
    url: string;
    description?: string;
    media?: string;
    delimiter?: string;
  }>;
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
  const [claimInfoError, setClaimInfoError] = useState(false);
  const [openLoadingModal, setOpenLoadingModal] = useState(false);
  const [openResultModal, setOpenResultModal] = useState(false);
  const [desiredAccountId, setDesiredAccountId] = useState('');
  const [searchParams] = useSearchParams();

  const defaultTrialInfo: TrialInfo = {
    version: '0.0.0',
    landing: {
      title: `You've received a Trial Account Drop!`,
      description: `Create Your Account`,
      button: `Send`,
    },
    apps: [],
  };
  const [trialInfo, setTrialInfo] = useState<TrialInfo>(defaultTrialInfo);

  const loadClaimInfo = async () => {
    try {
      await keypomInstance.getTokenClaimInformation(contractId, secretKey);
    } catch (e) {
      console.log(e);
      // `no drop ID for PK` is error we should pass through to the redirect URL
      setClaimInfoError(true);
    }
  };

  const loadTrialInfo = async () => {
    const ipfsLink = searchParams.get('meta');

    if (ipfsLink) {
      try {
        const incomingData = await getIpfsData(ipfsLink);

        const newTrialInfo = { ...defaultTrialInfo };
        _.merge(newTrialInfo, incomingData);

        setTrialInfo(newTrialInfo);
      } catch (e) {
        console.log(e);
      }
    }
  };

  useEffect(() => {
    if (secretKey === '') {
      navigate('/');
    }

    loadClaimInfo();
    loadTrialInfo();
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

  const handleClaim = async (accountName: string) => {
    const accountId = accountName + keypomInstance.getAccountIdPostfix();
    setClaimError('');
    setDesiredAccountId(accountId);
    console.log('attempting ', accountId);

    const exists = await accountExists(accountId);

    if (exists) {
      console.warn('exists');
      setClaimError('Account already exists.');
      return;
    }

    setIsClaimLoading(true);
    setOpenLoadingModal(true);
    try {
      await claimTrialAccountDrop({
        secretKey,
        desiredAccountId: accountId,
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
    const apps = trialInfo.apps;
    console.log('apps: ', apps);
    setAppModal({
      isOpen: true,
      isLoading: false,
      isError: Boolean(claimError),
      isSuccess: isClaimSuccessful,
      trapFocus: false,
      bodyComponent: (
        <>
          <VStack spacing="2" w="full">
            <Text>Account created successfully</Text>
            {apps.length > 0 ? (
              apps.map(({ title = 'Go to App', url, media, description, delimiter = '#' }) => {
                if (!url) return null;
                return (
                  <Button
                    key={url}
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius={{ base: '5xl', md: '6xl' }}
                    leftIcon={<Image h="15px" src={media} w="15px" />}
                    variant="secondary"
                    w="full"
                    onClick={() => {
                      window.open(`${url}${desiredAccountId}${delimiter}${secretKey}`, '_blank');
                    }}
                  >
                    {title}
                  </Button>
                );
              })
            ) : (
              <Button
                onClick={() =>
                  window.open(
                    `https://testnet.mynearwallet.com/auto-import-secret-key#${desiredAccountId}/ed25519:${secretKey.replace(
                      'ed25519:',
                      '',
                    )}`,
                    '_blank',
                  )
                }
              >
                Go to MyNearWallet
              </Button>
            )}
          </VStack>
        </>
      ),
    });
  };

  if (claimInfoError) {
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
          <Heading textAlign="center">{trialInfo.landing.title}</Heading>

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
              {trialInfo.landing.media && (
                <NftReward artworkSrc={trialInfo.landing.media} description={''} nftName={''} />
              )}
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
                buttonText={trialInfo.landing.button}
                claimErrorText={claimError}
                handleSubmit={handleClaim}
                inputPlaceholder="yourname"
                inputRightAddonText={keypomInstance.getAccountIdPostfix()}
                isLoading={isClaimLoading}
                isSuccess={isClaimSuccessful}
                label={`Your Account Name`}
                message={trialInfo.landing.description}
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
