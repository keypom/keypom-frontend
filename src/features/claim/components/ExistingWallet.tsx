import { Button, Center, Text } from '@chakra-ui/react';

import { ChevronLeftIcon } from '@/components/Icons';
import { TextInput } from '@/components/TextInput';

interface ExistingWalletProps {
  onBack: () => void;
  handleSubmit?: () => void;
}

export const ExistingWallet = ({ onBack, handleSubmit }: ExistingWalletProps) => {
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
      {/** TODO: integrate with react-hook-form */}
      {/** TODO: add design from input theme */}
      <TextInput label="Your wallet address" placeholder="yourname.near" />
      <Button w="full" onClick={handleSubmit}>
        Send
      </Button>
    </>
  );
};
