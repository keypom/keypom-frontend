import { Box, Button } from '@chakra-ui/react';

import { Heading, Text } from '@/common/components/Typography';
import { IconBox } from '@/common/components/IconBox';
import { LinkIcon } from '@/common/components/Icons';
import { PageHead } from '@/common/components/PageHead';

export default function SignIn() {
  return (
    <Box minH="100%" minW="100%" mt="20">
      <PageHead
        removeTitleAppend
        description="Keypom wallet connect page"
        name="Wallet Connect"
      />
      <IconBox
        icon={
          <LinkIcon h={{ base: '8', md: '10' }} w={{ base: '8', md: '10' }} />
        }
        mx="auto"
        textAlign="center"
        w={{ base: '345px', md: '480px' }}
      >
        <Heading>Sign In</Heading>
        <Text mt="4">
          Sign in with a NEAR Wallet to create and manage drops.
        </Text>
        <Button mt="6" size={{ base: 'sm', md: 'md' }} variant="primary">
          Connect Wallet
        </Button>
      </IconBox>
    </Box>
  );
}
