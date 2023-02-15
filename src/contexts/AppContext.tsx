import { createContext, type PropsWithChildren, useContext, useState } from 'react';
import { set } from '@/utils/localStorage'

interface AppModalInputs {
  placeholder: string;
  valueKey: string;
}

interface AppModalOptions {
  label: string;
  func: (values) => void;
}

interface AppModalValues {
  isOpen: boolean;
  message?: string;
  header?: string;
  options?: AppModalOptions[];
  inputs?: AppModalInputs[];
}

interface AppContextValues {
  appModal: AppModalValues;
  setAppModal: (args: AppModalValues) => void;
}

const AppContext = createContext<AppContextValues | null>(null);

export const AppContextProvider = ({ children }: PropsWithChildren) => {
  const [appModal, setAppModal] = useState<AppModalValues>({
    isOpen: false,
  });

  const value = {
    appModal,
    setAppModal,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (context === null) {
    throw new Error('useAppContext must be used within a AppContextProvider');
  }

  return context;
};

/// helpers

export const setAppModalHelper = (setAppModal, confirm, cancel) => {
  setAppModal({
    isOpen: true,
    header: 'Set your master key!',
    message: 'This key is used to generate the links for all of your drops. Do NOT lose it or forget it!',
    inputs: [
      {
        placeholder: 'Master Key',
        valueKey: 'masterKey',
      },
    ],
    options: [
      {
        label: 'Cancel',
        func: () => {
          // eslint-disable-next-line no-console
          console.log('user cancelled');
          if (cancel) cancel()
        },
      },
      {
        label: 'Set Master Key',
        func: ({ masterKey }) => {
          set('MASTER_KEY', masterKey);
          if (confirm) confirm()
        },
      },
    ],
  });
}