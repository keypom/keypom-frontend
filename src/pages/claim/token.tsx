import { Box, Button, Center, Text, useBoolean, VStack } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';

import { PageHead } from '@/common/components/PageHead';
import { IconBox } from '@/common/components/IconBox';
import { BoxWithShape } from '@/common/components/BoxWithShape';
import { StarIcon } from '@/common/components/Icons';

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
            <VStack
              bg="gray.50"
              borderBottomRadius="3xl"
              p="8"
              spacing={{ base: '4', md: '5' }}
              w="full"
            >
              {!haveWallet ? (
                <>
                  <Text color="gray.800" fontWeight="500">
                    Create a wallet to store your assets
                  </Text>
                  <VStack spacing="1" w="full">
                    {/** div placeholder */}
                    <Box
                      _hover={{
                        cursor: 'pointer',
                        bg: 'gray.100',
                      }}
                      bg="white"
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="xl"
                      h={{ base: '39px', md: '12' }}
                      w="full"
                    />
                    <Box
                      _hover={{
                        cursor: 'pointer',
                        bg: 'gray.100',
                      }}
                      bg="white"
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="xl"
                      h={{ base: '39px', md: '12' }}
                      w="full"
                    />
                    <Box
                      _hover={{
                        cursor: 'pointer',
                        bg: 'gray.100',
                      }}
                      bg="white"
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="xl"
                      h={{ base: '39px', md: '12' }}
                      w="full"
                    />
                  </VStack>
                  <Text
                    _hover={{
                      cursor: 'pointer',
                      color: 'gray.500',
                    }}
                    textDecor="underline"
                    onClick={showInputWallet.on}
                  >
                    I already have a wallet
                  </Text>
                </>
              ) : (
                <>
                  <Center
                    _hover={{
                      cursor: 'pointer',
                    }}
                    position="relative"
                    w="full"
                    onClick={showInputWallet.off}
                  >
                    <ChevronLeftIcon color="gray.400" h="5" left="0" position="absolute" w="5" />
                    <Text color="gray.800" fontWeight="500">
                      Send to existing wallet
                    </Text>
                  </Center>
                  {/** simulate input with label */}
                  <VStack gap="0" w="full">
                    <Text textAlign="left" w="full">
                      Your wallet address
                    </Text>
                    <Box
                      bg="white"
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="xl"
                      h={{ base: '39px', md: '12' }}
                      w="full"
                    />
                  </VStack>
                  <Button w="full">Submit</Button>
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
