import { createContext, type PropsWithChildren, useContext, useState } from 'react';
import { type ButtonProps } from '@chakra-ui/react';

import { set } from '@/utils/localStorage';

export interface AppModalInputs {
  placeholder: string;
  valueKey: string;
}

export interface AppModalOptions {
  label: string;
  func?: (values) => Promise<void> | void;
  lazy?: boolean;
  buttonProps?: ButtonProps;
}

export interface AppModalValues {
  isOpen: boolean;
  modalContent?: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeButtonVisible?: boolean;
  message?: string;
  header?: string;
  options?: AppModalOptions[];
  inputs?: AppModalInputs[];
  bodyComponent?: React.ReactNode;
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  canClose?: boolean;
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

export const openMasterKeyModal = (setAppModal, confirm, cancel) => {
  setAppModal({
    isOpen: true,
    header: 'Enter your Keypom password',
    message: 'This is used for security purpose. Do not share or lose your password.',
    inputs: [
      {
        placeholder: 'Password',
        valueKey: 'masterKey',
      },
    ],
    options: [
      {
        label: 'Cancel',
        func: () => {
          if (cancel) cancel();
        },
        buttonProps: {
          variant: 'outline',
        },
      },
      {
        label: 'Set Password',
        func: ({ masterKey }) => {
          console.log(masterKey);
          if (!masterKey || masterKey.length === 0) {
            alert('Master Key must be specified. Please try again.');
            if (cancel) cancel();
            return;
          }
          set('MASTER_KEY', masterKey);
          if (confirm) confirm();
        },
      },
    ],
  });
};
