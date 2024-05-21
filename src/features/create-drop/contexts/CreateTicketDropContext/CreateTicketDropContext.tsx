import type * as z from 'zod';

import {
  type AdditionalGiftSchema,
  type EventInfoSchema,
  type SignUpInfoSchema,
} from './FormValidation';

export type CreateTicketFieldsSchema = z.infer<
  typeof EventInfoSchema & typeof SignUpInfoSchema & typeof AdditionalGiftSchema
>;
