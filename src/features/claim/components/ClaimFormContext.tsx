import { zodResolver } from '@hookform/resolvers/zod';
import { createContext, type PropsWithChildren, useContext, useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';

import keypomInstance from '@/lib/keypom';
import { useClaimParams } from '@/hooks/useClaimParams';

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
  claimError: string | null;
  isClaimInfoLoading: boolean;
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
  const [claimError, setClaimError] = useState<string | null>(null);
  const [remainingUses, setRemainingUses] = useState<number | null>(null);

  const methods = useForm<Schema>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
    },
    resolver: zodResolver(schema),
  });

  const loadClaimInfo = async () => {
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
      setClaimError('Unable to claim. This drop may have been claimed before.');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (secretKey === '' || contractId === '') {
      navigate('/');
    }
    // eslint-disable-next-line
    loadClaimInfo();
  }, []);

  const handleClaim = async () => {
    // Only allow claiming when there are 3 remaining uses
    if (remainingUses === 3) {
      await keypomInstance.claim(secretKey, 'foo');
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
        getClaimFormData,
        title,
        nftImage,
        qrValue,
        handleClaim,
        claimError,
        isClaimInfoLoading,
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
