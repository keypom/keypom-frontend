import { Icon, type IconProps } from '@chakra-ui/react';

interface CheckedIconProps extends IconProps {
  isIndeterminate?: boolean;
  isChecked?: boolean;
}

export const CheckedIcon = ({ isIndeterminate, isChecked = true, ...props }: CheckedIconProps) => {
  return (
    <Icon
      fill="none"
      height="2"
      viewBox="0 0 18 18"
      width="1"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect fill={isChecked ? '#30C9F3' : ''} height="17" rx="5.5" width="17" x="0.5" y="0.5" />
      <path
        d="M13 6.19922L7.4 11.7992L5 9.39922"
        stroke={isChecked ? 'white' : '#9E9E9E'} // Adjust the stroke of the checkmark based on isChecked
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <rect
        height="17"
        rx="5.5"
        stroke={isChecked ? '#30C9F3' : '#9E9E9E'} // Use #9E9E9E for the border when not checked
        width="17"
        x="0.5"
        y="0.5"
      />
    </Icon>
  );
};
