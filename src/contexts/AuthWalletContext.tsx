import { type AccountState, type WalletSelector } from '@near-wallet-selector/core';
import { providers } from 'near-api-js';
import { AccountView } from 'near-api-js/lib/providers/provider';
import { WalletSelectorModal } from '@near-wallet-selector/modal-ui';
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
// import { map, distinctUntilChanged } from 'rxjs';

import { NearWalletSelector } from '@/lib/walletSelector';

declare global {
  interface Window {
    selector: WalletSelector;
    modal: WalletSelectorModal;
  }
}

type Account = AccountView & {
  account_id: string;
};

interface AuthWalletContextValues {
  modal: WalletSelectorModal;
  selector: WalletSelector;
  accounts: AccountState[];
  accountId: string | null;
  isLoggedIn: boolean;
  account: Account;
}

const AuthWalletContext = createContext<AuthWalletContextValues | null>(null);

export const AuthWalletContextProvider = ({ children }: PropsWithChildren) => {
  const [selector, setSelector] = useState<WalletSelector | null>(null);
  const [modal, setModal] = useState<WalletSelectorModal | null>(null);
  const [accounts, setAccounts] = useState<AccountState[]>([]);
  const [account, setAccount] = useState<Account | null>(null);

  const accountId = accounts.find((account) => account.active)?.accountId || null;

  const initWalletSelector = async () => {
    const walletSelector = new NearWalletSelector();
    await walletSelector.init();

    setModal(walletSelector.modal);
    setSelector(walletSelector.selector);
    setAccounts(walletSelector.accounts);

    if (typeof window !== undefined) {
      window.modal = walletSelector.modal;
      window.selector = walletSelector.selector;
    }
  };

  const getAccount = useCallback(async (): Promise<Account | null> => {
    if (!accountId) {
      return null;
    }

    const { network } = selector.options;
    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

    return await provider
      .query<AccountView>({
        request_type: 'view_account',
        finality: 'final',
        account_id: accountId,
      })
      .then((data) => ({
        ...data,
        account_id: accountId,
      }));
  }, [accountId, selector?.options]);

  useEffect(() => {
    initWalletSelector();
  }, []);

  // COMMENTED OUT
  // Runtime error when this useEffect is used
  // Uncaught TypeError: Class extends value undefined is not a constructor or null
  // TODO: investigate and mitigate
  //
  // useEffect(() => {
  //   if (selector == null) {
  //     return null;
  //   }

  //   const subscription = selector.store.observable
  //     .pipe(
  //       map((state) => state.accounts),
  //       distinctUntilChanged(),
  //     )
  //     .subscribe((nextAccounts) => {
  //       console.log('Accounts Update', nextAccounts);

  //       setAccounts(nextAccounts);
  //     });

  //   return () => {
  //     subscription.unsubscribe();
  //   };
  // }, [selector]);

  // set account
  useEffect(() => {
    if (!accountId) {
      setAccount(null);
      return;
    }

    // setLoading(true);

    getAccount().then((nextAccount) => {
      setAccount(nextAccount);
      // setLoading(false);
    });
  }, [accountId, getAccount]);

  return (
    <AuthWalletContext.Provider
      value={{ modal, accounts, selector, accountId, isLoggedIn: !(account == null), account }}
    >
      {children}
    </AuthWalletContext.Provider>
  );
};

export const useAuthWalletContext = () => {
  const context = useContext(AuthWalletContext);

  if (context == null) {
    throw new Error('useAuthWalletContext must be used within a AuthWalletContextProvider');
  }

  return context;
};