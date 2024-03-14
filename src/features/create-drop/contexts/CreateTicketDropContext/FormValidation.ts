import * as z from 'zod';

import { MAX_FILE_SIZE } from '@/constants/common';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const EventDateSchema = z
  .object({
    startDate: z.date(),
    endDate: z.date(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: 'End date must be after the start date.',
    path: ['endDate'], // this indicates which field the error should be associated with
  });

export const EventInfoSchema = z.object({
  eventName: z.string().min(1, 'Event name required'),
  eventDescription: z.string().optional(),
  eventLocation: z.string().optional(),
  date: EventDateSchema, // Use the nested schema
  eventArtwork: z.string().min(1, 'Event artwork required'),
});

export const SignUpInfoSchema = z.object({
  firstName: z.boolean().optional(),
  secondName: z.boolean().optional(),
  emailAddress: z.boolean().optional(),
});

const additionalGiftTokenSchema = z.object({
  selectedToken: z
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

export const AdditionalGiftSchema = z
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
      let amount = token?.amountPerLink;
      if (!amount) amount = 0;
      if (typeof amount === 'string') amount = parseInt(amount);

      if (amount <= 0) {
        ctx.addIssue({
          path: ['additionalGift.token.amountPerLink'],
          code: z.ZodIssueCode.custom,
          message: `Token amount is required and greater than 0.`,
          fatal: true,
        });
        return z.NEVER;
      }

      if (token.selectedToken === null) {
        ctx.addIssue({
          path: ['additionalGift.token.selectedToken'],
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
          message: `Max file size is 10MB.`,
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
