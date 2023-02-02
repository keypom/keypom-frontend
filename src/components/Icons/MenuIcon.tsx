import { Icon, type IconProps } from '@chakra-ui/react';

export const MenuIcon = ({ ...props }: IconProps) => {
  return (
    <Icon h="3" viewBox="0 0 18 12" w="1.125rem" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M1.5 6H16.5M1.5 1H16.5M6.5 11H16.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </Icon>
  );
};
