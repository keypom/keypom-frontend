import { Box, type ChakraProps, HStack, Text, Link, Flex } from '@chakra-ui/react';
import React from 'react';

import { TwitterLogoIcon, LogoWhite } from '@/components/Icons';

type FooterProps = ChakraProps;

const TWITTER_LINK = 'https://www.twitter.com';
const NEAR_LINK = 'https://near.org/';

export const Footer = (props: FooterProps) => {
  return (
    // TODO: ask designer for color coded in design system
    <Box bgColor="#222734" {...props}>
      <Flex
        color="white"
        flexWrap="wrap"
        gap="2"
        justifyContent="space-between"
        marginX="auto"
        maxW="75rem"
        px="5"
        py="6"
      >
        {/* Powered by NEAR */}
        <Link href={NEAR_LINK} target="_blank">
          <HStack>
            <Text fontSize={{ base: 'md', md: 'xl' }} mr="3.5" whiteSpace="nowrap">
              Powered by
            </Text>
            <LogoWhite h="25px" w="95px" />
          </HStack>
        </Link>

        {/* Follow us Twitter */}
        <Link href={TWITTER_LINK} target="_blank">
          <HStack align="center" justify="center">
            <TwitterLogoIcon mr="2.5" mt="1px" />
            <Text fontSize={{ base: 'md', md: 'xl' }} m={0}>
              Follow us
            </Text>
          </HStack>
        </Link>
      </Flex>
    </Box>
  );
};
