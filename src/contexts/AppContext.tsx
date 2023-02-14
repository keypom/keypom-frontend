import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';


interface AppModalInputs {
  placeholder: string;
  valueKey: string;
}

interface AppModalOptions {
  label: string;
  func: any;
}

interface AppModalValues {
  isOpen: boolean;
  message?: string;
  header?: string;
  options?: AppModalOptions[]
  inputs?: AppModalInputs[]
}

interface AppContextValues {
  appModal: AppModalValues;
  setAppModalOpen: any;
}

const AppContext = createContext<AppContextValues | null>(null);

export const AppContextProvider = ({ children }: PropsWithChildren) => {
  const [appModal, setAppModal] = useState<AppModalValues>({
    isOpen: false
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
