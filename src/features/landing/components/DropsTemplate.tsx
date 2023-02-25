import { Box, Button, Center, Flex, Hide, Image, Show, Text } from '@chakra-ui/react';

import { IconBox } from '@/components/IconBox';

interface DropsTemplateProps {
  imageNumber: number;
  subHeadingText: string;
  headingText: string;
  description: string;
  ctaText: string;
  ctaDisabled: boolean;
  ctaOnClick: () => void;
}

const IMAGES = ['/assets/token_banner.png', '/assets/ticket_banner.png', '/assets/nft_banner.png'];
const IMAGES_TOP_DISTANCE = ['calc(50% - 208px)', 'calc(50% - 188px)', 'calc(50% - 240px)'];

export const DropsTemplate = ({
  imageNumber,
  subHeadingText,
  headingText,
  description,
  ctaText,
  ctaDisabled,
  ctaOnClick,
}: DropsTemplateProps) => {
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

            <Text color="blue.400" fontWeight="500" mb="1" size={{ base: 'md', md: 'lg' }}>
              {subHeadingText}
            </Text>
            <Text color="gray.900" fontWeight="500" mb="4" size={{ base: 'xl', md: '3xl' }}>
              {headingText}
            </Text>
            <Text color="gray.400" mb={{ base: '6', md: '28px' }} size={{ base: 'md', md: '2xl' }}>
              {description}
            </Text>
            <Button isDisabled={ctaDisabled} variant="landing" w="fit-content" onClick={ctaOnClick}>
              {ctaText}
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
