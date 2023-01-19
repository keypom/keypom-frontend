import { Box, BoxProps, Flex, HStack, Link } from '@chakra-ui/react';
import NextLink from 'next/link';

import { KeypomLogo } from '@/common/components/KeypomLogo';
import { useAuthWalletContext } from '@/common/contexts/AuthWalletContext';

import { ConnectWalletButton } from '../ConnectWalletButton';
import { SignedInButton } from '../SignedInButton';

import { MobileMenu, MENU_ITEMS } from '.';

type NavbarProps = BoxProps;

export const Navbar = (props: NavbarProps) => {
  const { isLoggedIn } = useAuthWalletContext();
  const menuItems = MENU_ITEMS.map((item) => (
    <Link key={item.name} as={NextLink} href={item.href}>
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
