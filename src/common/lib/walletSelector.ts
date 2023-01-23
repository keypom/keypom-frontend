import {
  AccountState,
  NetworkId,
  setupWalletSelector,
  WalletSelector as WalletSelectorType,
} from '@near-wallet-selector/core';
import { setupModal, WalletSelectorModal } from '@near-wallet-selector/modal-ui';
import { setupNearWallet } from '@near-wallet-selector/near-wallet';
import { setupSender } from "@near-wallet-selector/sender";

const NETWORK_ID = process.env.NEXT_PUBLIC_NETWORK_ID || 'testnet';
const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_ID || 'v1-3.keypom.testnet';

export class WalletSelector {
  public accounts: AccountState[];
  public selector: WalletSelectorType;
  public modal: WalletSelectorModal;

  async init(): Promise<void> {
    const _selector = await setupWalletSelector({
      network: NETWORK_ID as NetworkId,
      debug: true,
      modules: [
        setupNearWallet(),
        setupSender()
      ],
    });
    const _modal = setupModal(_selector, { contractId: CONTRACT_ID });
    const state = _selector.store.getState();

    this.accounts = state.accounts;
    this.modal = _modal;
    this.selector = _selector;
  }
}
