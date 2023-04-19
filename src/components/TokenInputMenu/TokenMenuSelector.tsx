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

interface TokenSelectorMenuProps {
  selectedToken: IToken;
  tokens: IToken[];
  onChange: (symbol: string) => void;
}

export const TokenSelectorMenu = ({ tokens, onChange, selectedToken }: TokenSelectorMenuProps) => {
  const balancesMenuList = tokens.map((token) => (
    <MenuItem
      key={token.symbol}
      onClick={() => {
        onChange(token.symbol);
      }}
    >
      <HStack>
        <Box mr="3">
          <TokenIcon symbol={token.symbol} />
        </Box>
        <VStack align="flex-start">
          <Text>{token.symbol}</Text>
          <Text color="gray.400" size="sm">
            Balance: {token?.amount} {token?.symbol}
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
              <TokenIcon symbol={selectedToken.symbol} />
              <Text fontWeight="medium" lineHeight="2">
                {selectedToken.symbol ?? 'Select'}
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
