import { type IconProps } from '@chakra-ui/react';

import { MyNearLogoIcon, TokenEthIcon, TokenHereIcon, TokenNearIcon } from '../Icons';

interface CoinIconProps extends IconProps {
  symbol: string;
}

export const CoinIcon = ({ symbol, ...iconProps }: CoinIconProps) => {
  switch (symbol.toLowerCase()) {
    case 'eth':
      return <TokenEthIcon {...iconProps} />;
    case 'mynear':
      return <MyNearLogoIcon {...iconProps} />;
    case 'here':
      return <TokenHereIcon {...iconProps} />;
    case 'near':
    default:
      return <TokenNearIcon {...iconProps} />;
  }
};
