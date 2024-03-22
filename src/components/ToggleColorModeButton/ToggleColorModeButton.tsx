import { useColorMode, Button } from '@chakra-ui/react';

export const ToggleColorModeButton = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  console.log('colorMode', colorMode);
  console.log('toggleColorMode', toggleColorMode);
  return (
    <Button onClick={toggleColorMode}>
      Switch to {colorMode === 'light' ? 'dark' : 'light'} mode
    </Button>
  );
};
