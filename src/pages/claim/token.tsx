import { Box, Center, Text, VStack } from '@chakra-ui/react';

import { PageHead } from '@/common/components/PageHead';
import { IconBox } from '@/common/components/IconBox';
import { BoxWithShape } from '@/common/components/BoxWithShape';
import { StarIcon } from '@/common/components/Icons';

const ClaimTokenPage = () => {
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
              borderTopRadius="3xl"
              pb={{ base: '6', md: '8' }}
              pt={{ base: '12', md: '16' }}
              px={{ base: '6', md: '8' }}
              shapeSize="md"
              w="full "
            >
              <VStack>
                {/** div placeholder */}
                <Box
                  bg="gray.100"
                  border="1px solid"
                  borderColor="blue.200"
                  h={{ base: '12', md: '62px' }}
                  rounded="full"
                  w="full"
                />
                <Box
                  bg="gray.100"
                  border="1px solid"
                  borderColor="blue.200"
                  h={{ base: '12', md: '62px' }}
                  rounded="full"
                  w="full"
                />
              </VStack>
            </BoxWithShape>
            <VStack bg="gray.50" borderBottomRadius="3xl" gap="5" p="8" w="full">
              <Text>Create a wallet to store your assets</Text>
              <VStack gap="1" w="full">
                {/** div placeholder */}
                <Box
                  bg="white"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="xl"
                  h={{ base: '39px', md: '12' }}
                  w="full"
                />
                <Box
                  bg="white"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="xl"
                  h={{ base: '39px', md: '12' }}
                  w="full"
                />
                <Box
                  bg="white"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="xl"
                  h={{ base: '39px', md: '12' }}
                  w="full"
                />
              </VStack>
              <Text textDecor="underline">I already have a wallet</Text>
            </VStack>
          </IconBox>
        </VStack>
      </Center>
    </Box>
  );
};

export default ClaimTokenPage;
