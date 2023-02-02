import { Icon, type IconProps } from '@chakra-ui/react';

export const SignOutIcon = ({ ...props }: IconProps) => {
  return (
    <Icon
      fill="none"
      height="15px"
      viewBox="0 0 14 15"
      width="14px"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9.66667 10.8333L13 7.5M13 7.5L9.66667 4.16667M13 7.5H5M5 1.5H4.2C3.0799 1.5 2.51984 1.5 2.09202 1.71799C1.7157 1.90973 1.40973 2.21569 1.21799 2.59202C1 3.01984 1 3.57989 1 4.7V10.3C1 11.4201 1 11.9802 1.21799 12.408C1.40973 12.7843 1.71569 13.0903 2.09202 13.282C2.51984 13.5 3.0799 13.5 4.2 13.5H5"
        stroke="#475569"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </Icon>
  );
};
