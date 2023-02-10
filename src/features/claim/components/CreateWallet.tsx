import { Text, VStack } from '@chakra-ui/react';

import { WalletOption, type WalletOptionProps } from './WalletOption';

interface CreateWalletProps {
  onClick: () => void;
}

const CREATE_WALLET_OPTIONS: WalletOptionProps[] = [
  { coin: 'NEAR', walletName: 'NEAR', externalLink: 'https://wallet.near.org/create' },
  {
    coin: 'MYNEAR',
    walletName: 'My Near',
    externalLink: 'https://app.mynearwallet.com/create',
  },
  { coin: 'HERE', walletName: 'My HERE', externalLink: 'https://herewallet.app/' },
];

export const CreateWallet = ({ onClick }: CreateWalletProps) => {
  return (
    <>
      <Text color="gray.800" fontWeight="500" size={{ base: 'md', md: 'lg' }}>
        Create a wallet to store your assets
      </Text>
      <VStack spacing="1" w="full">
        {CREATE_WALLET_OPTIONS.map((options, index) => (
          <WalletOption key={index} {...options} />
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
