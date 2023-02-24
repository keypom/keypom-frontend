import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
  VStack,
  Link,
} from '@chakra-ui/react';
import { useRef } from 'react';

import { MenuIcon } from '@/components/Icons';
import { KeypomLogo } from '@/components/KeypomLogo';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';

import { SignedInButton } from '../SignedInButton';
import { ConnectWalletButton } from '../ConnectWalletButton';

import { MENU_ITEMS } from './Navbar';

export const MobileMenu = () => {
  const { isLoggedIn } = useAuthWalletContext();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const btnRef = useRef(null);
  return (
    <Box>
      <Box ref={btnRef} aria-label="menu-button" as="button" onClick={onOpen}>
        <MenuIcon />
      </Box>
      {/* // TODO: remove when design is confirmed */}
      <Drawer finalFocusRef={btnRef} isOpen={isOpen} placement="top" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton mt="2" />
          <DrawerHeader>
            <KeypomLogo />
          </DrawerHeader>
          <DrawerBody>
            <VStack mt="10" spacing="4">
              {MENU_ITEMS.map(({ name, href }) => {
                return (
                  <Link key={name} href={href}>
                    <Box fontSize={{ base: 'sm', md: 'md' }} fontWeight="medium">
                      {name}
                    </Box>
                  </Link>
                );
              })}
            </VStack>
          </DrawerBody>
          <DrawerFooter flexDirection="row" justifyContent="center" pb="10">
            {isLoggedIn ? <SignedInButton /> : <ConnectWalletButton w="50%" />}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};
