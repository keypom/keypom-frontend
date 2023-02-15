import { Box, Center, Heading, useBoolean, VStack } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { IconBox } from '@/components/IconBox';
import { BoxWithShape } from '@/components/BoxWithShape';
import { StarIcon } from '@/components/Icons';
import { DropBox } from '@/components/DropBox/DropBox';
import keypomInstance from '@/lib/keypom';
import { toYocto } from '@/utils/toYocto';

import { ExistingWallet } from '../components/ExistingWallet';
import { CreateWallet } from '../components/CreateWallet';

interface TokenAsset {
  icon: string;
  value: number;
  symbol: string;
}

const ClaimTokenPage = () => {
  const navigate = useNavigate();
  const { secretKey = '' } = useParams();
  const [haveWallet, showInputWallet] = useBoolean(false);
  const [tokens, setTokens] = useState<TokenAsset[]>([]);
  const [walletsOptions, setWallets] = useState([]);
  const [isClaimSuccessful, setIsClaimSuccessful] = useState(false);
  const [isClaimLoading, setIsClaimLoading] = useState(false);
  const [claimError, setClaimError] = useState('');

  const loadClaimInfo = async () => {
    const {
      tokens: _tokens,
      amount,
      wallets,
    } = await keypomInstance.getTokenClaimInformation(secretKey);
    setTokens([
      {
        icon: _tokens.icon as string,
        value: toYocto(parseFloat(amount)),
        symbol: _tokens.symbol,
      },
    ]);
    setWallets(wallets);
  };

  useEffect(() => {
    if (secretKey === '') {
      navigate('/');
    }
    // eslint-disable-next-line
    loadClaimInfo();
  }, []);

  const handleClaim = async (walletAddress: string) => {
    setIsClaimLoading(true);
    try {
      await keypomInstance.claim(secretKey, walletAddress);
    } catch (err) {
      setClaimError(err);
    }
    setIsClaimLoading(false);
    setIsClaimSuccessful(true);
  };

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
                <CreateWallet wallets={walletsOptions} onClick={showInputWallet.on} />
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
