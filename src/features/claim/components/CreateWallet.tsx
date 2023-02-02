import { Text, VStack } from '@chakra-ui/react';

import { WalletOption } from './WalletOption';

interface CreateWalletProps {
  onClick: () => void;
}

const CREATE_WALLET_TEST_DATA = [
  { coin: 'NEAR', walletName: 'NEAR' },
  { coin: 'HERE', walletName: 'My HERE' },
  { coin: 'ETH', walletName: 'Metamask' },
];

export const CreateWallet = ({ onClick }: CreateWalletProps) => {
  return (
    <>
      <Text color="gray.800" fontWeight="500" size={{ base: 'md', md: 'lg' }}>
        Create a wallet to store your assets
      </Text>
      <VStack spacing="1" w="full">
        {CREATE_WALLET_TEST_DATA.map(({ coin, walletName }, index) => (
          <WalletOption key={index} coin={coin} walletName={walletName} />
        ))}
      </VStack>
      <Text
        _hover={{
          cursor: 'pointer',
          color: 'gray.500',
        }}
        textDecor="underline"
        onClick={onClick}
      >
        I already have a wallet
      </Text>
    </>
  );
};
