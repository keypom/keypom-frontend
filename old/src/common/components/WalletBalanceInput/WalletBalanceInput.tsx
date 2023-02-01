import { Box, Input, InputProps } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

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
