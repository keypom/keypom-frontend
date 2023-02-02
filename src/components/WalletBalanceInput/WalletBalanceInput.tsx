import { Box, Input, type InputProps } from '@chakra-ui/react';
import { type PropsWithChildren } from 'react';

import { CostDisplay } from './CostDisplay';
import { WalletSelectorMenu } from './WalletSelectorMenu';

export const WalletBalanceInput = ({ children, ...props }: PropsWithChildren<InputProps>) => {
  return (
    <Box position="relative">
      <Input placeholder="Enter an amount" type="number" {...props} />
      {children}
    </Box>
  );
};

WalletBalanceInput.TokenMenu = WalletSelectorMenu;
WalletBalanceInput.CostDisplay = CostDisplay;
