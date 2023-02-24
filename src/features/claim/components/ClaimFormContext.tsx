import { zodResolver } from '@hookform/resolvers/zod';
import { createContext, type PropsWithChildren, useContext, useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';

import keypomInstance from '@/lib/keypom';
import { useClaimParams } from '@/hooks/useClaimParams';
import { DROP_TYPE } from '@/constants/common';

import { type TokenAsset } from '../routes/TokenClaimPage';

const schema = z.object({
  name: z.string().min(1, 'Ticket holder name required'),
  email: z.string().email(),
});

type Schema = z.infer<typeof schema>;

interface ClaimFormContextType {
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

const ClaimFormContext = createContext<ClaimFormContextType | null>(null);

// TODO: refactor this context name
export const ClaimFormContextProvider = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const { secretKey, contractId } = useClaimParams();

  const [title, setTitle] = useState('');
  const [nftImage, setNftImage] = useState('');
  const [qrValue, setQrValue] = useState('');
  const [isClaimInfoLoading, setIsLoading] = useState(true);
  const [claimInfoError, setClaimInfoError] = useState<string | null>(null);
  const [remainingUses, setRemainingUses] = useState<number | null>(null);
  const [showTokenDrop, setShowTokenDrop] = useState(false);
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
      if (ftMetadata) {
        setTokens([
          ...tokens,
          {
            icon: ftMetadata.icon as string,
            value: amountTokens ?? '0',
            symbol: ftMetadata.symbol,
          },
        ]);
      }

      setTokens(tokens);
    } catch (err) {
      setClaimInfoError(err.message);
    }
  };

  const loadNFTClaimInfo = async () => {
    setIsLoading(true);
    try {
      const claimInfo = await keypomInstance.getTicketNftInformation(contractId, secretKey);

      if (claimInfo.remainingUses === 1) {
        navigate(`/claim/gift/${contractId}#${secretKey}`);
        return;
      }

      setTitle(claimInfo.title);
      setNftImage(claimInfo.media);
      setQrValue(JSON.stringify({ contractId, secretKey }));
      setRemainingUses(claimInfo.remainingUses);
    } catch (err) {
      if (err.message === 'NFT series not found') {
        // show tokens instead
        setShowTokenDrop(true);
        setGiftType(DROP_TYPE.TOKEN);
        await loadTokenClaimInfo();
        setIsLoading(false);
        return;
      }

      setClaimInfoError(err.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (secretKey === '' || contractId === '') {
      navigate('/');
    }
    // eslint-disable-next-line
    loadNFTClaimInfo();
  }, []);

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
    <ClaimFormContext.Provider
      value={{
        showTokenDrop,
        getClaimFormData,
        title,
        nftImage,
        qrValue,
        handleClaim,
        isClaimInfoLoading,
        tokens,
        giftType,
        claimInfoError,
      }}
    >
      <FormProvider {...methods}>{children}</FormProvider>
    </ClaimFormContext.Provider>
  );
};

export const useClaimForm = (): ClaimFormContextType => {
  const context = useContext(ClaimFormContext);

  if (context === null) {
    throw new Error('useClaimForm must be used within a ClaimFormContextProvider');
  }

  return context;
};
