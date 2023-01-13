import React, { createContext, PropsWithChildren, useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import useSWRMutation from 'swr/mutation';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { useSteps } from '@/common/hooks/useSteps';
import { StepItem } from '@/common/components/Step/Step';

import { PaymentData, SummaryItem } from '../types/types';

import { EventInfoForm } from './EventInfoForm';
import { SignUpInfoForm } from './SignUpInfoForm';
import { AdditionalGiftsForm } from './AdditionalGiftsForm/AdditionalGiftsForm';

interface FormStep extends StepItem {
  isSkipable: boolean;
  schema: typeof AdditionalGiftSchema | typeof EventInfoSchema | typeof SignUpInfoSchema;
}

export interface CreateTicketDropContextTypes {
  onNextStep: () => void;
  onPreviousStep: () => void;
  currentIndex: number;
  getSummaryData: () => SummaryItem[];
  getPaymentData: () => PaymentData;
  handleDropConfirmation: () => void;
  formSteps: FormStep[];
  createLinksSWR: {
    data: { success: boolean };
    handleDropConfirmation: () => void;
  };
}

const CreateTicketDropContext = createContext<CreateTicketDropContextTypes>(null);

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const EventInfoSchema = z.object({
  eventName: z.string().min(1, 'Event name required'),
  totalTickets: z
    .number({ invalid_type_error: 'Number of tickets required' })
    .positive()
    .min(1, 'Required'),
});

const SignUpInfoSchema = z.object({
  firstName: z.boolean().optional(),
  secondName: z.boolean().optional(),
  emailAddress: z.boolean().optional(),
});

const additionalGiftTokenSchema = z.object({
  selectedFromWallet: z
    .object({
      symbol: z.string(),
      amount: z.string(),
    })
    .nullable(),
  amountPerLink: z.number().or(z.string()).or(z.nan()),
});

const additionalGiftPOAPSchema = z.object({
  name: z.string(),
  description: z.string(),
  artwork: z.any(),
});

const AdditionalGiftSchema = z
  .object({
    additionalGift: z.object({
      type: z.enum(['none', 'poapNft', 'token']),
      token: additionalGiftTokenSchema.deepPartial(),
      poapNft: additionalGiftPOAPSchema.deepPartial(),
    }),
  })
  .superRefine(({ additionalGift }, ctx) => {
    if (additionalGift.type === 'token') {
      const token = additionalGift.token;
      if (!token.amountPerLink || !(token.amountPerLink > 0)) {
        ctx.addIssue({
          path: ['additionalGift.token.amountPerLink'],
          code: z.ZodIssueCode.custom,
          message: `Token amount is required and greater than 0.`,
          fatal: true,
        });
        return z.NEVER;
      }

      if (token.selectedFromWallet === null) {
        ctx.addIssue({
          path: ['additionalGift.token.selectedFromWallet'],
          code: z.ZodIssueCode.custom,
          message: `Wallet tokens is required.`,
        });
        return z.NEVER;
      }

      return true;
    } else if (additionalGift.type === 'poapNft') {
      const poapNft = additionalGift.poapNft;

      if (!poapNft.name || poapNft?.name?.length === 0) {
        ctx.addIssue({
          path: ['additionalGift.poapNft.name'],
          code: z.ZodIssueCode.custom,
          message: `POAP NFT name is required.`,
        });
      }

      if (!poapNft.description || poapNft?.description?.length === 0) {
        ctx.addIssue({
          path: ['additionalGift.poapNft.description'],
          code: z.ZodIssueCode.custom,
          message: `POAP NFT description is required.`,
        });
      }

      const artworkFiles = poapNft.artwork;
      if (artworkFiles?.length !== 1) {
        ctx.addIssue({
          path: ['additionalGift.poapNft.artwork'],
          code: z.ZodIssueCode.custom,
          message: `Image is required.`,
        });
        return z.NEVER;
      }

      if (artworkFiles?.[0]?.size > MAX_FILE_SIZE) {
        ctx.addIssue({
          path: ['additionalGift.poapNft.artwork'],
          code: z.ZodIssueCode.custom,
          message: `Max file size is 5MB.`,
        });
        return z.NEVER;
      }

      if (!ACCEPTED_IMAGE_TYPES.includes(artworkFiles?.[0]?.type)) {
        ctx.addIssue({
          path: ['additionalGift.poapNft.artwork'],
          code: z.ZodIssueCode.custom,
          message: `Only .jpg, .jpeg, .png and .webp files are accepted.`,
        });
        return z.NEVER;
      }
    }
    return true;
  });

export type CreateTicketFieldsSchema = z.infer<
  typeof EventInfoSchema & typeof SignUpInfoSchema & typeof AdditionalGiftSchema
>;

// TODO: this is only a mock implementation of the backend api
const createLinks = async () => {
  await new Promise((res) => setTimeout(res, 2000));
  return {
    success: true,
  };
};

const formSteps: FormStep[] = [
  {
    name: 'eventInfo',
    title: 'Event info',
    component: <EventInfoForm />,
    isSkipable: false,
    schema: EventInfoSchema,
  },
  {
    name: 'signUpInfo',
    title: 'Sign-up info',
    component: <SignUpInfoForm />,
    isSkipable: true,
    schema: SignUpInfoSchema,
  },
  {
    name: 'additionalGifts',
    title: 'Additional gifts',
    component: <AdditionalGiftsForm />,
    isSkipable: true,
    schema: AdditionalGiftSchema,
  },
];

/**
 *
 * Context for managing form state
 */
export const CreateTicketDropProvider = ({ children }: PropsWithChildren) => {
  const {
    onNext: onNextStep,
    onPrevious: onPreviousStep,
    currentIndex,
  } = useSteps({ maxSteps: formSteps.length });
  const { trigger, data } = useSWRMutation('/api/drops/tickets', createLinks);

  const methods = useForm<CreateTicketFieldsSchema>({
    mode: 'onChange',
    defaultValues: {
      eventName: '',
      totalTickets: null,
      firstName: false,
      secondName: false,
      emailAddress: false,
      additionalGift: {
        type: 'none',
        token: {
          selectedFromWallet: null,
          amountPerLink: '',
        },
        poapNft: { name: '', description: '', artwork: null },
      },
    },
    resolver: zodResolver(formSteps[currentIndex].schema),
  });

  const getSummaryData = (): SummaryItem[] => {
    // const { getValues } = methods;
    // const [eventName] = getValues(['eventName']);

    return [];
  };

  const getPaymentData = (): PaymentData => {
    return { costsData: [], totalCost: 0, confirmationText: '' };
  };

  const handleDropConfirmation = () => {
    // TODO: send transaction/request to backend
    trigger();
  };

  const createLinksSWR = {
    data,
    handleDropConfirmation,
  };

  return (
    <CreateTicketDropContext.Provider
      value={{
        getSummaryData,
        getPaymentData,
        handleDropConfirmation,
        createLinksSWR,
        onNextStep,
        onPreviousStep,
        currentIndex,
        formSteps,
      }}
    >
      <FormProvider {...methods}>{children}</FormProvider>
    </CreateTicketDropContext.Provider>
  );
};

export const useCreateTicketDropContext = () => useContext(CreateTicketDropContext);
