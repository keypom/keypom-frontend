import { Icon, type IconProps } from '@chakra-ui/react';

export const ChevronLeftIcon = (props: IconProps) => {
  return (
    <Icon
      fill="transparent"
      h="5"
      viewBox="0 0 20 20"
      w="5"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M13.0896 4.41009C13.415 4.73553 13.415 5.26317 13.0896 5.5886L8.67884 9.99935L13.0896 14.4101C13.415 14.7355 13.415 15.2632 13.0896 15.5886C12.7641 15.914 12.2365 15.914 11.9111 15.5886L6.91107 10.5886C6.58563 10.2632 6.58563 9.73553 6.91107 9.41009L11.9111 4.41009C12.2365 4.08466 12.7641 4.08466 13.0896 4.41009Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </Icon>
  );
};
