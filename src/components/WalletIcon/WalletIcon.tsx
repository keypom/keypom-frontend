import { type IconProps } from '@chakra-ui/react';

import { MyNearLogoIcon, HereWalletIcon, NearIcon } from '../Icons';

interface WalletIconProps extends IconProps {
  name: string;
}

export const WalletIcon = ({ name, ...iconProps }: WalletIconProps) => {
  switch (name.toLowerCase()) {
    case 'near':
      return <NearIcon {...iconProps} />;
    case 'here':
      return <HereWalletIcon {...iconProps} />;
    case 'mynearwallet':
    default:
      return <MyNearLogoIcon {...iconProps} />;
  }
};
