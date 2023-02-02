import { zodResolver } from '@hookform/resolvers/zod';
import { createContext, type PropsWithChildren, useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as z from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Ticket holder name required'),
  email: z.string().email(),
});

type Schema = z.infer<typeof schema>;

interface ClaimFormContextType {
  getClaimFormData: () => string[];
}

const ClaimFormContext = createContext<ClaimFormContextType | null>(null);

export const ClaimFormContextProvider = ({ children }: PropsWithChildren) => {
  const methods = useForm<Schema>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
    },
    resolver: zodResolver(schema),
  });

  const getClaimFormData = (): string[] => {
    const { getValues } = methods;
    const [name, email] = getValues(['name', 'email']);

    return [name, email];
  };

  return (
    <ClaimFormContext.Provider value={{ getClaimFormData }}>
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
