import { Box, Text, VStack } from '@chakra-ui/react';

import { AvatarImage } from '@/components/AvatarImage';
import { DROP_TYPE } from '@/constants/common';
import { DropBox } from '@/components/DropBox';

import { useClaimForm } from '../ClaimFormContext';

export const ClaimTicketDetails = () => {
  const { nftImage, title, description, giftType, tokens } = useClaimForm();
  return (
    <>
      <Box>
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
        maxH="100px"
        mb={{ base: '2', md: '3' }}
        overflowY="auto"
        size={{ base: 'xl', md: '2xl' }}
        textAlign="center"
      >
        {title}
      </Text>
      {description?.length > 0 && (
        <Text
          color="gray.600"
          maxH="200px"
          overflowY="auto"
          size={{ base: 'sm', md: 'base' }}
          style={{ marginBottom: 16 }}
        >
          {description}
        </Text>
      )}
    </>
  );
};
