import {
  type AccountState,
  type NetworkId,
  setupWalletSelector,
  type WalletSelector,
} from '@near-wallet-selector/core';
import { setupModal, type WalletSelectorModal } from '@near-wallet-selector/modal-ui';
import { setupNearWallet } from '@near-wallet-selector/near-wallet';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';

const NETWORK_ID = process.env.NETWORK_ID ?? 'testnet';
const CONTRACT_ID = process.env.REACT_APP_CONTRACT_ID ?? 'v2.keypom.testnet';

export class NearWalletSelector {
  public accounts: AccountState[];
  public selector: WalletSelector;
  public modal: WalletSelectorModal;

  async init(): Promise<void> {
    const _selector = await setupWalletSelector({
      network: NETWORK_ID as NetworkId,
      debug: true,
      modules: [setupNearWallet(), setupMyNearWallet()],
    });
    const _modal = setupModal(_selector, { contractId: CONTRACT_ID });
    const state = _selector.store.getState();

    this.accounts = state.accounts;
    this.modal = _modal;
    this.selector = _selector;
  }
}
