import { Box, ChakraProps, HStack, Image, Text, Link } from '@chakra-ui/react';
import { TwitterLogoIcon } from '@/common/components/Icons/TwitterLogoIcon';
import NEAR_LOGO from 'assets/near_logo_wht.svg';

interface FooterProps extends ChakraProps {}

const TWITTER_LINK = 'https://www.twitter.com';
const NEAR_LINK = 'https://near.org/';

export const Footer = (props: FooterProps) => {
  return (
    // TODO: ask designer for color coded in design system
    <Box bgColor="#222734" {...props}>
      <HStack
        marginX="auto"
        maxW={{ base: '400px', md: '1000px' }}
        h="100px"
        spacing="auto"
      >
        {/* Powered by NEAR */}
        <Link href={NEAR_LINK} target="_blank">
          <HStack>
            <Text color="white" fontSize="20px" whiteSpace="nowrap" mr="14px">
              Powered by
            </Text>
            <Image src={NEAR_LOGO.src} alt="" w="95px" h="25px" />
          </HStack>
        </Link>

        {/* Follow us Twitter */}
        <Link href={TWITTER_LINK} target="_blank">
          <HStack align="center" justify="center">
            <TwitterLogoIcon mr="2.5" mt="1px" fill="white" />
            <Text m={0} color="white" fontSize="20px">
              Follow us
            </Text>
          </HStack>
        </Link>
      </HStack>
    </Box>
  );
};
