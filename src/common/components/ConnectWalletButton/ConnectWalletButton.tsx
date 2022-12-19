import { Button, ButtonProps } from '@chakra-ui/react';

type ConnectWalletButtonProps = ButtonProps;

export const ConnectWalletButton = ({ ...props }: ConnectWalletButtonProps) => {
  return (
    <Button
      as="a"
      fontSize={{ sm: 'sm', md: 'md' }}
      href="/sign-in"
      px={{ sm: '2', md: '6' }}
      variant="primary"
      {...props}
    >
      Connect Wallet
    </Button>
  );
};
