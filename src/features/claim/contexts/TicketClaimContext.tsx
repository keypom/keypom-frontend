import {
  createContext,
  type PropsWithChildren,
  useContext,
  useState,
  useEffect,
  lazy,
} from 'react';
import { useNavigate } from 'react-router-dom';

import keypomInstance from '@/lib/keypom';
import { useClaimParams } from '@/hooks/useClaimParams';
import { DROP_TYPE, type DROP_TYPES } from '@/constants/common';
import getConfig from '@/config/config';
import { type TokenAsset } from '@/types/common';

const TicketQRPage = lazy(
  async () =>
    await import('@/features/claim/components/ticket/TicketQRPage').then((mod) => ({
      default: mod.TicketQRPage,
    })),
);

const TicketGiftPage = lazy(
  async () => await import('@/features/claim/components/ticket/TicketGiftPage'),
);

const TICKET_FLOW_KEY_USE = {
  1: TicketQRPage,
  2: TicketQRPage,
  3: TicketGiftPage,
};

interface ITicketQuestion {
  text: string;
  type: 'TEXT' | 'RADIO';
}

export interface TicketClaimContextTypes {
  getDropMetadata: () => {
    dropId: string;
    title: string;
    description: string;
    nftImage: string;
    tokens: TokenAsset[];
    giftType: DROP_TYPES;
    wallets: string[];
    questions: ITicketQuestion[];
  };
  currentPage: (() => JSX.Element | null) | undefined;
  qrValue: string;
  handleClaim: () => Promise<void>;
  isClaimInfoLoading: boolean;
  claimInfoError: string | null;
  claimError: string | null;
}

const TicketClaimContext = createContext<TicketClaimContextTypes | null>(null);
// TODO: check if drop has been claimed
/**
 *
 * Context to manage whole ticket claim flow for each key uses
 */
export const TicketClaimContextProvider = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const { secretKey, contractId } = useClaimParams();

  // Drop metadata
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [nftImage, setNftImage] = useState('');
  const [wallets, setWallets] = useState([getConfig().defaultWallet.name]);

  // QR code
  const [qrValue, setQrValue] = useState('');

  // Claim info states
  const [currentPage, setCurrentPage] = useState<() => JSX.Element | null>();
  const [isClaimInfoLoading, setIsLoading] = useState(true);
  const [claimInfoError, setClaimInfoError] = useState<string | null>(null);
  const [claimError, setClaimError] = useState(null);

  const [currentKeyUse, setCurrentKeyUse] = useState<number | null>(null);
  const [dropId, setDropId] = useState<string>('');
  const [tokens, setTokens] = useState<TokenAsset[]>([]);
  const [giftType, setGiftType] = useState<DROP_TYPES>(DROP_TYPE.NFT);
  const [questions, setQuestions] = useState<ITicketQuestion[]>([]);

  const loadTokenClaimInfo = async () => {
    try {
      const { ftMetadata, amountNEAR, amountTokens, dropId } =
        await keypomInstance.getTokenClaimInformation(contractId, secretKey);
      const tokens: TokenAsset[] = [
        {
          icon: 'https://cryptologos.cc/logos/near-protocol-near-logo.svg?v=024',
          value: amountNEAR || '0',
          symbol: 'NEAR',
        },
      ];
      setTokens({
        ...tokens,
        ...(ftMetadata
          ? {
              icon: ftMetadata.icon as string,
              value: amountTokens ?? '0',
              symbol: ftMetadata.symbol,
            }
          : {}),
      });
      setGiftType(DROP_TYPE.TOKEN);
      setDropId(dropId);
    } catch (err) {
      setClaimInfoError(err.message);
    }
  };

  const loadNFTClaimInfo = async () => {
    const claimInfo = await keypomInstance.getTicketNftInformation(contractId, secretKey);

    setDropId(claimInfo.dropId);
    setTitle(claimInfo.title);
    setDescription(claimInfo.description);
    setNftImage(claimInfo.media);
    setQrValue(JSON.stringify({ contractId, secretKey }));
    setWallets(claimInfo.wallets);
    setQuestions(claimInfo.questions);
  };

  const loadTicketClaimInfo = async () => {
    // determine if ticket has NFT series else defer to show token as reward
    setIsLoading(true);

    try {
      await loadNFTClaimInfo();
    } catch (err) {
      if (err.message === 'NFT series not found') {
        // show tokens instead
        await loadTokenClaimInfo();
      } else {
        console.error(err.message);
        setClaimInfoError(err.message);
      }
    }

    setIsLoading(false);
  };

  const showCurrentPage = async () => {
    if (claimInfoError) {
      // if key has been deleted or has errors, we show the error in main page
      return;
    }

    const _currentKeyUse = await keypomInstance.getCurrentKeyUse(contractId, secretKey);
    setCurrentPage(TICKET_FLOW_KEY_USE[_currentKeyUse]);
    setCurrentKeyUse(_currentKeyUse);
  };

  useEffect(() => {
    if (secretKey === '' || contractId === '') {
      navigate('/');
    }
    // eslint-disable-next-line
    loadTicketClaimInfo().then(async () => {
      await showCurrentPage();
    });
  }, []);

  const getDropMetadata = () => {
    return {
      dropId,
      title,
      description,
      nftImage,
      tokens,
      giftType,
      wallets,
      questions,
    };
  };

  const handleClaim = async () => {
    // Only allow claiming when there are 3 remaining uses
    if (currentKeyUse === 1) {
      try {
        await keypomInstance.claim(secretKey, 'foo', true);
      } catch (err) {
        setClaimError(err);
      }
    }
  };

  return (
    <TicketClaimContext.Provider
      value={{
        getDropMetadata,
        qrValue,
        handleClaim,
        isClaimInfoLoading,
        claimInfoError,
        claimError,
        currentPage,
      }}
    >
      {children}
    </TicketClaimContext.Provider>
  );
};

export const useTicketClaim = (): TicketClaimContextTypes => {
  const context = useContext(TicketClaimContext);

  if (context === null) {
    throw new Error('useTicketClaim must be used within a TicketClaimContextProvider');
  }

  return context;
};
