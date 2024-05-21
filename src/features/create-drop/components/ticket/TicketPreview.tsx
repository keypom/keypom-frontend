import { Box, VStack } from '@chakra-ui/react';

function TicketPreview() {
  return (
    <VStack
      align="stretch"
      bg="border.box"
      border="2px solid transparent"
      borderRadius="xl"
      borderWidth="1px"
      overflow="hidden"
      p={2}
      w="130px"
    >
      <Box
        alignSelf="stretch"
        bgGradient="linear(to right bottom, rgba(255, 255, 255, 0), rgba(115, 214, 243, 0.2))"
        borderRadius="xl"
        height="75px"
        left="0"
        right="0"
        top="0"
        width="100%"
      />
      <VStack align="left" spacing="3px">
        <Box bg="gray.100" borderRadius="100px" h="13px" w="70%" />
        <Box bg="gray.100" borderRadius="100px" h="5px" w="100%" />
        <Box bg="gray.100" borderRadius="3px" h="50px" w="100%" />
      </VStack>
      <Box bg="gray.800" borderRadius="3px" h="12px" w="100%" />
    </VStack>
  );
}

export default TicketPreview;
