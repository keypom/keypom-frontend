import { Box, Center, Heading, Text, VStack } from '@chakra-ui/react';

const Scanner = () => {
  return (
    <Box mb={{ base: '5', md: '14' }} minH="100%" minW="100%" mt={{ base: '52px', md: '100px' }}>
      <Center>
        <VStack gap={{ base: 'calc(24px + 8px)', md: 'calc(32px + 10px)' }}>
          <Heading textAlign="center">Scanner</Heading>
          {/** keypom scanner placeholder */}
          <Center
            bgColor={'rgba(0,0,0,0.3)'}
            minH={{ base: '280px', md: '440px' }}
            minW={{ base: '280px', md: '440px' }}
          >
            <Text color={'rgba(0,0,0,0.3)'} size="3xl" transform={'rotate(-45deg)'}>
              Keypom Scanner
            </Text>
          </Center>
        </VStack>
      </Center>
    </Box>
  );
};

export default Scanner;
