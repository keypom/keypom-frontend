import { Box, ChakraProps, HStack, Image, Text, Link } from "@chakra-ui/react";

import { TwitterLogoIcon } from "@/common/components/Icons/TwitterLogoIcon";

import NEAR_LOGO from "assets/near_logo_wht.svg";

interface FooterProps extends ChakraProps {}

const TWITTER_LINK = "https://www.twitter.com";
const NEAR_LINK = "https://near.org/";

export const Footer = (props: FooterProps) => {
  return (
    // TODO: ask designer for color coded in design system
    <Box bgColor="#222734" {...props}>
      <HStack
        h="100px"
        marginX="auto"
        maxW={{ base: "400px", md: "1000px" }}
        spacing="auto"
      >
        {/* Powered by NEAR */}
        <Link href={NEAR_LINK} target="_blank">
          <HStack>
            <Text color="white" fontSize="20px" mr="14px" whiteSpace="nowrap">
              Powered by
            </Text>
            <Image alt="" h="25px" src={NEAR_LOGO.src} w="95px" />
          </HStack>
        </Link>

        {/* Follow us Twitter */}
        <Link href={TWITTER_LINK} target="_blank">
          <HStack align="center" justify="center">
            <TwitterLogoIcon fill="white" mr="2.5" mt="1px" />
            <Text color="white" fontSize="20px" m={0}>
              Follow us
            </Text>
          </HStack>
        </Link>
      </HStack>
    </Box>
  );
};
