import { Box } from '@chakra-ui/react';

import { RoundedTabs, TabListItem } from '@/common/components/RoundedTabs';
import { LinkIcon } from '@/common/components/Icons';

const tabList: TabListItem[] = [
  {
    name: 'token',
    label: 'Token',
    icon: <LinkIcon />,
  },
  {
    name: 'poapNft',
    label: 'POAP NFT',
    icon: <LinkIcon />,
  },
];

export const AdditionalGiftsForm = () => {
  return (
    <Box mt={{ base: '6', md: '8' }}>
      <RoundedTabs tablist={tabList} />
    </Box>
  );
};
