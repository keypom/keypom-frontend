import { Text, useBoolean, VStack } from '@chakra-ui/react';

import keypomInstance from '@/lib/keypom';
import { storeClaimDrop } from '@/utils/claimedDrops';
import getConfig from '@/config/config';

import { WalletOption } from './WalletOption';

interface CreateWalletProps {
  onClick: () => void;
  wallets: string[];
  contractId: string;
  secretKey: string;
  redirectUrl?: string;
}

const { supportedWallets } = getConfig();

const defaultWallet =
  supportedWallets.find((wallet) => wallet.id === 'mynearwallet') || supportedWallets[0];

export const CreateWallet = ({
  contractId,
  secretKey,
  onClick,
  wallets = ['mynearwallet'],
  redirectUrl,
}: CreateWalletProps) => {
  const [isClaimSuccessful, setSuccess] = useBoolean(false);

  const handleWalletClick = async (walletName: string) => {
    try {
      const url = await keypomInstance.generateExternalWalletLink(
        walletName,
        contractId,
        secretKey,
      );

      window.setTimeout(async () => {
        // check if the drop still exists after X seconds, if its claimed, then we should show a message
        const isDropExist = await keypomInstance.checkIfDropExists(secretKey);

        if (!isDropExist) {
          setSuccess.on();
          storeClaimDrop(secretKey);
        }
      }, 20000);

      if (redirectUrl) {
        return window.open(url + '?redirectUrl=' + redirectUrl, '_blank');
      }
      window.open(url, '_blank');
    } catch (err) {
      // drop has been claimed
      // refresh to show error
      window.location.reload();
    }
  };

  const walletOptions = supportedWallets

    // TODO replace with filter this is temporary
    // .filter((wallet) => wallets.includes(wallet.id))
    .filter((wallet) => wallet.id === 'mynearwallet')

    .map((options, index) => (
      <WalletOption
        key={index}
        handleWalletClick={async () => {
          await handleWalletClick(options.id);
        }}
        {...options}
      />
    ));

  if (isClaimSuccessful) {
    return <Text color="green.600">✅ Claim successful</Text>;
  }

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
