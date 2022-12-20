import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  VStack,
} from '@chakra-ui/react';

import { MENU_ITEMS } from './menuItems';

export const MobileDrawerMenu = ({ isOpen, onClose }) => {
  const getMobileDrawerMenuItems = () =>
    MENU_ITEMS.map((item) => (
      <Button
        key={item.label}
        as="a"
        borderRadius="lg"
        cursor="pointer"
        fontSize="sm"
        justifyContent="left"
        leftIcon={item.icon}
        variant="secondary"
        w="full"
      >
        {item.label}
      </Button>
    ));
  return (
    <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent
        bg="border.box"
        border="2px solid transparent"
        borderRadius="2xl"
        bottom="0"
        marginX="auto"
        position="absolute"
        transform="translateX(0) translateY(0); !important"
        w="99%"
      >
        <DrawerHeader fontSize="md" fontWeight="medium" pb="0" pt="6">
          Create a drop
        </DrawerHeader>
        <DrawerCloseButton color="gray.400" fontSize="sm" right="5" top="6" />
        <DrawerBody p="6" pt="4">
          <VStack>{getMobileDrawerMenuItems()}</VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
