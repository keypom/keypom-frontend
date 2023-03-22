import { zodResolver } from '@hookform/resolvers/zod';
import { createContext, type PropsWithChildren, useContext, useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';

import keypomInstance from '@/lib/keypom';
import { useClaimParams } from '@/hooks/useClaimParams';
import { DROP_TYPE } from '@/constants/common';

import { type TokenAsset } from '../routes/TokenClaimPage';
import { TicketClaimQRPage } from '../components/ticket2/TicketClaimQRPage';
import TicketGiftClaimPage from '../routes/TicketGiftClaimPage';

const TICKET_FLOW_KEY_USE = {
  1: TicketClaimQRPage,
  // 2: scanner page claim
  3: TicketGiftClaimPage,
};

const schema = z.object({
  name: z.string().min(1, 'Ticket holder name required'),
  email: z.string().email(),
});

type Schema = z.infer<typeof schema>;

interface TicketClaimContextTypes {
  getClaimFormData: () => string[];
  title: string;
  nftImage: string;
  qrValue: string;
  handleClaim: () => Promise<void>;
  isClaimInfoLoading: boolean;
  showTokenDrop: boolean;
  tokens: TokenAsset[];
  giftType: string;
  claimInfoError: string | null;
}

const TicketClaimContext = createContext<TicketClaimContextTypes | null>(null);

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

  // QR code
  const [qrValue, setQrValue] = useState('');

  // Claim info states
  const [currentPage, setCurrentPage] = useState<() => JSX.Element | undefined>();
  const [isClaimInfoLoading, setIsLoading] = useState(true);
  const [claimInfoError, setClaimInfoError] = useState<string | null>(null);

  const [currentKeyUse, setCurrentKeyUse] = useState<number | null>(null);
  const [tokens, setTokens] = useState<TokenAsset[]>([]);
  const [giftType, setGiftType] = useState(DROP_TYPE.NFT);

  const methods = useForm<Schema>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
    },
    resolver: zodResolver(schema),
  });

  const loadTokenClaimInfo = async () => {
    try {
      const { ftMetadata, amountNEAR, amountTokens } =
        await keypomInstance.getTokenClaimInformation(contractId, secretKey, true);
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
    } catch (err) {
      setClaimInfoError(err.message);
    }
  };

  const loadNFTClaimInfo = async () => {
    const claimInfo = await keypomInstance.getTicketNftInformation(contractId, secretKey);

    setTitle(claimInfo.title);
    setDescription(claimInfo.description);
    setNftImage(claimInfo.media);
    setQrValue(JSON.stringify({ contractId, secretKey }));
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
    loadTicketClaimInfo().then(() => showCurrentPage());
  }, []);

  const getDropMetadata = () => {
    return {
      title,
      description,
      nftImage,
      tokens,
      giftType,
    };
  };

  const handleClaim = async () => {
    // Only allow claiming when there are 3 remaining uses
    if (remainingUses === 3) {
      await keypomInstance.claim(secretKey, 'foo', true);
    }
  };

  const getClaimFormData = (): string[] => {
    const { getValues } = methods;
    const [name, email] = getValues(['name', 'email']);

    return [name, email];
  };

  return (
    <TicketClaimContext.Provider
      value={{
        getDropMetadata
        getClaimFormData,
        qrValue,
        handleClaim,
        isClaimInfoLoading,
        claimInfoError,
        currentPage,
      }}
    >
      <FormProvider {...methods}>{children}</FormProvider>
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
