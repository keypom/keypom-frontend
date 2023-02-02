import { Icon, type IconProps } from '@chakra-ui/react';

export const NFTIcon = ({ ...props }: IconProps) => {
  return (
    <Icon
      fill="none"
      height="3.5"
      viewBox="0 0 14 14"
      width="3.5"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1.75 4.55C1.75 3.56991 1.75 3.07986 1.94074 2.70552C2.10852 2.37623 2.37623 2.10852 2.70552 1.94074C3.07986 1.75 3.56991 1.75 4.55 1.75H9.45C10.4301 1.75 10.9201 1.75 11.2945 1.94074C11.6238 2.10852 11.8915 2.37623 12.0593 2.70552C12.25 3.07986 12.25 3.56991 12.25 4.55V9.45C12.25 10.4301 12.25 10.9201 12.0593 11.2945C11.8915 11.6238 11.6238 11.8915 11.2945 12.0593C10.9201 12.25 10.4301 12.25 9.45 12.25H4.55C3.56991 12.25 3.07986 12.25 2.70552 12.0593C2.37623 11.8915 2.10852 11.6238 1.94074 11.2945C1.75 10.9201 1.75 10.4301 1.75 9.45V4.55Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.25 5.54167L3.5 8.75H10.5L7.875 4.375L6.41667 6.41667L5.25 5.54167Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
};
