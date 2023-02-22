import { type ProtocolReturnedKeyInfo } from 'keypom-js';

import { type TicketClaimStatus } from '../types/types';

export const getClaimStatus = (key: ProtocolReturnedKeyInfo | null): TicketClaimStatus => {
  if (!key) return 'Claimed';
  const { cur_key_use } = key;

  switch (cur_key_use) {
    case 0:
      return 'Unclaimed';
    case 1:
      return 'Viewed';
    case 2:
    default:
      return 'Attended';
  }
};
