import { Center, Heading, SimpleGrid } from '@chakra-ui/react';

import { GradientSpan } from '@/components/GradientSpan';

import { LandingCard } from './LandingCard';

export const PossibilitiesSection = () => {
  return (
    <Center flexDir="column" maxW="995px" mx="auto">
      <Heading
        fontSize={{ base: '24px', md: '36px' }}
        fontWeight="600"
        lineHeight={{ base: '32px', md: '43px' }}
        maxW="600px"
        mb={{ base: '4', md: '10' }}
        textAlign="center"
      >
        The possibilities
        <br /> are <GradientSpan>Endless</GradientSpan>
      </Heading>
      <SimpleGrid
        columns={{ base: 1, md: 2 }}
        mb={{ base: '14', md: '120px' }}
        spacing={{ base: '4', md: '6' }}
      >
        <LandingCard
          buttonText="See the docs"
          description="Our SDK lets you build custom solutions around link-based wallets."
          header="Craft your own"
          onClick={() => {
            window.location.href = 'https://docs.keypom.xyz';
          }}
        />
        <LandingCard
          buttonText="Contact us"
          description="Dont see the drop you need? Talk to us about custom built drops."
          header="Custom drops"
          onClick={() => {
            window.location.href = 'https://twitter.com/keypomxyz';
          }}
        />
      </SimpleGrid>
    </Center>
  );
};
