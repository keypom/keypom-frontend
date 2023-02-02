import { Box, type BoxProps, Image } from '@chakra-ui/react';

import { replaceSpace } from '@/utils/replaceSpace';

interface AvatarImageProps extends BoxProps {
  altName: string;
  imageSrc: string;
}

export const AvatarImage = ({ altName, imageSrc, ...props }: AvatarImageProps) => {
  return (
    <Box
      borderRadius={{ base: '5xl', md: '6xl' }}
      h={{ base: '7.5rem', md: '11.25rem' }}
      mb={{ base: '6', md: '10' }}
      position="relative"
      w={{ base: '7.5rem', md: '11.25rem' }}
      {...props}
    >
      <Image
        alt={replaceSpace(altName)}
        borderRadius={{ base: '5xl', md: '6xl' }}
        objectFit="cover"
        src={imageSrc}
      />
    </Box>
  );
};
