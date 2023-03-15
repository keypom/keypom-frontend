import { AddIcon } from '@chakra-ui/icons';
import { Button, Heading, Image, SimpleGrid, Text, VStack } from '@chakra-ui/react';

import { TokenIcon } from '@/components/TokenIcon';
import { WalletIcon } from '@/components/WalletIcon';

export const ButtonStory = () => {
  const variants = [
    {
      component: <Button w="fit-content"> Primary Button</Button>,
      label: 'primary (default)',
    },
    {
      component: (
        <Button variant="landing" w="fit-content">
          Landing Button
        </Button>
      ),
      label: 'landing',
    },
    {
      component: (
        <Button variant="secondary" w="fit-content">
          Secondary Button
        </Button>
      ),
      label: 'secondary',
    },
    {
      component: (
        <Button variant="secondary-content-box" w="fit-content">
          Secondary Content Button
        </Button>
      ),
      label: 'secondary-content-box',
    },
    {
      component: (
        <Button variant="icon" w="fit-content">
          <AddIcon />
        </Button>
      ),
      label: 'icon',
    },
    {
      component: (
        <Button variant="pill" w="fit-content">
          Pill Button
        </Button>
      ),
      label: 'pill',
    },
  ];

  const sizes = [
    {
      component: (
        <Button size="sm" w="fit-content">
          Small Button
        </Button>
      ),
      label: 'sm',
    },
    {
      component: <Button w="fit-content"> Medium Button</Button>,
      label: 'md (default)',
    },
  ];

  const withIcons = [
    {
      component: (
        <Button leftIcon={<AddIcon />} w="fit-content">
          Left icon
        </Button>
      ),
      label: 'With left icon',
    },
    {
      component: (
        <Button rightIcon={<AddIcon />} w="fit-content">
          Right icon
        </Button>
      ),
      label: 'With right icon',
    },
    {
      component: (
        <Button leftIcon={<TokenIcon symbol="eth" />} variant="secondary" w="fit-content">
          Token icon
        </Button>
      ),
      label: 'With ETH token icon',
    },
    {
      component: (
        <Button rightIcon={<TokenIcon symbol="near" />} w="fit-content">
          Token icon
        </Button>
      ),
      label: 'With near icon',
    },
    {
      component: (
        <Button
          leftIcon={<WalletIcon height="4" name="near" width="4" />}
          variant="secondary"
          w="fit-content"
        >
          Near wallet
        </Button>
      ),
      label: 'With Near Wallet',
    },
    {
      component: (
        <Button rightIcon={<WalletIcon name="here" />} w="fit-content">
          Here wallet
        </Button>
      ),
      label: 'With HERE Wallet',
    },
    {
      component: (
        <Button leftIcon={<WalletIcon name="mynearwallet" />} variant="secondary" w="fit-content">
          MyNearWallet
        </Button>
      ),
      label: 'With MyNearWallet',
    },
    {
      component: (
        <Button variant="icon" w="fit-content">
          <TokenIcon height="4" symbol="eth" width="4" />
        </Button>
      ),
      label: 'ETH',
    },
    {
      component: (
        <Button variant="icon" w="fit-content">
          <TokenIcon symbol="near" />
        </Button>
      ),
      label: 'NEAR',
    },
  ];

  const withImages = [
    {
      component: (
        <Button
          rightIcon={
            <Image alt="keypom-logo" h="6" src={'https://docs.keypom.xyz/img/moon.png'} w="6" />
          }
          w="fit-content"
        >
          Moon
        </Button>
      ),
      label: 'With Moon image on the left',
    },
    {
      component: (
        <Button
          leftIcon={
            <Image alt="keypom-logo" h="6" src={'https://docs.keypom.xyz/img/moon.png'} w="6" />
          }
          w="fit-content"
        >
          Moon
        </Button>
      ),
      label: 'With Moon image on the right',
    },
    {
      component: (
        <Button variant="icon" w="fit-content">
          <Image alt="keypom-logo" h="6" src={'https://docs.keypom.xyz/img/moon.png'} w="6" />
        </Button>
      ),
      label: 'Moon',
    },
  ];
  return (
    <VStack spacing="40px" w="full">
      <VStack spacing="20px" w="full">
        <Heading>Button Variants</Heading>
        <SimpleGrid columns={4} spacingX="10px" spacingY="20px" w="full">
          {variants.map(({ component, label }) => (
            <VStack key={label} spacing="4px">
              {component}
              <Text>{label}</Text>
            </VStack>
          ))}
        </SimpleGrid>
      </VStack>

      <VStack spacing="20px" w="full">
        <Heading>Button Sizes</Heading>
        <SimpleGrid columns={4} spacingX="10px" spacingY="20px" w="full">
          {sizes.map(({ component, label }) => (
            <VStack key={label} spacing="4px">
              {component}
              <Text>{label}</Text>
            </VStack>
          ))}
        </SimpleGrid>
      </VStack>

      <VStack spacing="20px" w="full">
        <Heading>Button with Icons</Heading>
        <SimpleGrid columns={4} spacingX="10px" spacingY="20px" w="full">
          {withIcons.map(({ component, label }) => (
            <VStack key={label} spacing="4px">
              {component}
              <Text>{label}</Text>
            </VStack>
          ))}
        </SimpleGrid>
      </VStack>

      <VStack spacing="20px" w="full">
        <Heading>Button with Images</Heading>
        <SimpleGrid columns={4} spacingX="10px" spacingY="20px" w="full">
          {withImages.map(({ component, label }) => (
            <VStack key={label} spacing="4px">
              {component}
              <Text>{label}</Text>
            </VStack>
          ))}
        </SimpleGrid>
      </VStack>
    </VStack>
  );
};
