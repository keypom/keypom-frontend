import { Icon, type IconProps } from '@chakra-ui/react';

interface WalletIconProps extends IconProps {
  color?: string;
}

export const WalletIcon = ({ color = 'white', ...props }: WalletIconProps) => {
  return (
    <Icon
      fill="none"
      height="40px"
      viewBox="0 0 42 40"
      width="42px"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M28.3038 23.3333H28.3209M5.24133 8.33333V31.6667C5.24133 33.5076 6.77103 35 8.658 35H32.5747C34.4616 35 35.9913 33.5076 35.9913 31.6667V15C35.9913 13.1591 34.4616 11.6667 32.5747 11.6667L8.658 11.6667C6.77103 11.6667 5.24133 10.1743 5.24133 8.33333ZM5.24133 8.33333C5.24133 6.49238 6.77103 5 8.658 5H29.158M29.158 23.3333C29.158 23.7936 28.7756 24.1667 28.3038 24.1667C27.8321 24.1667 27.4497 23.7936 27.4497 23.3333C27.4497 22.8731 27.8321 22.5 28.3038 22.5C28.7756 22.5 29.158 22.8731 29.158 23.3333Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </Icon>
  );
};
