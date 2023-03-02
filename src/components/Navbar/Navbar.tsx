import { Box, Flex, HStack, Link, type BoxProps } from '@chakra-ui/react';

import { KeypomLogo } from '@/components/KeypomLogo';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';

import { SignedInButton } from '../SignedInButton';
import { ConnectWalletButton } from '../ConnectWalletButton';

import { MobileMenu } from './MobileMenu';

type NavbarProps = BoxProps;

export const Navbar = (props: NavbarProps) => {
  const { isLoggedIn } = useAuthWalletContext();

  const MENU_ITEMS = [
    {
      name: 'Docs',
      href: 'https://docs.keypom.xyz',
      isExternal: true,
    },
    {
      name: 'Get in touch',
      href: 'https://twitter.com/keypomxyz',
      isExternal: true,
    },
    {
      name: 'My Drops',
      href: '/drops',
      isProtected: !isLoggedIn,
    },
  ];

  const menuItems = MENU_ITEMS.map((item) => (
    <Link key={item.name} hidden={item.isProtected} href={item.href} isExternal={item.isExternal}>
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
          {isLoggedIn ? <SignedInButton /> : <ConnectWalletButton />}
        </HStack>
        <Box display={{ base: 'block', md: 'none' }}>
          <MobileMenu menuItems={MENU_ITEMS} />
        </Box>
      </Flex>
    </Box>
  );
};
