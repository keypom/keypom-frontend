import { Box, Button, Flex, Show, Text } from '@chakra-ui/react';
import { Image } from '@chakra-ui/react';

import { IconBox } from '@/components/IconBox';

const LandingPage = () => {
  const subHeadingText = 'Keypom Presents';
  const headingText = 'NEAR @ ETH Denver';
  const description = 'Come check out all our scrumptious bounties!';
  const ctaText = 'Bounties';

  return (
    <>
      {/** Outer box helps to set component's padding */}
      <IconBox
        borderRadius={{ base: '1rem', md: '8xl' }}
        mb="4"
        mt="4"
        overflow="hidden"
        p="0"
        pb="0"
      >
        <Show above="md">
          <Box
            bg="linear-gradient(180deg, rgba(255, 207, 234, 0) 0%, #30c9f34b 100%)"
            bottom="-123px"
            filter="blur(100px)"
            overflow="hidden"
            position="absolute"
            right="-123px"
            transform="rotate(30deg)"
          />
        </Show>
        {/** Flex to set flex direction depending on the screen width */}
        <Flex flexDir={{ base: 'column-reverse', md: 'row' }}>
          <Flex
            flex={{ base: 'auto', md: '1' }}
            flexDir="column"
            justify="center"
            overflow="hidden"
            pl={{ base: '8', md: '16' }}
            position="relative"
            pr={{ base: '8', md: '0' }}
            py={{ base: '8', md: 'auto' }}
            textAlign="left"
          >

<Text color="gray.900" fontWeight="500" mb="4" size={{ base: 'xl', md: '3xl' }}>
              PLUSHIE GIVEAWAY
            </Text>

<Text color="blue" fontWeight="500" mb="4" size={{ base: 'xl', md: '3xl' }}>
              <a href="https://twitter.com/keypomxyz/status/1632452700230279168?s=20" target="_blank">Instructions on how to win Sunday, March 5th</a>
            </Text>

      <Image alt="keypom-logo" src="/assets/plushie.jpg" w={{ base: '200px', md: '300px' }} />
      <br/>
              <br/>
            <Text color="blue.400" fontWeight="500" mb="1" size={{ base: 'md', md: 'lg' }}>
              {subHeadingText}
            </Text>
            <Text color="gray.900" fontWeight="500" mb="4" size={{ base: 'xl', md: '3xl' }}>
              {headingText}
            </Text>
            <Text color="gray.400" mb={{ base: '6', md: '28px' }} size={{ base: 'md', md: '2xl' }}>
              {description}
            </Text>
            <Button
              variant="landing"
              w="fit-content"
              onClick={() => window.open('https://app.buidlbox.io/guidl/near', '_blank')}
            >
              {ctaText}
            </Button>
          </Flex>
        </Flex>
      </IconBox>
    </>
  );
};

export default LandingPage;
