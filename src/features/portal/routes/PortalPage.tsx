import {
  Box,
  Center,
  Divider,
  Flex,
  HStack,
  Heading,
  SimpleGrid,
  Spinner,
  Text,
  useBoolean,
} from '@chakra-ui/react';
import { useEffect } from 'react';

import { IconBox } from '@/components/IconBox';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import { GradientSpan } from '@/components/GradientSpan';

const portalAppName = [
  {
    label: 'My App 1',
  },
  {
    label: 'My App 2',
  },
  {
    label: 'My Bridge',
  },
  {
    label: 'Event Live Stream',
  },
];

const PortalPage = () => {
  const [loading, setLoading] = useBoolean(true);
  const { account } = useAuthWalletContext();

  useEffect(() => {
    if (account !== null) setLoading.off();
  }, [account]);

  return (
    <Box mb={{ base: '5', md: '14' }} minH="100%" minW="100%" mt={{ base: '52px', md: '100px' }}>
      {loading ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <>
          <Heading marginBottom="8">Choose apps</Heading>
          <IconBox p="8" pb="8">
            <Flex align="flex-start" flexDir="column" gap="2">
              <Text color="gray.900" fontWeight="500" size="3xl">
                Wallet balance
              </Text>
              <HStack mb="4" spacing="2">
                <Text fontWeight="500" size="3xl">
                  <GradientSpan>$50 USD</GradientSpan>
                </Text>
                <Text color="blue.500" fontWeight="400" size="base">
                  (123.45 NEAR)
                </Text>
              </HStack>
              <Text>Explore apps and spend NEAR as you would in the real world.</Text>
            </Flex>
            <Divider bgColor="gray.100" marginBlock="6" orientation="horizontal" w="full" />
            <SimpleGrid columns={2} spacing="6" w="full">
              {portalAppName.map(({ label }, index) => (
                <Flex
                  key={index}
                  align="flex-start"
                  background="linear-gradient(129.59deg, #ededed4e 30.89%, rgba(115, 214, 243, 0.2) 98.74%), #FFFFFF"
                  borderRadius="8xl"
                  flexDir="column"
                  h="280px"
                  justify="flex-end"
                  p="4"
                  pb="4"
                >
                  <Text fontWeight="500" size="lg">
                    {label}
                  </Text>
                  <Text>Contra legem facit qui id facit quod lex prohibet.</Text>
                </Flex>
              ))}
            </SimpleGrid>
          </IconBox>
        </>
      )}
    </Box>
  );
};

export default PortalPage;
