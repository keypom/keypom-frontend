import { CheckboxItem } from '@/common/components/Checkboxes';
import { HereLogoIcon, MyNearLogoIcon, NearLogoIcon } from '@/common/components/Icons';

/**
 * Temporary data providers
 */

export const WALLET_OPTIONS: CheckboxItem[] = [
  {
    name: 'NEAR Wallet',
    value: 'near_wallet',
    icon: <NearLogoIcon height="7" width="5" />,
  },
  {
    name: 'My NEAR Wallet',
    value: 'my_near_wallet',
    icon: <MyNearLogoIcon height="6" width="5" />,
  },
  {
    name: 'HERE Wallet',
    value: 'here_wallet',
    icon: <HereLogoIcon height="7" width="5" />,
  },
];

export const WALLET_TOKENS = [
  {
    amount: '500',
    symbol: 'NEAR',
    wallet: 'near_wallet',
    icon: <NearLogoIcon height="4" width="4" />,
  },
  {
    amount: '1000',
    symbol: 'USDC',
    wallet: 'my_near_wallet',
    icon: <MyNearLogoIcon height="5" width="5" />,
  },
  {
    amount: '10',
    symbol: 'ETH',
    wallet: 'here_wallet',
    icon: <HereLogoIcon height="4" width="4" />,
  },
];
