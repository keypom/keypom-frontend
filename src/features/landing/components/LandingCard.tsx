import { Box, type BoxProps, Button, Flex, Text } from '@chakra-ui/react';

import { IconBox } from '@/components/IconBox';

interface LandingCardProps extends BoxProps {
  header: string;
  description: string;
  buttonText: string;
  onClick: () => void;
}

export const LandingCard = ({
  header,
  description,
  buttonText,
  onClick,
  ...props
}: LandingCardProps) => {
  return (
    <IconBox borderRadius={{ base: '1rem', md: '8xl' }} overflow="hidden" p="0" pb="0" {...props}>
      <Box
        bg="linear-gradient(180deg, rgba(255, 207, 234, 0) 0%, #30c9f34b 100%)"
        bottom="-75"
        filter="blur(100px)"
        h="300px"
        overflow="hidden"
        position="absolute"
        right="-75"
        transform="rotate(30deg)"
        w="300px"
      />
      <Flex flexDir="column" justify="flex-start" p={{ base: '8', md: '16' }}>
        <Text
          color="gray.900"
          fontWeight="500"
          mb={{ base: '2', md: '3' }}
          size={{ base: 'lg', md: '2xl' }}
          textAlign="left"
        >
          {header}
        </Text>
        <Text
          color={{ base: 'gray.600', md: 'gray.400' }}
          fontSize={{ base: 'md', md: 'lg' }}
          lineHeight={{ base: '18px', md: '28px' }}
          mb={{ base: '4', md: '6' }}
          textAlign="left"
        >
          {description}
        </Text>
        <Button bg="white" variant="outline" w="fit-content" onClick={onClick}>
          {buttonText}
        </Button>
      </Flex>
    </IconBox>
  );
};
