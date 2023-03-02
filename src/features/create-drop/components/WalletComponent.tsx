import { type CheckboxItem } from '@/components/Checkboxes';
import { WalletIcon } from '@/components/WalletIcon';
import getConfig from '@/config/config';

/**
 * Wallet form providers.
 */

const { supportedWallets } = getConfig();

// checkboxes for create token/nft drop form
export const WALLET_CHECKBOXES: CheckboxItem[] = supportedWallets.map(({ name, title }) => ({
  name: title,
  value: name,
  icon: <WalletIcon name={name.toLowerCase()} />,
}));
