import { Box, Button, Flex, HStack } from "@chakra-ui/react";
import Link from "next/link";

import { Logo } from "@/common/components/Logo";

interface NavbarProps {}

const MENU_ITEMS = [
  {
    name: "Drops",
    href: "",
  },
  {
    name: "Docs",
    href: "",
  },
  {
    name: "Get in touch",
    href: "",
  },
];

export const Navbar = ({}: NavbarProps) => {
  const menuItems = MENU_ITEMS.map((item) => (
    <Link key={item.name} href={item.href} passHref>
      <Box as="a" fontSize={{ base: "sm", md: "md" }}>
        {item.name}
      </Box>
    </Link>
  ));

  return (
    <Box position="sticky">
      <Flex
        marginX="auto"
        maxW="75rem"
        h="4rem"
        mt={{ mt: 2, md: "4" }}
        justifyContent="space-between"
        px={5}
      >
        {/* Logo */}
        <Logo />
        {/* Menu Items */}
        <HStack
          display={{ base: "none", sm: "flex" }}
          spacing={{ sm: "4", md: "10" }}
        >
          {menuItems}
          {/* Wallet Connect */}
          <Button
            fontSize={{ sm: "sm", md: "md" }}
            px={{ sm: "2", md: "6" }}
            variant="primary"
          >
            Connect Wallet
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};
