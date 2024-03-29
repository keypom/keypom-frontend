import { Box, Text, VStack } from '@chakra-ui/react';

import { AvatarImage } from '@/components/AvatarImage';
import { DROP_TYPE } from '@/constants/common';
import { DropBox } from '@/components/DropBox';
import { type TokenAsset } from '@/types/common';

interface DropClaimMetadataProps {
  nftImage?: string;
  title?: string;
  description?: string;
  type: keyof typeof DROP_TYPE;
  tokens?: TokenAsset[];
}

export const DropClaimMetadata = ({
  nftImage,
  title,
  description,
  type,
  tokens,
}: DropClaimMetadataProps) => {
  return (
    <>
      <Box>
        {type === DROP_TYPE.NFT ? (
          <AvatarImage altName="NFT image" imageSrc={nftImage as string} />
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
      {description && description?.length > 0 && (
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
