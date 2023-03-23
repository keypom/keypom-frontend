import { Badge } from '@chakra-ui/react';

export const getBadgeType = (currentKeyUse: number): React.ReactNode => {
  if (!currentKeyUse) return <Badge variant="lightgreen">Claimed</Badge>;
  switch (currentKeyUse) {
    case 2:
      return <Badge variant="blue">Viewed</Badge>;
    case 3:
      return <Badge variant="pink">Attended</Badge>;
    case 1:
    default:
      return <Badge variant="gray">Unclaimed</Badge>;
  }
};
