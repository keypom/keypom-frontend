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
import NextLink from 'next/link';
import { useRef } from 'react';

import { useAuthWalletContext } from '@/common/contexts/AuthWalletContext';

import { ConnectWalletButton } from '../ConnectWalletButton';
import { MenuIcon } from '../Icons';
import { KeypomLogo } from '../KeypomLogo';
import { SignedInButton } from '../SignedInButton';

import { MENU_ITEMS } from './menuItems';

export const MobileMenu = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isLoggedIn } = useAuthWalletContext();
  const btnRef = useRef();
  return (
    <Box>
      <Box ref={btnRef} aria-label="menu Button" as="button" onClick={onOpen}>
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
                  <Link key={name} as={NextLink} href={href}>
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
