import { Box, Flex, HStack, Link, type BoxProps } from '@chakra-ui/react';

import { KeypomLogo } from '@/components/KeypomLogo';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';

import { SignedInButton } from '../SignedInButton';
import { ConnectWalletButton } from '../ConnectWalletButton';

import { MobileMenu } from './MobileMenu';

type NavbarProps = BoxProps;

export const MENU_ITEMS = [
  {
    name: 'Docs',
    href: 'https://docs.keypom.xyz',
  },
  {
    name: 'Get in touch',
    href: 'https://twitter.com/keypomxyz',
  },
];

export const Navbar = (props: NavbarProps) => {
  const { isLoggedIn } = useAuthWalletContext();
  const menuItems = MENU_ITEMS.map((item) => (
    <Link key={item.name} isExternal href={item.href}>
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
