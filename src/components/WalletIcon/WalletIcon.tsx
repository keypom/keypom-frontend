import { type IconProps } from '@chakra-ui/react';

import { MyNearLogoIcon, HereWalletIcon, NearIcon } from '../Icons';
import { MintbaseWalletIcon } from '../Icons/wallets/MintbaseWalletIcon';

interface WalletIconProps extends IconProps {
  name: string;
}

export const WalletIcon = ({ name, ...iconProps }: WalletIconProps) => {
  switch (name.toLowerCase()) {
    case 'near':
      return <NearIcon {...iconProps} />;
    case 'herewallet':
      return <HereWalletIcon {...iconProps} />;
    case 'mintbasewallet':
      return <MintbaseWalletIcon {...iconProps} />;
    case 'mynearwallet':
    default:
      return <MyNearLogoIcon {...iconProps} />;
  }
};
