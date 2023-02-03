import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Menu as CMenu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  type MenuItemProps as _MenuItemProps,
  Box,
} from '@chakra-ui/react';
import type React from 'react';
import { type PropsWithChildren } from 'react';

export interface MenuItemProps extends _MenuItemProps {
  label: string;
  href?: string;
}

interface MenuProps {
  children: React.ReactNode;
  items: MenuItemProps[];
}

export const Menu = ({ items, children }: PropsWithChildren<MenuProps>) => {
  const dropMenuItems = items.map((item) => (
    <MenuItem key={item.label} {...item}>
      {item.label}
    </MenuItem>
  ));
  return (
    <CMenu>
      {({ isOpen }) => (
        <Box>
          <MenuButton
            as={Button}
            isActive={isOpen}
            px="6"
            py="3"
            rightIcon={<ChevronDownIcon />}
            variant="secondary"
          >
            {children}
          </MenuButton>
          <MenuList>{dropMenuItems}</MenuList>
        </Box>
      )}
    </CMenu>
  );
};
