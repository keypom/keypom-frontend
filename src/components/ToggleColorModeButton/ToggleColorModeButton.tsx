import { useColorMode, Button } from '@chakra-ui/react';

export const ToggleColorModeButton = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Button onClick={toggleColorMode}>
      Switch to {colorMode === 'light' ? 'dark' : 'light'} mode
    </Button>
  );
};
