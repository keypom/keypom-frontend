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

import { type IToken } from '@/types/common';
import { TokenIcon } from '@/components/TokenIcon';

interface WalletBalanceInputProps {
  selectedWalletToken: Pick<IToken, 'amount' | 'symbol'>;
  tokens: IToken[];
  onChange: (symbol: string) => void;
}

export const WalletSelectorMenu = ({
  tokens,
  onChange,
  selectedWalletToken,
}: WalletBalanceInputProps) => {
  const balancesMenuList = tokens.map((wallet) => (
    <MenuItem
      key={wallet.symbol}
      onClick={() => {
        onChange(wallet.symbol);
      }}
    >
      <HStack>
        <Box mr="3">
          <TokenIcon symbol={wallet.symbol} />
        </Box>
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
            <HStack justifyContent="space-around" px="3">
              <TokenIcon symbol={selectedWalletToken.symbol} />
              <Text fontWeight="medium" lineHeight="2">
                {selectedWalletToken.symbol ?? 'Select'}
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
