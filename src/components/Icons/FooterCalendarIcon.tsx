import { Icon, type IconProps } from '@chakra-ui/react';

interface FooterCalendarIconProps extends IconProps {
  color?: string;
}
export const FooterCalendarIcon = ({ color = 'white', ...props }: FooterCalendarIconProps) => {
  return (
    <Icon
      fill="none"
      height="41"
      viewBox="0 0 41 40"
      width="40"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M35.2325 16.6666H5.23254M26.8992 3.33325V9.99992M13.5659 3.33325V9.99992M13.2325 36.6666H27.2325C30.0328 36.6666 31.4329 36.6666 32.5025 36.1216C33.4433 35.6423 34.2082 34.8773 34.6876 33.9365C35.2325 32.867 35.2325 31.4669 35.2325 28.6666V14.6666C35.2325 11.8663 35.2325 10.4662 34.6876 9.39663C34.2082 8.45582 33.4433 7.69092 32.5025 7.21155C31.4329 6.66659 30.0328 6.66659 27.2325 6.66659H13.2325C10.4323 6.66659 9.03215 6.66659 7.96259 7.21155C7.02178 7.69092 6.25688 8.45582 5.77751 9.39663C5.23254 10.4662 5.23254 11.8663 5.23254 14.6666V28.6666C5.23254 31.4668 5.23254 32.867 5.77751 33.9365C6.25688 34.8773 7.02178 35.6423 7.96259 36.1216C9.03215 36.6666 10.4323 36.6666 13.2325 36.6666Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </Icon>
  );
};
