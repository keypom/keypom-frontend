import { Button, ButtonProps, useDisclosure } from '@chakra-ui/react';

import { ConnectWalletModal } from '@/common/components/CoreLayout/ConnectWalletModal';

type ConnectWalletButtonProps = ButtonProps;

export const ConnectWalletButton = ({ ...props }: ConnectWalletButtonProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button
        fontSize={{ sm: 'sm', md: 'md' }}
        px={{ sm: '2', md: '6' }}
        variant="primary"
        onClick={onOpen}
        {...props}
      >
        Connect Wallet
      </Button>
      <ConnectWalletModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};
