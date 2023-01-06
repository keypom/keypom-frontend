import { Box, Center, Text, useBoolean, VStack } from '@chakra-ui/react';

import { PageHead } from '@/common/components/PageHead';
import { IconBox } from '@/common/components/IconBox';
import { BoxWithShape } from '@/common/components/BoxWithShape';
import { StarIcon } from '@/common/components/Icons';

import { CreateWallet } from '@/modules/claim/CreateWallet';
import { ExistingWallet } from '@/modules/claim/ExistingWallet';
import { DropBox } from '@/modules/claim/token/DropBox';

const ClaimTokenPage = () => {
  const [haveWallet, showInputWallet] = useBoolean(false);

  return (
    <Box mb={{ base: '5', md: '14' }} minH="100%" minW="100%" mt={{ base: '52px', md: '100px' }}>
      <PageHead
        removeTitleAppend
        description="Page detailing all the claimed tokens."
        name="Claim Tokens"
      />
      <Center>
        {/** the additional gap is to accommodate for the absolute roundIcon size */}
        <VStack gap={{ base: 'calc(24px + 8px)', md: 'calc(32px + 10px)' }}>
          {/** Prompt text */}
          <Text>{`You've received a Keypom Drop!`}</Text>

          {/** Claim token component */}
          <IconBox icon={<StarIcon />} minW={{ base: '345px', md: '30rem' }} p="0" pb="0">
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
                {[1, 2, 3].map((_, index) => (
                  <DropBox key={index} coin="ETH" value={index} />
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

export default ClaimTokenPage;
