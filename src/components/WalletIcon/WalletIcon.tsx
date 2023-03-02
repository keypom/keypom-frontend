import { type IconProps } from '@chakra-ui/react';

import { MyNearLogoIcon, HereWalletIcon, TokenNearIcon } from '../Icons';

interface WalletIconProps extends IconProps {
  name: string;
}

export const WalletIcon = ({ name, ...iconProps }: WalletIconProps) => {
  switch (name.toLowerCase()) {
    case 'near':
      return <TokenNearIcon {...iconProps} />;
    case 'here':
      return <HereWalletIcon {...iconProps} />;
    case 'mynearwallet':
    default:
      return <MyNearLogoIcon {...iconProps} />;
  }
};
