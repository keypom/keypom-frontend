import { Box, Flex, HStack, Text } from '@chakra-ui/react';

interface DropBoxProps {
  coin: string;
  value: number;
}

export const DropBox = ({ coin, value }: DropBoxProps) => {
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
        {/** TODO: implement common coinSymbol component that takes coin and return coin logo */}
        <Box
          bg="white"
          borderRadius="full"
          h={{ base: '6', md: '30px' }}
          w={{ base: '6', md: '30px' }}
        />
        <Text fontWeight="500">
          {value} {coin}
        </Text>
      </HStack>
    </Flex>
  );
};
