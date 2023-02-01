import { Icon, type IconProps } from '@chakra-ui/react';
import React from 'react';

export const HereLogoIcon = ({ ...props }: IconProps) => {
  return (
    <Icon
      fill="none"
      height="5"
      viewBox="0 0 26 18"
      width="7"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10.8492 14.6985L10.8791 14.7138L10.913 14.7114L25.1297 13.8518L23.8653 16.1244L9.52016 16.9921L1 12.7781L2.28699 10.4634L10.8484 14.6985H10.8492ZM13.5007 4.95674L13.041 2.78348L14.269 0.501953L15.9317 6.05145L13.5007 4.95674ZM11.4325 9.64582L5.97427 10.0215L1.78367 7.97911L3.07955 5.65073L11.4317 9.64582H11.4325Z"
        fill="#2C3034"
        stroke="#FDBF1E"
        strokeWidth="0.256106"
      />
      <path
        d="M25.3559 13.7104L10.9106 14.5846L2.16504 10.2865L11.6353 9.71451L3.02546 5.48351L7.25403 1.91661L16.023 6.21305L14.3038 0.169922L22.6834 4.26438L25.3559 13.7104V13.7104Z"
        fill="#FDBF1C"
      />
    </Icon>
  );
};
