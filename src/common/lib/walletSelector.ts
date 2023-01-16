import {
  AccountState,
  setupWalletSelector,
  WalletSelector as WalletSelectorType,
} from '@near-wallet-selector/core';
import { setupModal, WalletSelectorModal } from '@near-wallet-selector/modal-ui';
import { setupNearWallet } from '@near-wallet-selector/near-wallet';

export class WalletSelector {
  public accounts: AccountState[];
  public selector: WalletSelectorType;
  public modal: WalletSelectorModal;

  async init(): Promise<void> {
    const _selector = await setupWalletSelector({
      network: 'testnet',
      debug: true,
      modules: [setupNearWallet()],
    });
    const _modal = setupModal(_selector, { contractId: 'keypom-app.testnet' });
    const state = _selector.store.getState();

    this.accounts = state.accounts;
    this.modal = _modal;
    this.selector = _selector;
  }
}
