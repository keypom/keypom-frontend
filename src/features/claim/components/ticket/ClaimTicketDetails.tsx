import { Box, Text, VStack } from '@chakra-ui/react';

import { AvatarImage } from '@/components/AvatarImage';
import { DROP_TYPE } from '@/constants/common';
import { DropBox } from '@/components/DropBox';

import { useClaimForm } from '../ClaimFormContext';

export const ClaimTicketDetails = () => {
  const { nftImage, title, giftType, tokens } = useClaimForm();
  return (
    <>
      <Box
        borderRadius={{ base: '5xl', md: '6xl' }}
        h={giftType === DROP_TYPE.NFT ? { base: '7.5rem', md: '11.25rem' } : {}}
        mb={{ base: '6', md: '8' }}
        position="relative"
        w={{ base: '7.5rem', md: '11.25rem' }}
      >
        {giftType === DROP_TYPE.NFT ? (
          <AvatarImage altName="NFT image" imageSrc={nftImage} />
        ) : (
          <VStack>
            {tokens?.map(({ icon, value, symbol }, index) => (
              <DropBox key={index} icon={icon} symbol={symbol} value={value} />
            ))}
          </VStack>
        )}
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
        {title}
      </Text>
    </>
  );
};
