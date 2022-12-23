import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  HStack,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  VStack,
} from '@chakra-ui/react';

import { Text } from '../Typography';

export interface IWalletBalance {
  symbol: string;
  amount: number;
  icon: React.ReactNode;
}

interface WalletBalanceInputProps {
  selectedWallet: IWalletBalance;
  walletBalances: IWalletBalance[];
  onAmountChange: (amountValue: string) => void;
  onOptionClick: (walletSymbol: string) => void;
  amountValue: number;
  totalCost: number;
}

export const WalletBalanceInput = ({
  amountValue,
  selectedWallet,
  walletBalances = [],
  onAmountChange,
  onOptionClick,
  totalCost,
}: WalletBalanceInputProps) => {
  const balancesMenuList = walletBalances.map((wallet) => (
    <MenuItem key={wallet.symbol} onClick={() => onOptionClick(wallet.symbol)}>
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

  const totalCostText =
    totalCost !== undefined && !Number.isNaN(totalCost)
      ? `Total cost: ${totalCost} ${selectedWallet.symbol}`
      : '';

  return (
    <Box>
      <Input type="number" value={amountValue} onChange={(e) => onAmountChange(e.target.value)} />
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
              variant="secondary"
              width="7.125rem"
              // rightIcon={<ChevronDownIcon />}
            >
              <HStack px="3">
                {selectedWallet.icon}
                <Text fontWeight="medium">{selectedWallet.symbol}</Text>
                <ChevronDownIcon />
              </HStack>
            </MenuButton>
            <MenuList>{balancesMenuList}</MenuList>
          </Box>
        )}
      </Menu>
      <HStack mt="1.5" spacing="auto">
        <Text color="gray.400" fontSize="sm">
          {totalCostText}
        </Text>
        <Text color="gray.400" fontSize="sm">
          Balance: {selectedWallet.amount} {selectedWallet.symbol}
        </Text>
      </HStack>
    </Box>
  );
};
