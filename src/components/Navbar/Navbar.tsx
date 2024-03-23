import { Box, Flex, HStack, Link, type BoxProps } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import React from 'react';

import { KeypomLogo } from '@/components/KeypomLogo';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';

import '@near-wallet-selector/modal-ui/styles.css';
import '@/components/WalletSelectorModal/WalletSelectorModal.css';

const MobileMenu = React.lazy(
  async () => await import('./MobileMenu').then((mod) => ({ default: mod.MobileMenu })),
);

const SignedInButton = React.lazy(
  async () => await import('../SignedInButton').then((mod) => ({ default: mod.SignedInButton })),
);

const ConnectWalletButton = React.lazy(
  async () =>
    await import('../ConnectWalletButton').then((mod) => ({ default: mod.ConnectWalletButton })),
);

type NavbarProps = BoxProps;

export const Navbar = (props: NavbarProps) => {
  const { isLoggedIn } = useAuthWalletContext();
  const isTicketSubdirectory =
    location.pathname.startsWith('/tickets/') || location.pathname.startsWith('/claim/');

  const MENU_ITEMS = [
    {
      name: 'Gallery',
      href: '/gallery',
    },
    {
      name: 'Docs',
      href: 'https://docs.keypom.xyz',
      isExternal: true,
    },
    {
      name: 'My Drops',
      href: '/drops',
      isProtected: !isLoggedIn,
    },
    {
      name: 'My Events',
      href: '/events',
      isProtected: !isLoggedIn,
    },
  ];

  const menuItems = MENU_ITEMS.map((item) => (
    <Link
      key={item.name}
      as={RouterLink}
      hidden={item.isProtected}
      isExternal={item.isExternal}
      to={item.href}
    >
      <Box fontSize={{ base: 'sm', md: 'md' }}>{item.name}</Box>
    </Link>
  ));

  return (
    <Box position="sticky" zIndex={100} {...props}>
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
        <HStack display={{ base: 'none', md: 'flex' }} spacing={{ sm: '4', md: '10' }}>
          {menuItems}
          {!isTicketSubdirectory && (isLoggedIn ? <SignedInButton /> : <ConnectWalletButton />)}
        </HStack>
        <Box display={{ base: 'block', md: 'none' }}>
          <MobileMenu menuItems={MENU_ITEMS} />
        </Box>
      </Flex>
    </Box>
  );
};
