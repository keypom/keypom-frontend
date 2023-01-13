import { Box, Center, Heading, useBoolean, VStack } from '@chakra-ui/react';

import { PageHead } from '@/common/components/PageHead';
import { IconBox } from '@/common/components/IconBox';
import { BoxWithShape } from '@/common/components/BoxWithShape';
import { TicketIcon } from '@/common/components/Icons';

import { CreateWallet } from '@/modules/claim/CreateWallet';
import { ExistingWallet } from '@/modules/claim/ExistingWallet';
import { NftReward } from '@/modules/claim/nft/NftReward';

const ClaimNftPage = () => {
  const [haveWallet, showInputWallet] = useBoolean(false);

  return (
    <Box mb={{ base: '5', md: '14' }} minH="100%" minW="100%" mt={{ base: '52px', md: '100px' }}>
      <PageHead
        removeTitleAppend
        description="Page detailing all the claimed nft."
        name="Claim Nft"
      />
      <Center>
        {/** the additional gap is to accommodate for the absolute roundIcon size */}
        <VStack gap={{ base: 'calc(24px + 8px)', md: 'calc(32px + 10px)' }}>
          {/** Prompt text */}
          <Heading textAlign="center">{`You've received an NFT`}</Heading>

          {/** Claim nft component */}
          <IconBox
            icon={<TicketIcon height={{ base: '8', md: '10' }} width={{ base: '8', md: '10' }} />}
            maxW={{ base: '345px', md: '30rem' }}
            minW={{ base: 'inherit', md: '345px' }}
            p="0"
            pb="0"
            w="full"
          >
            <BoxWithShape
              bg="white"
              borderTopRadius="8xl"
              pb={{ base: '6', md: '8' }}
              pt={{ base: '12', md: '16' }}
              px={{ base: '6', md: '8' }}
              w="full "
            >
              {/** div placeholder */}
              <NftReward
                artworkSrc="https://vaxxeddoggos.com/assets/doggos/1042.png"
                description={`Here’s your cute character to commemorate the Danny Daze Annual event`}
                nftName="Danny Daze NFT"
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

export default ClaimNftPage;
