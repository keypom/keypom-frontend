import { Button, ButtonProps } from '@chakra-ui/react';
import NextLink from 'next/link';

type ConnectWalletButtonProps = ButtonProps;

export const ConnectWalletButton = ({ ...props }: ConnectWalletButtonProps) => {
  return (
    <NextLink href="/sign-in">
      <Button
        fontSize={{ sm: 'sm', md: 'md' }}
        px={{ sm: '2', md: '6' }}
        variant="primary"
        {...props}
      >
        Connect Wallet
      </Button>
    </NextLink>
  );
};
