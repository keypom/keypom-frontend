import { Icon, type IconProps } from '@chakra-ui/react';
import React from 'react';

export const DeleteIcon = ({ ...props }: IconProps) => {
  return (
    <Icon
      fill="none"
      height="4"
      viewBox="0 0 14 16"
      width="3.5"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9.66667 3.9987V3.46536C9.66667 2.71863 9.66667 2.34526 9.52134 2.06004C9.39351 1.80916 9.18954 1.60519 8.93865 1.47736C8.65344 1.33203 8.28007 1.33203 7.53333 1.33203H6.46667C5.71993 1.33203 5.34656 1.33203 5.06135 1.47736C4.81046 1.60519 4.60649 1.80916 4.47866 2.06004C4.33333 2.34526 4.33333 2.71863 4.33333 3.46536V3.9987M1 3.9987H13M11.6667 3.9987V11.4654C11.6667 12.5855 11.6667 13.1455 11.4487 13.5733C11.2569 13.9497 10.951 14.2556 10.5746 14.4474C10.1468 14.6654 9.58677 14.6654 8.46667 14.6654H5.53333C4.41323 14.6654 3.85318 14.6654 3.42535 14.4474C3.04903 14.2556 2.74307 13.9497 2.55132 13.5733C2.33333 13.1455 2.33333 12.5855 2.33333 11.4654V3.9987"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </Icon>
  );
};
