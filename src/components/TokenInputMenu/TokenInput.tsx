import { Box, Input, type InputProps } from '@chakra-ui/react';
import { type PropsWithChildren } from 'react';

import { CostDisplay } from './CostDisplay';
import { TokenSelectorMenu } from './TokenMenuSelector';

export const TokenInput = ({ children, ...props }: PropsWithChildren<InputProps>) => {
  return (
    <Box position="relative">
      <Input placeholder="Enter an amount" type="number" {...props} />
      {children}
    </Box>
  );
};

TokenInput.TokenMenu = TokenSelectorMenu;
TokenInput.CostDisplay = CostDisplay;
