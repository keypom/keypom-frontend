import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
} from '@chakra-ui/react';

export interface WalletToken {
  symbol: string;
  amount: string;
  wallet: string;
  icon: React.ReactNode;
}

interface WalletBalanceInputProps {
  selectedWalletToken: Partial<WalletToken> | null;
  tokens: WalletToken[];
  onChange: (symbol: string) => void;
}

export const WalletSelectorMenu = ({
  tokens,
  onChange,
  selectedWalletToken,
}: WalletBalanceInputProps) => {
  const selectedWalletTokenIcon = tokens.find(
    (w) => w.symbol === selectedWalletToken?.symbol,
  )?.icon;
  const balancesMenuList = tokens.map((wallet) => (
    <MenuItem key={wallet.symbol} onClick={() => onChange(wallet.symbol)}>
      <HStack>
        <Box mr="3">{wallet.icon}</Box>
        <VStack align="flex-start">
          <Text>{wallet.symbol}</Text>
          <Text color="gray.400" size="sm">
            Balance: {wallet?.amount} {wallet?.symbol}
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
              {selectedWalletTokenIcon}
              <Text fontWeight="medium" lineHeight="2">
                {selectedWalletToken?.symbol}
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
