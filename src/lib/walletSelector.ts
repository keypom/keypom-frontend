import {
  type AccountState,
  type NetworkId,
  setupWalletSelector,
  type WalletSelector,
} from '@near-wallet-selector/core';
import { setupModal, type WalletSelectorModal } from '@near-wallet-selector/modal-ui';
import { setupNearWallet } from '@near-wallet-selector/near-wallet';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { setupHereWallet } from '@near-wallet-selector/here-wallet';
import { setupMintbaseWallet } from '@near-wallet-selector/mintbase-wallet';

import { KEYPOM_EVENTS_CONTRACT } from '@/constants/common';
import getConfig from '@/config/config';

const NETWORK_ID = process.env.REACT_APP_NETWORK_ID ?? 'testnet';

const config =getConfig();

export class NearWalletSelector {
  public accounts: AccountState[];
  public selector: WalletSelector;
  public modal: WalletSelectorModal;

  async init(): Promise<void> {
    const _selector = await setupWalletSelector({
      network: NETWORK_ID as NetworkId,
      debug: true,
      modules: [
        setupNearWallet(), 
        setupMyNearWallet(), 
        setupHereWallet(), 
        setupMintbaseWallet({
          walletUrl: config.networkId == "mainnnet" ? 'https://wallet.mintbase.xyz': 'https://testnet.wallet.mintbase.xyz',
          callbackUrl: window.location.origin,
        })],
    });
    const _modal = setupModal(_selector, { contractId: KEYPOM_EVENTS_CONTRACT, theme: 'light' });
    const state = _selector.store.getState();

    this.accounts = state.accounts;
    this.modal = _modal;
    this.selector = _selector;
  }
}
