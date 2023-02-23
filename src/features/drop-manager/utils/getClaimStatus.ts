import { type ProtocolReturnedKeyInfo } from 'keypom-js';

import { type TicketClaimStatus } from '../types/types';

export const getClaimStatus = (key: ProtocolReturnedKeyInfo | null): TicketClaimStatus => {
  if (!key) return 'Claimed';
  const { cur_key_use } = key;

  // cur_key_use is not zero indexed
  switch (cur_key_use) {
    case 1:
      return 'Unclaimed';
    case 2:
      return 'Viewed';
    case 3:
    default:
      return 'Attended';
  }
};
