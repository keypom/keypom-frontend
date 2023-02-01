import { Center, Heading, HStack, Image, Text } from '@chakra-ui/react';

import { GradientSpan } from '@/common/components/GradientSpan';

import NEAR_LOGO from 'assets/near_logo_blk.svg';

export const HeaderSection = () => {
  return (
    <Center flexDir="column" maxW="600px" mx="auto" py={{ base: '10', md: '16' }}>
      <Heading
        fontSize={{ base: '32px', md: '60px' }}
        fontWeight="600"
        lineHeight={{ base: '43px', md: '72px' }}
        mb={{ base: '4', md: '6' }}
        textAlign="center"
      >
        <GradientSpan>Instant</GradientSpan> crypto experiences
      </Heading>
      <Text
        fontSize={{ base: 'lg', md: 'xl' }}
        lineHeight="28px"
        mb={{ base: '6', md: '8' }}
        textAlign="center"
      >
        {`Drop tokens, experiences, and more. Let's onboard the masses with the click of a link.`}
      </Text>
      {/* Powered by NEAR */}
      <HStack>
        <Text color="gray.400" fontSize={{ base: 'md', md: 'lg' }}>
          Powered by
        </Text>
        <Image alt="" h="25px" src={NEAR_LOGO.src} w="95px" />
      </HStack>
    </Center>
  );
};
