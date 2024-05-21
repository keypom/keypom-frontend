import type React from 'react';
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  VStack,
  Menu,
  MenuButton,
  MenuList,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

interface FilterConfig {
  label: string;
  value: string;
  menuItems: JSX.Element[];
}

interface MobileDrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  searchTerm?: string;
  handleSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  filters: FilterConfig[];
  title: string;
  customButton?: React.ReactNode; // Optional custom button
}

export const MobileDrawerMenu = ({
  isOpen,
  onClose,
  searchTerm,
  handleSearchChange,
  handleKeyDown,
  filters,
  title,
  customButton, // Destructure the customButton prop
}: MobileDrawerMenuProps) => {
  return (
    <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent
        bg="border.box"
        borderRadius="1rem"
        marginX="auto"
        position="absolute"
        w="99%" // to add a gap on the side
      >
        <DrawerHeader fontSize="md" fontWeight="medium" pb="0" pt="6">
          {title}
        </DrawerHeader>
        <DrawerCloseButton color="gray.400" fontSize="sm" right="5" top="6" />
        <DrawerBody p="6" pt="4">
          <VStack spacing={4}>
            {searchTerm !== undefined && handleSearchChange && (
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={SearchIcon} color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                />
              </InputGroup>
            )}
            {filters.map((filter) => (
              <Menu key={filter.label}>
                <MenuButton as={Button} w="full">
                  {filter.label}: {filter.value}
                </MenuButton>
                <MenuList>{filter.menuItems}</MenuList>
              </Menu>
            ))}
            {/* Optionally render the custom button if provided */}
            {customButton}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
