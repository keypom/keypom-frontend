import { Button, type ButtonProps } from '@chakra-ui/react';

import { useAuthWalletContext } from '@/contexts/AuthWalletContext';

type ConnectWalletButtonProps = ButtonProps;

export const ConnectWalletButton = ({ ...props }: ConnectWalletButtonProps) => {
  const { modal } = useAuthWalletContext();
  return (
    <Button
      fontSize={{ sm: 'sm', md: 'md' }}
      px={{ sm: '2', md: '6' }}
      variant="primary"
      onClick={() => {
        modal.show();
      }}
      {...props}
    >
      Connect Wallet
    </Button>
  );
};
