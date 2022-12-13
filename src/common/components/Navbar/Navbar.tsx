import { Box, HStack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { Button } from '@/common/components/Button/Button';

interface INavbar {}

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

export const Navbar: React.FC<INavbar> = () => {
  const menuItems = MENU_ITEMS.map((item) => (
    <Link href={item.href} passHref>
      {item.name}
    </Link>
  ));
  return (
    <Box position="sticky">
      <HStack marginX="auto" maxW={[400, 1000]} h="100px" spacing="auto">
        {/* Logo */}
        <HStack spacing="10px">
          <Box h="28px" w="28px" borderRadius="100%" bgColor="gray.800" />
          <Text as="b" fontSize="2xl">
            Keypom
          </Text>
        </HStack>

        {/* Menu Items */}
        <HStack spacing="40px">
          {menuItems}

          {/* Wallet Connect */}
          <Button type="secondary" dark>
            Connect Wallet
          </Button>
        </HStack>
      </HStack>
    </Box>
  );
};
