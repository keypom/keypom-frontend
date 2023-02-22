import { Badge } from '@chakra-ui/react';

import { type TicketClaimStatus } from '../types/types';

export const getBadgeType = (status: TicketClaimStatus): React.ReactNode => {
  switch (status) {
    case 'Unclaimed':
      return <Badge variant="gray">Unclaimed</Badge>;
    case 'Viewed':
      return <Badge variant="blue">Viewed</Badge>;
    case 'Attended':
      return <Badge variant="pink">Attended</Badge>;
    case 'Claimed':
    default:
      return <Badge variant="lightgreen">Claimed</Badge>;
  }
};
