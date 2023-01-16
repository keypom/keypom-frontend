import { Button, ButtonProps, useDisclosure } from '@chakra-ui/react';

import { ConnectWalletModal } from './ConnectWalletModal';

import { useWalletSelector } from "@/modules/WalletSelector";

type ConnectWalletButtonProps = ButtonProps;

export const ConnectWalletButton = ({ ...props }: ConnectWalletButtonProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { selector, modal } = useWalletSelector();

  return (
    <>
      <Button
        fontSize={{ sm: 'sm', md: 'md' }}
        px={{ sm: '2', md: '6' }}
        variant="primary"
        onClick={() => {
          console.log('test')
          modal.show()
        }}
        {...props}
      >
        Connect Wallet
      </Button>
      <ConnectWalletModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};
