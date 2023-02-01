import { IconProps } from '@chakra-ui/react';

import { TokenEthIcon, TokenHereIcon, TokenNearIcon } from '../Icons';

interface CoinIconProps extends IconProps {
  symbol: string;
}

export const CoinIcon = ({ symbol, ...iconProps }: CoinIconProps) => {
  switch (symbol.toLowerCase()) {
    case 'eth':
      return <TokenEthIcon {...iconProps} />;
    case 'here':
      return <TokenHereIcon {...iconProps} />;
    case 'near':
    default:
      return <TokenNearIcon {...iconProps} />;
  }
};
