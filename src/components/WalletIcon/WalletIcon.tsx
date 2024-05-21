import { type IconProps } from '@chakra-ui/react';

import { MyNearLogoIcon, NearIcon } from '../Icons';
import { MintbaseWalletIcon } from '../Icons/wallets/MintbaseWalletIcon';
import { MeterWalletIcon } from '../Icons/wallets/MeteorWalletIcon';

interface WalletIconProps extends IconProps {
  name: string;
}

export const WalletIcon = ({ name, ...iconProps }: WalletIconProps) => {
  switch (name.toLowerCase()) {
    case 'near':
      return <NearIcon {...iconProps} />;
    case 'meteorwallet':
      return <MeterWalletIcon {...iconProps} />;
    case 'mintbasewallet':
      return <MintbaseWalletIcon {...iconProps} />;
    case 'mynearwallet':
    default:
      return <MyNearLogoIcon {...iconProps} />;
  }
};
