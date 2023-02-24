import { Text, VStack } from '@chakra-ui/react';

import { WALLET_OPTIONS } from '@/constants/common';
import keypomInstance from '@/lib/keypom';

import { WalletOption } from './WalletOption';

interface CreateWalletProps {
  onClick: () => void;
  wallets: string[];
  contractId: string;
  secretKey: string;
}

const defaultWallet = WALLET_OPTIONS[0];

export const CreateWallet = ({
  contractId,
  secretKey,
  onClick,
  wallets = ['mynearwallet'],
}: CreateWalletProps) => {
  const handleWalletClick = async (walletName: string) => {
    const url = await keypomInstance.generateExternalWalletLink(walletName, contractId, secretKey);
    window.location.href = url;
  };

  const walletOptions = WALLET_OPTIONS.filter((wallet) => wallets.includes(wallet.id)).map(
    (options, index) => (
      <WalletOption
        key={index}
        handleWalletClick={async () => {
          await handleWalletClick(options.id);
        }}
        {...options}
      />
    ),
  );

  return (
    <>
      <Text color="gray.800" fontWeight="500" size={{ base: 'md', md: 'lg' }}>
        Create a wallet to store your assets
      </Text>
      <VStack spacing="1" w="full">
        {walletOptions.length !== 0 ? (
          walletOptions
        ) : (
          <WalletOption
            handleWalletClick={async () => {
              await handleWalletClick(defaultWallet?.id);
            }}
            {...defaultWallet}
          />
        )}
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
