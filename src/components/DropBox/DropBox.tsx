import { Center, Flex, HStack, Image, Text } from '@chakra-ui/react';

interface DropBoxProps {
  icon: string;
  symbol: string;
  value: string;
}

export const DropBox = ({ icon, value, symbol }: DropBoxProps) => {
  return (
    <Flex
      bg="blue.50"
      border="1px solid"
      borderColor="blue.200"
      h={{ base: '12', md: '62px' }}
      p={{ base: '3', md: '4' }}
      rounded="full"
      w="full"
    >
      <HStack spacing={{ base: '2', md: '4' }}>
        <Center
          bg="white"
          borderRadius="full"
          h={{ base: '6', md: '30px' }}
          w={{ base: '6', md: '30px' }}
        >
          <Image h={{ base: '4', md: '5' }} src={icon} w={{ base: '4', md: '5' }} />
          {/* <CoinIcon h={{ base: '4', md: '5' }} symbol={coin} w={{ base: '4', md: '5' }} /> */}
        </Center>
        <Text fontWeight="500">
          {value} {symbol}
        </Text>
      </HStack>
    </Flex>
  );
};
