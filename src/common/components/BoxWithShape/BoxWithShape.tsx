import { Box, BoxProps } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

type ShapeSize = 'sm' | 'md' | 'lg';
interface BoxWithShapeProps extends BoxProps {
  shapeSize?: ShapeSize;
}

export const BoxWithShape = ({
  children,
  shapeSize = 'md',
  bg,
  ...props
}: PropsWithChildren<BoxWithShapeProps>) => {
  let _size;
  switch (shapeSize) {
    case 'sm':
      _size = 12;
      break;
    case 'md':
    default:
      _size = 16;
      break;
    case 'lg':
      _size = 24;
      break;
  }

  return (
    <Box
      _after={{
        content: '""',
        position: 'absolute',
        left: 0,
        right: 0,
        margin: '0 auto',
        width: 0,
        height: 0,
        borderLeft: `${_size}px solid transparent`,
        borderRight: `${_size}px solid transparent`,
        borderTop: `${_size}px solid var(--chakra-colors-gray-200)`,
        bottom: `-${_size}px`,
        zIndex: '10',
      }}
      bg={bg}
      borderBottom="2px solid"
      borderColor="gray.200"
      position="relative"
      {...props}
    >
      {children}
      <Box
        borderLeft={`${_size - 3}px solid transparent`}
        borderRight={`${_size - 3}px solid transparent`}
        borderTop={`${_size - 3}px solid`}
        borderTopColor={bg}
        bottom={`-${_size - 3}px`}
        height={0}
        left={0}
        margin="0 auto"
        position="absolute"
        right={0}
        width={0}
        zIndex="11"
      />
    </Box>
  );
};
