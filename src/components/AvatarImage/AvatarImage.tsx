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
      mb={{ base: '2', md: '4' }}
      position="relative"
      {...props}
    >
      <ChakraImage
        alt={replaceSpace(altName)}
        borderRadius={{ base: '5xl', md: '6xl' }}
        fallback={<Skeleton borderRadius={{ base: '5xl', md: '6xl' }} height="100%" />}
        objectFit="cover"
        src={src}
        top={0}
        onError={() => {
          setSrc('/assets/image-not-found.webp');
        }}
      />
    </Box>
  );
};
