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

import { ConnectWalletButton } from '../ConnectWalletButton';
import { MenuIcon } from '../Icons';
import { KeypomLogo } from '../KeypomLogo';

import { MENU_ITEMS } from './menuItems';

export const MobileMenu = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  return (
    <Box>
      <Box ref={btnRef} aria-label="menu Button" as="button" onClick={onOpen}>
        <MenuIcon />
      </Box>
      {/* // TODO: remove when design is confirmed */}
      <Drawer finalFocusRef={btnRef} isOpen={isOpen} placement="right" onClose={onClose}>
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
                  <NextLink key={name} href={href}>
                    <Box as={Link} fontSize={{ base: 'sm', md: 'md' }} fontWeight="medium">
                      {name}
                    </Box>
                  </NextLink>
                );
              })}
            </VStack>
          </DrawerBody>
          <DrawerFooter pb="10">
            <ConnectWalletButton w="full" />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};
