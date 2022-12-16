import { Box, BoxProps, Flex, HStack } from '@chakra-ui/react';
import Link from 'next/link';

import { KeypomLogo } from '@/common/components/KeypomLogo';

import { ConnectWalletButton } from '../ConnectWalletButton';

import { MobileMenu, MENU_ITEMS } from '.';

type NavbarProps = BoxProps;

export const Navbar = (props: NavbarProps) => {
  const menuItems = MENU_ITEMS.map((item) => (
    <Link key={item.name} passHref href={item.href}>
      <Box as="a" fontSize={{ base: 'sm', md: 'md' }}>
        {item.name}
      </Box>
    </Link>
  ));

  return (
    <Box position="sticky" {...props}>
      <Flex
        alignItems="center"
        h="4rem"
        justifyContent="space-between"
        marginX="auto"
        maxW="75rem"
        mt={{ mt: 2, md: '4' }}
        px={5}
      >
        {/* Logo */}
        <KeypomLogo />
        {/* Menu Items */}
        <HStack display={{ base: 'none', sm: 'flex' }} spacing={{ sm: '4', md: '10' }}>
          {menuItems}
          <ConnectWalletButton />
        </HStack>
        <Box display={{ base: 'block', sm: 'none' }}>
          <MobileMenu />
        </Box>
      </Flex>
    </Box>
  );
};
