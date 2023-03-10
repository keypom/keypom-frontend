import { Center, type CenterProps, Text } from '@chakra-ui/react';

import { TrialAppButtonIcon } from '@/components/Icons/TrialAppButtonIcon';

export interface TrialAppButtonProps extends CenterProps {
  title: string;
  media?: string;
  handleAppClick: () => void;
}

export const TrialAppButton = ({ title, media, handleAppClick, ...props }: TrialAppButtonProps) => {
  return (
    <Center
      _hover={{
        cursor: 'pointer',
        bg: 'gray.100',
      }}
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius={{ base: '5xl', md: '6xl' }}
      h={{ base: '39px', md: '12' }}
      position="relative"
      px="4"
      py="2"
      w="full"
      onClick={handleAppClick}
      {...props}
    >
      {/** wallet logo */}
      {media && <TrialAppButtonIcon h="6" left="4" media={media} position="absolute" w="6" />}
      <Text size={{ base: 'sm', md: 'md' }}>{title}</Text>
    </Center>
  );
};
