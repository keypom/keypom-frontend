import { type IconProps } from '@chakra-ui/react';

import { NearIcon, TokenEthIcon } from '../Icons';

interface TokenIconProps extends IconProps {
  symbol: string;
}

export const TokenIcon = ({ symbol, ...iconProps }: TokenIconProps) => {
  switch (symbol.toLowerCase()) {
    case 'eth':
      return <TokenEthIcon {...iconProps} />;
    case 'near':
    default:
      return <NearIcon height="4" width="4" {...iconProps} />;
  }
};
