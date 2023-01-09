import { Button, Center, Text } from '@chakra-ui/react';

import { ChevronLeftIcon } from '@/common/components/Icons';
import { TextInput } from '@/common/components/TextInput';

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
        <Text
          color="gray.800"
          fontSize={{ base: 'md', md: 'lg' }}
          fontWeight="500"
          lineHeight={{ base: '6', md: '1.625rem' }}
        >
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
