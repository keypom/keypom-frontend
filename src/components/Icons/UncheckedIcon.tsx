import { Icon, type IconProps } from '@chakra-ui/react';

export const UncheckedIcon = (props: IconProps) => {
  return (
    <Icon
      fill="none"
      height="18"
      viewBox="0 0 18 18"
      width="18"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect fill="#F8FAFC" height="17" rx="5.5" width="17" x="0.5" y="0.5" />
      <rect height="17" rx="5.5" stroke="#E2E8F0" width="17" x="0.5" y="0.5" />
    </Icon>
  );
};
