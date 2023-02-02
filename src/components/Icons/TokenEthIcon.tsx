import { Icon, type IconProps } from '@chakra-ui/react';

export const TokenEthIcon = ({ ...props }: IconProps) => {
  return (
    <Icon
      h="1.375rem"
      viewBox="0 0 22 22"
      w="1.375rem"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_2230_294)">
        <path
          d="M10.9944 0.283203L10.8506 0.771531V14.9404L10.9944 15.0839L17.5713 11.1962L10.9944 0.283203Z"
          fill="#343434"
        />
        <path
          d="M10.9951 0.283203L4.41797 11.1962L10.9951 15.0839V8.20667V0.283203Z"
          fill="#8C8C8C"
        />
        <path
          d="M10.9941 16.329L10.9131 16.4278V21.475L10.9941 21.7115L17.5751 12.4434L10.9941 16.329Z"
          fill="#3C3C3B"
        />
        <path d="M10.9951 21.7115V16.329L4.41797 12.4434L10.9951 21.7115Z" fill="#8C8C8C" />
        <path d="M10.9961 15.0842L17.573 11.1966L10.9961 8.20703V15.0842Z" fill="#141414" />
        <path d="M4.41797 11.1966L10.9951 15.0842V8.20703L4.41797 11.1966Z" fill="#393939" />
      </g>
      <defs>
        <clipPath id="clip0_2230_294">
          <rect
            fill="white"
            height="21.4286"
            transform="translate(0.286133 0.285156)"
            width="21.4286"
          />
        </clipPath>
      </defs>
    </Icon>
  );
};
