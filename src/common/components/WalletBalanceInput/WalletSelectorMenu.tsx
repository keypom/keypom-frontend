import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  VStack,
} from '@chakra-ui/react';

import { Text } from '../Typography';

export interface ITokenBalance {
  symbol: string;
  amount: string;
  icon: React.ReactNode;
}

interface WalletBalanceInputProps {
  selectedWallet: ITokenBalance;
  tokens: ITokenBalance[];
  onChange: (symbol: string) => void;
}

export const WalletSelectorMenu = ({
  tokens,
  onChange,
  selectedWallet,
}: WalletBalanceInputProps) => {
  const selectedWalletIcon = tokens.find((w) => w.symbol === selectedWallet.symbol)?.icon;
  const balancesMenuList = tokens.map((wallet) => (
    <MenuItem key={wallet.symbol} onClick={() => onChange(wallet.symbol)}>
      <HStack>
        <Box mr="3">{wallet.icon}</Box>
        <VStack align="flex-start">
          <Text>{wallet.symbol}</Text>
          <Text color="gray.400" size="sm">
            Balance: {wallet.amount} {wallet.symbol}
          </Text>
        </VStack>
      </HStack>
    </MenuItem>
  ));

  return (
    <Menu>
      {({ isOpen }) => (
        <Box>
          <MenuButton
            as={Button}
            borderRadius="md"
            height="8"
            isActive={isOpen}
            p="0"
            position="absolute"
            right="3"
            top="2"
            variant="secondary"
            width="7.125rem"
            zIndex="2"
          >
            <HStack px="3">
              {selectedWalletIcon}
              <Text fontWeight="medium" lineHeight="2">
                {selectedWallet.symbol}
              </Text>
              <ChevronDownIcon />
            </HStack>
          </MenuButton>
          <MenuList>{balancesMenuList}</MenuList>
        </Box>
      )}
    </Menu>
  );
};
