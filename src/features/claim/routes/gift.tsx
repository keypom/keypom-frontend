import { Box, Center, Heading, useBoolean, VStack } from '@chakra-ui/react';

import { IconBox } from '@/components/IconBox';
import { BoxWithShape } from '@/components/BoxWithShape';
import { TicketIcon } from '@/components/Icons';

import { CreateWallet } from '../components/CreateWallet';
import { ExistingWallet } from '../components/ExistingWallet';
import { GiftDetails } from '../components/gift/GiftDetails';

const ClaimGiftPage = () => {
  const [haveWallet, showInputWallet] = useBoolean(false);

  return (
    <Box mb={{ base: '5', md: '14' }} minH="100%" minW="100%" mt={{ base: '52px', md: '100px' }}>
      <Center>
        {/** the additional gap is to accommodate for the absolute roundIcon size */}
        <VStack gap={{ base: 'calc(24px + 8px)', md: 'calc(32px + 10px)' }}>
          {/** Prompt text */}
          <Heading textAlign="center">{`Collect your gifts`}</Heading>

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
              <GiftDetails
                giftName="Vaxxed Doggos NFT"
                imageSrc={'https://vaxxeddoggos.com/assets/doggos/1042.png'}
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
                <CreateWallet onClick={showInputWallet.on} />
              ) : (
                <>
                  {/** TODO: handleSubmit button */}
                  <ExistingWallet handleSubmit={() => null} onBack={showInputWallet.off} />
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
