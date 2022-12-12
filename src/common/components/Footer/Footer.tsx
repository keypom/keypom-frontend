import { Box, ChakraProps, HStack, Image, Text, Link } from '@chakra-ui/react';
import { TwitterLogoIcon } from '@/common/components/Icons/TwitterLogoIcon';
import NEAR_LOGO from 'assets/near_logo_wht.svg';

interface IFooter extends ChakraProps {}

const TWITTER_LINK = 'https://www.twitter.com';
const NEAR_LINK = 'https://near.org/';

export const Footer: React.FC<IFooter> = (props) => {
  return (
    <Box bgColor="#222734" {...props}>
      <HStack marginX="auto" maxW={[400, 1000]} h="100px" spacing="auto">
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
            <TwitterLogoIcon h="24" w="27" mr="9px" mt="1px" />
            <Text m={0} color="white" fontSize="20px">
              Follow us
            </Text>
          </HStack>
        </Link>
      </HStack>
    </Box>
  );
};
