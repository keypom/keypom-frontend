import { AccountState, WalletSelector as WalletSelectorType } from '@near-wallet-selector/core';
import { WalletSelectorModal } from '@near-wallet-selector/modal-ui';
import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

import { WalletSelector } from '../lib/walletSelector';

declare global {
  interface Window {
    selector: WalletSelectorType;
    modal: WalletSelectorModal;
  }
}

interface AuthWalletContextValues {
  modal: WalletSelectorModal;
  selector: WalletSelectorType;
  accounts: Array<AccountState>;
  accountId: string | null;
}

// const initWalletSelector = async () => {
//   const _selector = await setupWalletSelector({
//     network: 'testnet',
//     debug: true,
//     modules: [setupNearWallet()],
//   });
//   const _modal = setupModal(_selector, { contractId: 'keypom-app.testnet' });
//   const state = _selector.store.getState();

//   window.selector = _selector;
//   window.modal = _modal;

//   return {
//     accounts: state.accounts,
//     selector: _selector,
//     modal: _modal,
//   };
// };

const AuthWalletContext = createContext<AuthWalletContextValues | null>(null);

export const AuthWalletContextProvider = ({ children }: PropsWithChildren) => {
  const [selector, setSelector] = useState<WalletSelectorType | null>(null);
  const [modal, setModal] = useState<WalletSelectorModal | null>(null);
  const [accounts, setAccounts] = useState<AccountState[]>([]);

  const initWalletSelector = async () => {
    const walletSelector = new WalletSelector();
    await walletSelector.init();

    setModal(walletSelector.modal);
    setSelector(walletSelector.selector);
    setAccounts(walletSelector.accounts);

    console.log(typeof window);
    console.log(walletSelector.modal);

    if (typeof window !== undefined) {
      window.modal = walletSelector.modal;
      window.selector = walletSelector.selector;
    }
  };

  useEffect(() => {
    initWalletSelector();
  }, []);

  return (
    <AuthWalletContext.Provider value={{ modal, accounts, selector, accountId: null }}>
      {children}
    </AuthWalletContext.Provider>
  );
};

export function useAuthWalletContext() {
  const context = useContext(AuthWalletContext);

  if (!context) {
    throw new Error('useAuthWalletContext must be used within a AuthWalletContextProvider');
  }

  return context;
}
