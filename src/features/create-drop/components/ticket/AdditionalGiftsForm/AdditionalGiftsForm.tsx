import { Box, TabPanel, TabPanels } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';

import { RoundedTabs, type TabListItem } from '@/components/RoundedTabs';
import { POAPNftIcon } from '@/components/Icons';
import { type CreateTicketFieldsSchema } from '@/features/create-drop/contexts/CreateTicketDropContext/CreateTicketDropContext';

import { POAPNftForm } from './POAPNftForm';

interface AdditionalGiftTabItem extends TabListItem {
  name: 'token' | 'poapNft';
}

const TAB_LIST: AdditionalGiftTabItem[] = [
  /** token is commented in case there's a need for it in the future */
  // {
  //   name: 'token',
  //   label: 'Token',
  //   icon: <LinkIcon h={{ base: '4', md: '5' }} w={{ base: '4', md: '5' }} />,
  // },
  {
    name: 'poapNft',
    label: 'POAP NFT',
    icon: <POAPNftIcon h={{ base: '6', md: '7' }} w={{ base: '6', md: '7' }} />,
  },
];

export const AdditionalGiftsForm = () => {
  const { setValue, formState, resetField } = useFormContext<CreateTicketFieldsSchema>();
  const { dirtyFields } = formState;

  useEffect(() => {
    if (dirtyFields.additionalGift?.poapNft !== null) {
      setValue('additionalGift.type', 'poapNft', { shouldValidate: true });
    } else if (dirtyFields.additionalGift?.token !== null) {
      setValue('additionalGift.type', 'token', { shouldValidate: true });
    } else {
      setValue('additionalGift.type', 'none', { shouldValidate: true });
    }
  }, [dirtyFields?.additionalGift, setValue]);

  const handleChange = () => {
    resetField('additionalGift');
  };

  return (
    <Box mt={{ base: '6', md: '8' }}>
      <RoundedTabs tablist={TAB_LIST} onChange={handleChange}>
        <TabPanels mt={{ base: '5', md: '7' }}>
          {/* <TabPanel px="0">
            <TokenForm />
          </TabPanel> */}
          <TabPanel>
            <POAPNftForm />
          </TabPanel>
        </TabPanels>
      </RoundedTabs>
    </Box>
  );
};
