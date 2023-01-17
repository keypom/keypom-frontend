import { Box } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

interface GradientSpanProps {
  color?: string;
}
export const GradientSpan = ({
  children,
  color = 'linear-gradient(97.7deg, #FB50BF 14%, #00AEDF 49.33%)',
}: PropsWithChildren<GradientSpanProps>) => {
  return (
    <Box as="span" bg={color} bgClip="text">
      {children}
    </Box>
  );
};
