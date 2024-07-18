import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { getPubFromSecret } from 'keypom-js';

import keypomInstance from '@/lib/keypom';
import {
  type TicketInfoMetadata,
  type TicketMetadataExtra,
  type FunderEventMetadata,
  type EventDrop,
} from '@/lib/eventsHelpers';
import { ProfileIcon } from '@/components/Icons/ProfileIcon';
import { WalletIcon } from '@/components/Icons/WalletIcon';
import { FooterCalendarIcon } from '@/components/Icons/FooterCalendarIcon';
import { MessageIcon } from '@/components/Icons/MessageIcon';
import ProfilePage from '@/features/conference-app/ProfilePage';
import AgendaPage from '@/features/conference-app/AgendaPage';
import ScanningPage from '@/features/conference-app/ScanningPage';
import AssetsPageManager from '@/features/conference-app/AssetsPages/AssetsPageManager';
import { CameraIcon } from '@/components/Icons/CameraIcon';

export const conferenceFooterMenuItems = [
  {
    label: 'Agenda',
    icon: FooterCalendarIcon,
    path: '/conference/app/agenda',
    locked: false,
    component: AgendaPage,
  },
  {
    label: 'Scan',
    icon: CameraIcon,
    path: '/conference/app/scan',
    locked: false,
    component: ScanningPage,
  },
  {
    label: 'Assets',
    icon: WalletIcon,
    path: '/conference/app/assets',
    locked: false,
    component: AssetsPageManager,
  },
  {
    label: 'Profile',
    icon: ProfileIcon,
    path: '/conference/app/profile',
    locked: false,
    component: ProfilePage,
  },
];

export const conferenceFooterMenuIndexes = {
  profile: 3,
  assets: 2,
  agenda: 0,
  scan: 1,
};

interface ConferenceContextProps {
  eventInfo: FunderEventMetadata;
  ticketInfo: TicketInfoMetadata;
  ticketInfoExtra: TicketMetadataExtra;
  dropInfo: EventDrop;
  isLoading: boolean;
  eventId: string;
  funderId: string;
  ticker: string;
  secretKey: string;
  factoryAccount: string;
  accountId: string;
  tokensAvailable: string;
  setTriggerRefetch: Dispatch<SetStateAction<number>>;
  triggerRefetch: number;
  selectedTab: number;
  queryString: URLSearchParams;
  onSelectTab: (tab: number, subtab?: string) => void;
}

const ConferenceContext = createContext<ConferenceContextProps | undefined>(undefined);

export const ConferenceProvider = ({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: Omit<
    ConferenceContextProps,
    | 'accountId'
    | 'tokensAvailable'
    | 'setTriggerRefetch'
    | 'triggerRefetch'
    | 'queryString'
    | 'selectedTab'
    | 'onSelectTab'
  >;
}) => {
  const [accountId, setAccountId] = useState<string>('');
  const [tokensAvailable, setTokensAvailable] = useState<string>('0');
  const [triggerRefetch, setTriggerRefetch] = useState<number>(0);

  const path = location.pathname.split('/').pop() || 'profile';
  const query = new URLSearchParams(location.search);
  const [queryString, setQueryString] = useState<URLSearchParams>(query);

  const initialTab = conferenceFooterMenuItems.findIndex((item) => item.path.includes(path));
  const [selectedTab, setSelectedTab] = useState<number>(
    initialTab !== -1 ? initialTab : conferenceFooterMenuIndexes.profile,
  ); // Initialized to profile
  const { dropInfo, factoryAccount, isLoading, secretKey } = initialData;

  const onSelectTab = (tab: number, subtab?: string) => {
    if (subtab) {
      const urlParams = new URLSearchParams(queryString);
      urlParams.set('tab', subtab);
      setQueryString(urlParams);
    } else {
      setQueryString(new URLSearchParams());
    }
    setSelectedTab(tab);
  };

  useEffect(() => {
    const recoverAccount = async () => {
      if (!isLoading && dropInfo.drop_id !== 'loading' && factoryAccount.length !== 0) {
        console.log('Secret Key: ', secretKey);
        console.log('Factory Account: ', factoryAccount);
        const recoveredAccountId = await keypomInstance.viewCall({
          contractId: factoryAccount,
          methodName: 'recover_account',
          args: { key: getPubFromSecret(secretKey) },
        });
        const balance = await keypomInstance.viewCall({
          contractId: factoryAccount,
          methodName: 'ft_balance_of',
          args: { account_id: recoveredAccountId },
        });
        console.log('recovered account id: ', recoveredAccountId);
        console.log('balance: ', balance);
        setTokensAvailable(keypomInstance.yoctoToNearWith4Decimals(balance));
        setAccountId(recoveredAccountId);
      }
    };
    recoverAccount();
  }, [dropInfo, factoryAccount, isLoading, secretKey, triggerRefetch, selectedTab]);

  return (
    <ConferenceContext.Provider
      value={{
        ...initialData,
        accountId,
        tokensAvailable,
        setTriggerRefetch,
        triggerRefetch,
        queryString,
        selectedTab,
        onSelectTab,
      }}
    >
      {children}
    </ConferenceContext.Provider>
  );
};

export const useConferenceContext = () => {
  const context = useContext(ConferenceContext);
  if (!context) {
    throw new Error('useConferenceContext must be used within a ConferenceProvider');
  }
  return context;
};
