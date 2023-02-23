import { type DataItem } from '@/components/Table/types';

import { type TicketClaimStatus } from '../types/types';

export const INITIAL_SAMPLE_DATA: DataItem[] = [
  {
    id: 1,
    link: 'https://example.com',
    slug: 'https://example.com',
    hasClaimed: false,
    action: 'delete',
  },
  {
    id: 2,
    link: 'https://example.com',
    slug: 'https://example.com',
    hasClaimed: 'Viewed' as TicketClaimStatus,
    action: 'delete',
  },
];
