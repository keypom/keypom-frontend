import { Box, TabPanel, TabPanels } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';

import { RoundedTabs, TabListItem } from '@/common/components/RoundedTabs';
import { LinkIcon, POAPNftIcon } from '@/common/components/Icons';

import { CreateTicketFieldsSchema } from '../CreateTicketDropContext';

import { TokenForm } from './TokenForm';
import { POAPNftForm } from './POAPNftForm';

interface AdditionalGiftTabItem extends TabListItem {
  name: 'token' | 'poapNft';
}

const tabList: AdditionalGiftTabItem[] = [
  {
    name: 'token',
    label: 'Token',
    icon: <LinkIcon h={{ base: '5' }} w={{ base: '5' }} />,
  },
  {
    name: 'poapNft',
    label: 'POAP NFT',
    icon: <POAPNftIcon h={{ base: '7' }} w={{ base: '7' }} />,
  },
];

export const AdditionalGiftsForm = () => {
  const { setValue, formState, resetField } = useFormContext<CreateTicketFieldsSchema>();
  const { dirtyFields } = formState;

  useEffect(() => {
    if (dirtyFields.additionalGift?.token) {
      setValue('additionalGift.type', 'token', { shouldValidate: true });
    } else if (dirtyFields.additionalGift?.poapNft) {
      setValue('additionalGift.type', 'poapNft', { shouldValidate: true });
    } else {
      setValue('additionalGift.type', 'none', { shouldValidate: true });
    }
  }, [dirtyFields?.additionalGift, setValue]);

  const handleChange = () => {
    resetField('additionalGift');
  };

  return (
    <Box mt={{ base: '6', md: '8' }}>
      <RoundedTabs tablist={tabList} onChange={handleChange}>
        <TabPanels mt={{ base: '5', md: '7' }}>
          <TabPanel>
            <TokenForm />
          </TabPanel>
          <TabPanel>
            <POAPNftForm />
          </TabPanel>
        </TabPanels>
      </RoundedTabs>
    </Box>
  );
};
