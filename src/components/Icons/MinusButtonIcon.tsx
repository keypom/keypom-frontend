import { Icon, type IconProps } from '@chakra-ui/react';

export const MinusButtonIcon = (props: IconProps) => {
  return (
    <Icon
      fill="transparent"
      h="3px"
      viewBox="0 0 12 3"
      w="12px"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1.33325 1.5H10.6666"
        stroke="currentColor" // Use currentColor to make the stroke color inheritable
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </Icon>
  );
};
