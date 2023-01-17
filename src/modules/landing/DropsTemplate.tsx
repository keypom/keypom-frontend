import { Box, Button, Center, Flex, Hide, Image, Show, Text } from '@chakra-ui/react';

import { IconBox } from '@/common/components/IconBox';

interface DropsTemplateProps {
  imageNumber: number;
}

const IMAGES = ['/assets/nft_banner.png', '/assets/ticket_banner.png', '/assets/token_banner.png'];
const IMAGES_TOP_DISTANCE = ['calc(50% - 208px)', 'calc(50% - 188px)', 'calc(50% - 183px)'];

export const DropsTemplate = ({ imageNumber }: DropsTemplateProps) => {
  return (
    <>
      {/** Outer box helps to set component's padding */}
      <IconBox borderRadius={{ base: '1rem', md: '8xl' }} mb="4" overflow="hidden" p="0" pb="0">
        <Show above="md">
          <Box
            bg="linear-gradient(180deg, rgba(255, 207, 234, 0) 0%, #30c9f34b 100%)"
            bottom="-123px"
            filter="blur(100px)"
            h="793px"
            overflow="hidden"
            position="absolute"
            right="-123px"
            transform="rotate(30deg)"
            w="606px"
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
            <Hide above="md">
              <Box
                bg="linear-gradient(180deg, rgba(255, 207, 234, 0) 0%, #30c9f34b 100%)"
                bottom="-123px"
                filter="blur(100px)"
                h="400px"
                overflow="hidden"
                position="absolute"
                right="-123px"
                transform="rotate(30deg)"
                w="300px"
              />
            </Hide>

            <Text
              color="blue.400"
              fontSize={{ base: 'base', md: 'lg' }}
              fontWeight="500"
              lineHeight={{ base: '24px', md: '28px' }}
              mb="1"
            >
              Token Drops
            </Text>
            <Text
              color="gray.900"
              fontSize={{ base: 'xl', md: '3xl' }}
              fontWeight="500"
              lineHeight={{ base: '28px', md: '36px' }}
              mb="4"
            >
              Instantly drop tokens in a link.
            </Text>
            <Text
              color="gray.400"
              fontSize={{ base: 'base', md: '2xl' }}
              lineHeight={{ base: '24px', md: '32px' }}
              mb={{ base: '6', md: '28px' }}
            >
              Great for giveaways, promotions, and marketing
            </Text>
            <Button variant="landing" w="fit-content">
              Create a Token Drop
            </Button>
          </Flex>
          <Center
            flex={{ base: 'auto', md: '1' }}
            h={{ base: '220px', md: '548px' }}
            overflow="hidden"
            position="relative"
          >
            <Hide above="md">
              <Box
                bg="linear-gradient(180deg, rgba(255, 207, 234, 0) 0%, #30c9f34b 100%)"
                bottom="-123px"
                filter="blur(100px)"
                h="400px"
                overflow="hidden"
                position="absolute"
                right="-123px"
                transform="rotate(30deg)"
                w="300px"
              />
            </Hide>

            <Image
              alt="template_image"
              objectFit="cover"
              objectPosition="50% 0px"
              position="absolute"
              src={IMAGES[imageNumber]}
              top={{ base: '2', md: IMAGES_TOP_DISTANCE[imageNumber] }}
              w="80%"
            />
          </Center>
        </Flex>
      </IconBox>
    </>
  );
};
