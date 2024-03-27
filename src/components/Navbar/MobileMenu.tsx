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

interface MobileMenuProps {
  menuItems: Array<{
    name: string;
    href: string;
    isExternal?: boolean;
    isProtected?: boolean;
  }>;
}
export const MobileMenu = ({ menuItems }: MobileMenuProps) => {
  const { isLoggedIn } = useAuthWalletContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isTicketSubdirectory =
    location.pathname.startsWith('/tickets/') || location.pathname.startsWith('/claim/');

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
              {menuItems.map(({ name, href, isProtected }) => {
                return (
                  <Link key={name} hidden={isProtected} href={href}>
                    <Box fontSize={{ base: 'sm', md: 'md' }} fontWeight="medium">
                      {name}
                    </Box>
                  </Link>
                );
              })}
            </VStack>
          </DrawerBody>
          {!isTicketSubdirectory && (
            <DrawerFooter flexDirection="row" justifyContent="center" pb="10">
              {isLoggedIn ? <SignedInButton /> : <ConnectWalletButton w="50%" />}
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
    </Box>
  );
};
