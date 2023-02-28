import { type CheckboxItem } from '@/components/Checkboxes';
import { CoinIcon } from '@/components/CoinIcon';
import { MyNearLogoIcon, NearLogoIcon } from '@/components/Icons';
import getConfig from '@/config/config';

/**
 * Wallet form providers.
 */

const { supportedWallets } = getConfig();

// checkboxes for create token/nft drop form
export const WALLET_CHECKBOXES: CheckboxItem[] = supportedWallets.map(
  ({ symbol, walletName, id }) => ({
    name: walletName,
    value: id,
    icon: <CoinIcon symbol={symbol.toLowerCase()} />,
  }),
);

// TODO: refactor wallet tokens or check if this is still needed
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
