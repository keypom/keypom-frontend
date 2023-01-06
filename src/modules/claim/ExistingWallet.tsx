import { Box, Button, Center, Text, VStack } from '@chakra-ui/react';

import { ChevronLeftIcon } from '@/common/components/Icons';

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
        <Text color="gray.800" fontWeight="500">
          Send to existing wallet
        </Text>
      </Center>
      {/** simulate input with label */}
      <VStack gap="0" w="full">
        <Text textAlign="left" w="full">
          Your wallet address
        </Text>
        <Box
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius={{ base: '5xl', md: '6xl' }}
          h={{ base: '39px', md: '12' }}
          w="full"
        />
      </VStack>
      <Button w="full" onClick={handleSubmit}>
        Submit
      </Button>
    </>
  );
};
