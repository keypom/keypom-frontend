import { Box } from '@chakra-ui/react';
import { type PropsWithChildren } from 'react';

interface GradientSpanProps {
  color?: string;
}

/**
 *
 * @param color:color of the text in the span. By default, will give the
 * rainbow color gradient used in the landing page
 */
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
