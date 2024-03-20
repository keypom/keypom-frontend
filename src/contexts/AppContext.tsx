import { createContext, type PropsWithChildren, useContext, useState, useEffect } from 'react';
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
  nearPrice?: number;
  setNearPrice: (price: number) => void;
}

const AppContext = createContext<AppContextValues | null>(null);

// Define outside and separate from AppContextProvider
const useFetchNearPrice = (setNearPrice) => {
  useEffect(() => {
    const fetchPrice = async (url, parseData) => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        return parseData(data);
      } catch (error) {
        console.error('Fetch error:', error);
        return null;
      }
    };

    const setPriceWithFallback = async () => {
      const coingeckoPrice = await fetchPrice(
        'https://api.coingecko.com/api/v3/simple/price?ids=near&vs_currencies=usd',
        (data) => data.near.usd,
      );

      if (coingeckoPrice !== null) {
        setNearPrice(coingeckoPrice);
        return;
      }

      const binancePrice = await fetchPrice(
        'https://api.binance.com/api/v3/ticker/price?symbol=NEARUSDT',
        (data) => data.price,
      );

      if (binancePrice !== null) {
        setNearPrice(parseFloat(binancePrice));
      }
    };

    setPriceWithFallback();
  }, [setNearPrice]); // Include setNearPrice in the dependency array if it could change, though typically it wouldn't.
};

export const AppContextProvider = ({ children }: PropsWithChildren) => {
  console.log('AppContextProvider');
  const [appModal, setAppModal] = useState<AppModalValues>({
    isOpen: false,
  });
  const [nearPrice, setNearPrice] = useState<number>();

  const value = {
    appModal,
    setAppModal,
    nearPrice,
    setNearPrice,
  };

  useFetchNearPrice(setNearPrice); // Invoke the custom hook here

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
