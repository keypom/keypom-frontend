import { Box, Text, VStack } from '@chakra-ui/react';

interface CreateWalletProps {
  onClick: () => void;
}

export const CreateWallet = ({ onClick }: CreateWalletProps) => {
  return (
    <>
      <Text color="gray.800" fontWeight="500">
        Create a wallet to store your assets
      </Text>
      <VStack spacing="1" w="full">
        {/** div placeholder */}
        <Box
          _hover={{
            cursor: 'pointer',
            bg: 'gray.100',
          }}
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="xl"
          h={{ base: '39px', md: '12' }}
          w="full"
        />
        <Box
          _hover={{
            cursor: 'pointer',
            bg: 'gray.100',
          }}
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="xl"
          h={{ base: '39px', md: '12' }}
          w="full"
        />
        <Box
          _hover={{
            cursor: 'pointer',
            bg: 'gray.100',
          }}
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="xl"
          h={{ base: '39px', md: '12' }}
          w="full"
        />
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
