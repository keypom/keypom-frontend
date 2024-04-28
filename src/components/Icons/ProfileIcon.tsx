import { Icon, type IconProps } from '@chakra-ui/react';

interface ProfileIconProps extends IconProps {
  color?: string;
}

export const ProfileIcon = ({ color = 'white', ...props }: ProfileIconProps) => {
  return (
    <Icon
      fill="none"
      height="40px"
      viewBox="0 0 41 40"
      width="41px"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9.32562 32.3973C10.3395 30.0086 12.7067 28.3333 15.4651 28.3333H25.4651C28.2236 28.3333 30.5908 30.0086 31.6046 32.3973M27.1318 15.8333C27.1318 19.5152 24.147 22.4999 20.4651 22.4999C16.7832 22.4999 13.7985 19.5152 13.7985 15.8333C13.7985 12.1514 16.7832 9.16659 20.4651 9.16659C24.147 9.16659 27.1318 12.1514 27.1318 15.8333ZM37.1318 19.9999C37.1318 29.2047 29.6699 36.6666 20.4651 36.6666C11.2604 36.6666 3.79846 29.2047 3.79846 19.9999C3.79846 10.7952 11.2604 3.33325 20.4651 3.33325C29.6699 3.33325 37.1318 10.7952 37.1318 19.9999Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </Icon>
  );
};
