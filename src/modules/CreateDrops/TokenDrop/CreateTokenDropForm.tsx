import { Box, HStack, Input } from '@chakra-ui/react';
import { useState } from 'react';

import { IconBox } from '@/common/components/IconBox';
import { HereLogoIcon, LinkIcon, MyNearLogoIcon, NearLogoIcon } from '@/common/components/Icons';
import { FormControl } from '@/common/components/FormControl';
import { Text } from '@/common/components/Typography';
import { Checkboxes, ICheckbox } from '@/common/components/Checkboxes';

const WALLET_OPTIONS: ICheckbox[] = [
  {
    name: 'NEAR Wallet',
    value: 'near_wallet',
    icon: <NearLogoIcon height="7" width="5" />,
  },
  {
    name: 'My NEAR Wallet',
    value: 'my_near_wallet',
    icon: <MyNearLogoIcon height="6" width="5" />,
  },
  {
    name: 'HERE Wallet',
    value: 'here_wallet',
    icon: <HereLogoIcon height="7" width="5" />,
  },
];

export const CreateTokenDropForm = () => {
  const [checkboxes, setCheckboxes] = useState({
    near_wallet: true,
    my_near_wallet: false,
    here_wallet: false,
  });

  const handleCheckboxChange = (value: string, isChecked: boolean) => {
    setCheckboxes({ ...checkboxes, [value]: isChecked });
  };

  return (
    <IconBox icon={<LinkIcon />} maxW={{ base: '21.5rem', md: '36rem' }}>
      <Box>
        <FormControl helperText="Will be shown on the claim page" label="Token Drop name">
          <Input placeholder="Star Invasion Beta Invites" type="text" />
        </FormControl>

        <FormControl label="Number of links">
          <Input placeholder="1 - 10,000" type="number" />
        </FormControl>

        <FormControl label="Amount per link">
          <Input placeholder="Enter an amount" type="number" />
          <HStack mt="1.5" spacing="auto">
            <Text color="gray.400" fontSize="sm">
              Total cost 50 NEAR
            </Text>
            <Text color="gray.400" fontSize="sm">
              Balance: 500 NEAR
            </Text>
          </HStack>
        </FormControl>

        <FormControl helperText="Choose which wallet to set people up with." label="Wallets">
          <Checkboxes items={WALLET_OPTIONS} values={checkboxes} onChange={handleCheckboxChange} />
        </FormControl>

        <FormControl
          helperText="Where should the user be sent after signing up?"
          label="Redirect link (optional)"
        >
          <Input placeholder="mark@hotmail.com" type="number" />
        </FormControl>
      </Box>
    </IconBox>
  );
};
