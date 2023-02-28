import { Center, type CenterProps, Text } from '@chakra-ui/react';

import { CoinIcon } from '@/components/CoinIcon';

export interface WalletOptionProps extends CenterProps {
  symbol: string;
  walletName: string;
  handleWalletClick: () => void;
}

export const WalletOption = ({
  symbol,
  walletName,
  handleWalletClick,
  ...props
}: WalletOptionProps) => {
  return (
    <Center
      _hover={{
        cursor: 'pointer',
        bg: 'gray.100',
      }}
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius={{ base: '5xl', md: '6xl' }}
      h={{ base: '39px', md: '12' }}
      position="relative"
      px="4"
      py="2"
      w="full"
      onClick={handleWalletClick}
      {...props}
    >
      {/** wallet logo */}
      <CoinIcon h="6" left="4" position="absolute" symbol={symbol} w="6" />
      <Text size={{ base: 'sm', md: 'md' }}>{walletName} Wallet</Text>
    </Center>
  );
};
