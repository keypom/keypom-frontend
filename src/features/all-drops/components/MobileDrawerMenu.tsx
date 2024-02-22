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

interface MobileDrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  searchTerm: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: () => void; // This might be triggered by a specific button if not using the Enter key
  selectedFilters: {
    type: string;
    search: string;
    status: string;
  };
  handleDropTypeSelect: (type: string) => void;
  handleDropStatusSelect: (status: string) => void;
  filterDropMenuItems: JSX.Element[]; // Assuming these are pre-constructed elements passed in
  dropStatusMenuItems: JSX.Element[];
}

export const MobileDrawerMenu = ({
  isOpen,
  onClose,
  searchTerm,
  handleSearchChange,
  handleKeyDown, // Assuming you pass a handler for search submission (e.g., when Enter is pressed in the search input)
  selectedFilters,
  handleDropTypeSelect,
  handleDropStatusSelect,
  filterDropMenuItems,
  dropStatusMenuItems,
}: MobileDrawerMenuProps) => {
  const handleClose = () => {
    handleKeyDown({ key: 'Enter' }); // This is just an example, you can call the handler directly if needed
    onClose();
  };
  return (
    <Drawer isOpen={isOpen} placement="bottom" onClose={handleClose}>
      <DrawerOverlay />
      <DrawerContent
        bg="border.box"
        borderRadius="1rem"
        marginX="auto"
        position="absolute"
        w="99%" // to add a gap on the side
      >
        <DrawerHeader fontSize="md" fontWeight="medium" pb="0" pt="6">
          Filter Options
        </DrawerHeader>
        <DrawerCloseButton color="gray.400" fontSize="sm" right="5" top="6" />
        <DrawerBody p="6" pt="4">
          <VStack spacing={4}>
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
            {/* Dynamically generated menu for type selection */}
            <Menu>
              <MenuButton as={Button} w="full">
                Type: {selectedFilters.type}
              </MenuButton>
              <MenuList>{filterDropMenuItems}</MenuList>
            </Menu>
            {/* Dynamically generated menu for status selection */}
            <Menu>
              <MenuButton as={Button} w="full">
                Claimed: {selectedFilters.status}
              </MenuButton>
              <MenuList>{dropStatusMenuItems}</MenuList>
            </Menu>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
