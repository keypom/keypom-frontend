import { Icon, type IconProps } from '@chakra-ui/react';

export const DropIcon = ({ ...props }: IconProps) => {
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
        d="M12.3332 8.83398C12.3332 11.7795 9.94536 14.1673 6.99984 14.1673C4.05432 14.1673 1.6665 11.7795 1.6665 8.83398C1.6665 8.12672 1.80418 7.45161 2.05418 6.83398C2.84536 4.87943 6.99984 0.833984 6.99984 0.833984C6.99984 0.833984 11.1543 4.87943 11.9455 6.83398C12.1955 7.45161 12.3332 8.12672 12.3332 8.83398Z"
        stroke="#475569"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </Icon>
  );
};
