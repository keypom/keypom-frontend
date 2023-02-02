import { Box, type BoxProps, useToken } from '@chakra-ui/react';

interface RoundIconProps extends BoxProps {
  icon: React.ReactNode;
}

export const RoundIcon = ({ icon = null, ...props }: RoundIconProps) => {
  const [bgColor, borderBg] = useToken('colors', ['blue.100', 'border.round']);

  return (
    <Box
      alignItems="center"
      bg={`linear-gradient(${bgColor}, ${bgColor}) padding-box, ${borderBg} border-box`}
      border="2px solid transparent"
      borderRadius="100%"
      display="flex"
      h={{ base: '16', md: '20' }}
      justifyContent="center"
      padding="0.5"
      w={{ base: '16', md: '20' }}
      {...props}
    >
      {icon}
    </Box>
  );
};
