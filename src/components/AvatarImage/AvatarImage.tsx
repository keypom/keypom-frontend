import { Box, type BoxProps, Skeleton, Image as ChakraImage } from '@chakra-ui/react';
import { useState } from 'react';

import { replaceSpace } from '@/utils/replaceSpace';

interface AvatarImageProps extends BoxProps {
  altName: string;
  imageSrc: string;
}

export const AvatarImage = ({ altName, imageSrc, ...props }: AvatarImageProps) => {
  const [src, setSrc] = useState(imageSrc);

  return (
    <Box
      borderRadius={{ base: '5xl', md: '6xl' }}
      h={{ base: '7.5rem', md: '11.25rem' }}
      mb={{ base: '6', md: '10' }}
      position="relative"
      w={{ base: '7.5rem', md: '11.25rem' }}
      {...props}
    >
      <ChakraImage
        alt={replaceSpace(altName)}
        borderRadius={{ base: '5xl', md: '6xl' }}
        fallback={<Skeleton borderRadius={{ base: '5xl', md: '6xl' }} height="100%" />}
        objectFit="cover"
        position="absolute"
        src={src}
        top={0}
        onError={() => {
          setSrc('/assets/image-not-found.png');
        }}
      />
    </Box>
  );
};
