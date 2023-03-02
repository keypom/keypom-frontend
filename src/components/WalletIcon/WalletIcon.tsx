import { type IconProps } from '@chakra-ui/react';

import { MyNearLogoIcon, HereWalletIcon, TokenNearIcon } from '../Icons';

interface WalletIconProps extends IconProps {
  name: string;
}

export const WalletIcon = ({ name, ...iconProps }: WalletIconProps) => {
  switch (name.toLowerCase()) {
    case 'mynearwallet':
      return <MyNearLogoIcon {...iconProps} />;
    case 'here':
      return <HereWalletIcon {...iconProps} />;
    case 'near':
    default:
      return <TokenNearIcon {...iconProps} />;
  }
};
