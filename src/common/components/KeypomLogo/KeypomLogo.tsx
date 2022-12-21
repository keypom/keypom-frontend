import { HStack, Box, Text } from '@chakra-ui/react';
import NextLink from 'next/link';

export const KeypomLogo = () => {
  return (
    <NextLink href="/">
      <HStack cursor="pointer" spacing={{ base: 2, md: '2.5' }}>
        <Box bgColor="gray.800" h={{ base: 5, md: '7' }} rounded="full" w={{ base: 5, md: '7' }} />
        <Text as="b" fontSize={{ base: 'xl', md: '2xl' }}>
          Keypom
        </Text>
      </HStack>
    </NextLink>
  );
};
