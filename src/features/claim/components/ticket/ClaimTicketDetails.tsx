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
        fontWeight="500"
        maxH="300px"
        mb={{ base: '2', md: '3' }}
        overflowY="scroll"
        size={{ base: 'xl', md: '2xl' }}
        textAlign="center"
      >
        {ticketName}
      </Text>
    </>
  );
};
