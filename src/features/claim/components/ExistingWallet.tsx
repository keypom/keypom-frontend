import { Button, Center, Spinner, Text } from '@chakra-ui/react';
import { useState } from 'react';

import { ChevronLeftIcon } from '@/components/Icons';
import { TextInput } from '@/components/TextInput';

interface ExistingWalletProps {
  onBack: () => void;
  handleSubmit: (walletAddress: string) => Promise<void>;
  isSuccess: boolean;
  isLoading: boolean;
  claimErrorText: string;
}

export const ExistingWallet = ({
  onBack,
  handleSubmit,
  isSuccess,
  isLoading,
  claimErrorText,
}: ExistingWalletProps) => {
  const [walletAddress, setWalletAddress] = useState('');
  return (
    <>
      <Center
        _hover={{
          cursor: 'pointer',
        }}
        position="relative"
        w="full"
        onClick={onBack}
      >
        <ChevronLeftIcon color="gray.400" left="0" position="absolute" />
        <Text color="gray.800" fontWeight="500" size={{ base: 'md', md: 'lg' }}>
          Send to existing wallet
        </Text>
      </Center>
      <TextInput
        label="Your wallet address"
        placeholder="yourname.near"
        value={walletAddress}
        onChange={(e) => {
          setWalletAddress(e.target.value);
        }}
      />
      {isSuccess && <Text>Claim successful</Text>}
      {isLoading && (
        <Center>
          <Spinner />
        </Center>
      )}
      {!isSuccess && !isLoading && (
        <Button
          w="full"
          onClick={async () => {
            await handleSubmit(walletAddress);
          }}
        >
          Send
        </Button>
      )}
      {claimErrorText !== undefined && <Text variant="error">{claimErrorText}</Text>}
    </>
  );
};
