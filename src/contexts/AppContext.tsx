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
  fetchAttempts: number;
  setAppModal: (args: AppModalValues) => void;
  setTriggerPriceFetch: (trigger: boolean) => void;
  nearPrice?: number;
  setNearPrice: (price: number) => void;
}

const AppContext = createContext<AppContextValues | null>(null);

const fetchPrice = async (url, parseData) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return parseData(data);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Fetch error:', error);
    return null;
  }
};

export const AppContextProvider = ({ children }: PropsWithChildren) => {
  const [appModal, setAppModal] = useState<AppModalValues>({
    isOpen: false,
  });
  const [nearPrice, setNearPrice] = useState<number>();
  const [fetchAttempts, setFetchAttempts] = useState<number>(0);
  const [triggerPriceFetch, setTriggerPriceFetch] = useState<boolean>(true);

  useEffect(() => {
    const setPriceWithFallback = async () => {
      const binancePrice = await fetchPrice(
        'https://api.binance.com/api/v3/ticker/price?symbol=NEARUSDT',
        (data) => data.price,
      );

      if (binancePrice !== null) {
        setNearPrice(parseFloat(binancePrice));
      }

      const coinbasePrice = await fetchPrice(
        'https://api.coinbase.com/v2/prices/NEAR-USD/buy',
        (data) => data.data.amount,
      );

      if (coinbasePrice !== null) {
        setNearPrice(parseFloat(coinbasePrice));
      }

      const coinapiPrice = await fetchPrice(
        'https://rest.coinapi.io/v1/exchangerate/NEAR/USDC?apiKey=30634AC5-CF0B-4045-BE02-BAF8A3C1B4EC',
        (data) => data.rate,
      );

      if (coinapiPrice !== null) {
        setNearPrice(parseFloat(coinapiPrice));
      }

      const coinlorePrice = await fetchPrice(
        'https://api.coinlore.net/api/ticker/?id=48563',
        (data) => data[0].price_usd,
      );

      if (coinlorePrice !== null) {
        setNearPrice(parseFloat(coinlorePrice));
      }

      // const coingeckoPrice = await fetchPrice(
      //   'https://api.coingecko.com/api/v3/simple/price?ids=near&vs_currencies=usd',
      //   (data) => data.near.usd,
      // );
      
      // if (coingeckoPrice !== null) {
      //   setNearPrice(coingeckoPrice);
      //   return;
      // }
    };

    if (triggerPriceFetch) {
      setFetchAttempts(fetchAttempts + 1);
      setTriggerPriceFetch(false);
      setPriceWithFallback();
    }
  }, [triggerPriceFetch]);

  const value = {
    appModal,
    setAppModal,
    fetchAttempts,
    nearPrice,
    setTriggerPriceFetch,
    setNearPrice,
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
