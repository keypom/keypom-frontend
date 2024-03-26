import { ChevronDownIcon } from '@chakra-ui/icons';
import { Button, MenuButton } from '@chakra-ui/react';

export const DropDownButton = ({
  isOpen,
  placeholder,
  variant,
  onClick,
}: {
  isOpen: boolean;
  placeholder: string;
  variant: 'primary' | 'secondary';
  onClick: () => void;
}) => (
  <MenuButton
    as={Button}
    color={variant === 'primary' ? 'white' : 'gray.400'}
    height="full"
    isActive={isOpen}
    lineHeight=""
    px="6"
    py="3"
    rightIcon={<ChevronDownIcon color={variant === 'secondary' ? 'gray.800' : ''} />}
    variant={variant}
    onClick={onClick}
  >
    {placeholder}
  </MenuButton>
);
