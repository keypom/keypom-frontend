import { AddIcon } from '@chakra-ui/icons';
import { Button, Heading, Image, SimpleGrid, Text, VStack } from '@chakra-ui/react';

import { TokenIcon } from '@/components/TokenIcon';
import { WalletIcon } from '@/components/WalletIcon';

export const ButtonStory = () => {
  const variants = [
    {
      component: <Button w="fit-content"> Primary Button</Button>,
      label: 'primary (default) variant',
    },
    {
      component: (
        <Button variant="landing" w="fit-content">
          Landing Button
        </Button>
      ),
      label: 'landing variant',
    },
    {
      component: (
        <Button variant="secondary" w="fit-content">
          Secondary Button
        </Button>
      ),
      label: 'secondary variant',
    },
    {
      component: (
        <Button variant="secondary-content-box" w="fit-content">
          Secondary Content Button
        </Button>
      ),
      label: 'secondary-content-box variant',
    },
    {
      component: (
        <Button variant="icon" w="fit-content">
          <AddIcon />
        </Button>
      ),
      label: 'icon variant',
    },
    {
      component: (
        <Button variant="pill" w="fit-content">
          Pill Button
        </Button>
      ),
      label: 'pill variant',
    },
  ];

  const sizes = [
    {
      component: (
        <Button size="sm" w="fit-content">
          Small Button
        </Button>
      ),
      label: 'sm size',
    },
    {
      component: <Button w="fit-content"> Medium Button</Button>,
      label: 'md (default) size',
    },
  ];

  const withIcons = [
    {
      component: (
        <Button leftIcon={<AddIcon />} w="fit-content">
          Left icon
        </Button>
      ),
      label: 'leftIcon props',
    },
    {
      component: (
        <Button rightIcon={<AddIcon />} w="fit-content">
          Right icon
        </Button>
      ),
      label: 'rightIcon props',
    },
    {
      component: (
        <Button leftIcon={<TokenIcon symbol="eth" />} variant="secondary" w="fit-content">
          Token icon
        </Button>
      ),
      label: 'leftIcon props with TokenIcon',
    },
    {
      component: (
        <Button rightIcon={<TokenIcon symbol="near" />} w="fit-content">
          Token icon
        </Button>
      ),
      label: 'rightIcon props with TokenIcon',
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
      label: 'leftIcon props with WalletIcon',
    },
    {
      component: (
        <Button rightIcon={<WalletIcon name="here" />} w="fit-content">
          Here wallet
        </Button>
      ),
      label: 'rightIcon props with WalletIcon',
    },
    {
      component: (
        <Button leftIcon={<WalletIcon name="mynearwallet" />} variant="secondary" w="fit-content">
          MyNearWallet
        </Button>
      ),
      label: 'leftIcon props with WalletIcon',
    },
    {
      component: (
        <Button variant="icon" w="fit-content">
          <TokenIcon height="4" symbol="eth" width="4" />
        </Button>
      ),
      label: 'icon variant with ETH symbol',
    },
    {
      component: (
        <Button variant="icon" w="fit-content">
          <TokenIcon symbol="near" />
        </Button>
      ),
      label: 'icon variant with NEAR symbol',
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
      label: 'leftIcon props with Moon Image',
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
      label: 'rightIcon props with Moon Image',
    },
    {
      component: (
        <Button variant="icon" w="fit-content">
          <Image alt="keypom-logo" h="6" src={'https://docs.keypom.xyz/img/moon.png'} w="6" />
        </Button>
      ),
      label: 'icon variant with Moon image',
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
