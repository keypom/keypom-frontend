import { zodResolver } from '@hookform/resolvers/zod';
import { createContext, type PropsWithChildren, useContext, useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as z from 'zod';
import { useNavigate, useParams } from 'react-router-dom';

import keypomInstance from '@/lib/keypom';

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
}

const ClaimFormContext = createContext<ClaimFormContextType | null>(null);

export const ClaimFormContextProvider = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const { secretKey = '', contractId = '' } = useParams();

  const [title, setTitle] = useState('');
  const [nftImage, setNftImage] = useState('');
  const [qrValue, setQrValue] = useState('');
  const methods = useForm<Schema>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
    },
    resolver: zodResolver(schema),
  });

  const loadClaimInfo = async () => {
    const nftData = await keypomInstance.getTicketNftInformation(secretKey);

    setTitle(nftData.title);
    setNftImage(nftData.media);
    setQrValue(JSON.stringify({ contractId, secretKey }));
  };

  useEffect(() => {
    if (secretKey === '' || contractId === '') {
      navigate('/');
    }
    // eslint-disable-next-line
    loadClaimInfo();
  }, []);

  const handleClaim = async () => {
    await keypomInstance.claim(secretKey);
  };

  const getClaimFormData = (): string[] => {
    const { getValues } = methods;
    const [name, email] = getValues(['name', 'email']);

    return [name, email];
  };

  return (
    <ClaimFormContext.Provider value={{ getClaimFormData, title, nftImage, qrValue, handleClaim }}>
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
