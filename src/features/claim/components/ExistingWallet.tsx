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
  message?: string;
  label?: string;
  buttonText?: string;
  noBackIcon?: boolean;
  inputRightAddonText?: string;
  inputPlaceholder?: string;
}

export const ExistingWallet = ({
  onBack,
  handleSubmit,
  isSuccess,
  isLoading,
  claimErrorText,
  message = 'Send to existing wallet',
  label = 'Your wallet address',
  buttonText = 'Send',
  inputPlaceholder = 'yourname.near',
  noBackIcon = false,
  inputRightAddonText,
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
        {!noBackIcon && <ChevronLeftIcon color="gray.400" left="0" position="absolute" />}
        <Text color="gray.800" fontWeight="500" size={{ base: 'md', md: 'lg' }}>
          {message}
        </Text>
      </Center>
      <TextInput
        errorMessage={claimErrorText}
        label={label}
        mb="5"
        placeholder={inputPlaceholder}
        rightAddOnText={inputRightAddonText}
        value={walletAddress}
        onChange={(e) => {
          setWalletAddress(e.target.value);
        }}
      />
      {isSuccess && <Text color="green.600">✅ Claim successful</Text>}
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
          {buttonText}
        </Button>
      )}
    </>
  );
};
