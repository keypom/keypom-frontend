import { Box, Image, Text } from '@chakra-ui/react';

interface ClaimTicketDetailsProps {
  imageSrc: string;
  ticketName: string;
}

export const ClaimTicketDetails = ({ imageSrc, ticketName }: ClaimTicketDetailsProps) => {
  return (
    <>
      <Box
        borderRadius={{ base: '5xl', md: '6xl' }}
        h={{ base: '7.5rem', md: '11.25rem' }}
        mb={{ base: '6', md: '8' }}
        position="relative"
        w={{ base: '7.5rem', md: '11.25rem' }}
      >
        {/** temporary image */}
        <Image
          alt="NFT image"
          borderRadius={{ base: '5xl', md: '6xl' }}
          objectFit="cover"
          src={imageSrc}
        />
      </Box>
      <Text
        color="gray.800"
        fontSize={{ base: 'xl', md: '2xl' }}
        fontWeight="500"
        lineHeight={{ base: '28px', md: '32px' }}
        mb={{ base: '2', md: '3' }}
        textAlign="center"
      >
        {ticketName}
      </Text>
    </>
  );
};
