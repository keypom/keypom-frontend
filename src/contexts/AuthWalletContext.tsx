import { type AccountState, type WalletSelector } from '@near-wallet-selector/core';
import { providers } from 'near-api-js';
import { type AccountView } from 'near-api-js/lib/providers/provider';
import { type WalletSelectorModal } from '@near-wallet-selector/modal-ui-js';
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { NearWalletSelector } from '@/lib/walletSelector';

declare global {
  interface Window {
    selector: WalletSelector;
    modal: WalletSelectorModal;
  }
}

type Account = AccountView & {
  account_id: string;
  public_key?: string;
  display_name?: string;
};

interface AuthWalletContextValues {
  modal: WalletSelectorModal;
  selector: WalletSelector;
  accounts: KeypomAccountState[];
  accountId: string | null;
  isLoggedIn: boolean;
  account: Account;
}

const AuthWalletContext = createContext<AuthWalletContextValues | null>(null);

interface KeypomAccountState extends AccountState {
  displayName?: string
}

export const AuthWalletContextProvider = ({ children }: PropsWithChildren) => {
  const [selector, setSelector] = useState<WalletSelector | null>(null);
  const [modal, setModal] = useState<WalletSelectorModal | null>(null);
  const [accounts, setAccounts] = useState<KeypomAccountState[]>([]);
  const [account, setAccount] = useState<Account | null>(null);

  const activeAccount = accounts.find((account) => account.active) ?? null;

  const getAccount = useCallback(async (): Promise<Account | null> => {
    if (!activeAccount) {
      return null;
    }
    console.log("Active account: ", activeAccount)

    const provider = new providers.JsonRpcProvider({
      url: selector?.options?.network.nodeUrl ?? '',
    });

    return await provider
      .query<AccountView>({
        request_type: 'view_account',
        finality: 'final',
        account_id: activeAccount.accountId,
      })
      .then((data) => ({
        ...data,
        account_id: activeAccount.accountId,
        public_key: activeAccount.publicKey,
        display_name: activeAccount.displayName
      }));
  }, [activeAccount, selector?.options]);

  useEffect(() => {
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

    initWalletSelector().catch(console.error); // eslint-disable-line no-console
  }, []);

  // set account
  useEffect(() => {
    if (!activeAccount) {
      setAccount(null);
      return;
    }

    // setLoading(true);

    getAccount()
      .then((nextAccount) => {
        console.log("Next account: ", nextAccount)
        sessionStorage.setItem('account', JSON.stringify(nextAccount));
        setAccount(nextAccount);
        // setLoading(false);
      })
      .catch(console.error); // eslint-disable-line no-console
  }, [activeAccount, getAccount]);

  selector?.on('signedIn', () => {
    const newAccountState: AccountState[] = selector.store.getState().accounts;
    setAccounts(newAccountState);
    getAccount().then((nextAccount) => {
      console.log(nextAccount);
      sessionStorage.setItem('account', JSON.stringify(nextAccount));
      setAccount(nextAccount);
    });
  });

  selector?.on('signedOut', () => {
    sessionStorage.removeItem('account');
  });

  const value = {
    modal: modal as WalletSelectorModal,
    selector: selector as WalletSelector,
    accounts,
    accountId: activeAccount?.accountId || null,
    isLoggedIn: Boolean(selector ? selector.isSignedIn() : true), // selector?.isSignedIn(), with null, cant login. with undefined, cant signout properly
    account: account as Account,
  };

  return <AuthWalletContext.Provider value={value}>{children}</AuthWalletContext.Provider>;
};

export const useAuthWalletContext = () => {
  const context = useContext(AuthWalletContext);

  if (context === null) {
    throw new Error('useAuthWalletContext must be used within a AuthWalletContextProvider');
  }

  return context;
};
