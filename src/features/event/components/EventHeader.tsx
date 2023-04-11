import { Heading } from '@chakra-ui/react';

interface EventHeaderProps {
  headerText: string;
}

export const EventHeader = ({ headerText }: EventHeaderProps) => {
  return (
    <Heading
      fontSize={{ base: '32px', md: '60px' }}
      fontWeight="600"
      lineHeight={{ base: '43px', md: '72px' }}
      mb={{ base: '4', md: '6' }}
      textAlign="center"
    >
      {headerText}
    </Heading>
  );
};
