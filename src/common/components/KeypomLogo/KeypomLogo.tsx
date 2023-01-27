'use client';
import { HStack, Box, Text, Link } from '@chakra-ui/react';
import NextLink from 'next/link';

export const KeypomLogo = () => {
  return (
    <Link as={NextLink} href="/">
      <HStack spacing={{ base: 2, md: '2.5' }}>
        <Box bgColor="gray.800" h={{ base: 5, md: '7' }} rounded="full" w={{ base: 5, md: '7' }} />
        <Text color="gray.800" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="extrabold">
          Keypom
        </Text>
      </HStack>
    </Link>
  );
};
