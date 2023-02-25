import { type CheckboxItem } from '@/components/Checkboxes';
import { MyNearLogoIcon, NearLogoIcon } from '@/components/Icons';

/**
 * Temporary data providers.
 * Some wallets are commented due to deprecation and in case of usage in the future.
 */

export const WALLET_OPTIONS: CheckboxItem[] = [
  {
    name: 'My NEAR Wallet',
    value: 'my_near_wallet',
    icon: <MyNearLogoIcon height="6" width="5" />,
  },
  // {
  //   name: 'NEAR Wallet',
  //   value: 'near_wallet',
  //   icon: <NearLogoIcon height="7" width="5" />,
  // },
  // {
  //   name: 'HERE Wallet',
  //   value: 'here_wallet',
  //   icon: <HereLogoIcon height="7" width="5" />,
  // },
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
    symbol: 'myNEAR',
    wallet: 'my_near_wallet',
    icon: <MyNearLogoIcon height="5" width="5" />,
  },
  // {
  //   amount: '10',
  //   symbol: 'ETH',
  //   wallet: 'here_wallet',
  //   icon: <HereLogoIcon height="4" width="4" />,
  // },
];
