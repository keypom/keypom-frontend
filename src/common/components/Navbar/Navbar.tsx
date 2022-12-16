import { Box, HStack, Text, Button, BoxProps } from '@chakra-ui/react';
import Link from 'next/link';

interface NavbarProps extends BoxProps {}

const MENU_ITEMS = [
  {
    name: 'Drops',
    href: '',
  },
  {
    name: 'Docs',
    href: '',
  },
  {
    name: 'Get in touch',
    href: '',
  },
];

export const Navbar = (props: NavbarProps) => {
  const menuItems = MENU_ITEMS.map((item) => (
    <Link key={item.name} href={item.href} passHref>
      {item.name}
    </Link>
  ));
  return (
    <Box position="sticky" {...props}>
      <HStack
        marginX="auto"
        maxW={{ base: '400px', md: '1000px' }}
        h="100px"
        spacing="auto"
      >
        {/* Logo */}
        <HStack spacing="2.5">
          <Box
            h="7"
            w="7"
            rounded="full"
            borderRadius="100%"
            bgColor="gray.800"
          />
          <Text as="b" fontSize="2xl">
            Keypom
          </Text>
        </HStack>

        {/* Menu Items */}
        <HStack spacing="10">
          {menuItems}

          {/* Wallet Connect */}
          <Link href="/sign-in">
            <Button variant="primary">Connect Wallet</Button>
          </Link>
        </HStack>
      </HStack>
    </Box>
  );
};
