import React from 'react';
import { Box, Flex, HStack, Link, type BoxProps } from '@chakra-ui/react';

import { MobileMenu } from './MobileMenu';

import { SignedInButton } from '@/components/SignedInButton';
import { ConnectWalletButton } from '@/components/ConnectWalletButton';
import { KeypomLogo } from '@/components/KeypomLogo';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';

type NavbarProps = BoxProps;

export const MENU_ITEMS = [
  {
    name: 'Docs',
    href: '#',
  },
  {
    name: 'Get in touch',
    href: '#',
  },
];

export const Navbar = (props: NavbarProps) => {
  const { isLoggedIn } = useAuthWalletContext();
  const menuItems = MENU_ITEMS.map((item) => (
    <Link key={item.name} href={item.href}>
      <Box fontSize={{ base: 'sm', md: 'md' }}>{item.name}</Box>
    </Link>
  ));

  return (
    <Box position="sticky" zIndex="dropdown" {...props}>
      <Flex
        alignItems="center"
        h="4rem"
        justifyContent="space-between"
        marginX="auto"
        maxW="75rem"
        mt={{ md: '4' }}
        px={5}
      >
        {/* Logo */}
        <KeypomLogo />
        {/* Menu Items */}
        <HStack display={{ base: 'none', sm: 'flex' }} spacing={{ sm: '4', md: '10' }}>
          {menuItems}
          {isLoggedIn ? <SignedInButton /> : <ConnectWalletButton />}
        </HStack>
        <Box display={{ base: 'block', sm: 'none' }}>
          <MobileMenu />
        </Box>
      </Flex>
    </Box>
  );
};