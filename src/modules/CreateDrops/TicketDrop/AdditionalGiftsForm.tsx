import { Box, TabPanel, TabPanels } from '@chakra-ui/react';
import { Controller, useFormContext } from 'react-hook-form';
import { useMemo } from 'react';

import { RoundedTabs, TabListItem } from '@/common/components/RoundedTabs';
import { LinkIcon } from '@/common/components/Icons';
import { WalletBalanceInput } from '@/common/components/WalletBalanceInput';
import { FormControl } from '@/common/components/FormControl';

import { WALLET_TOKENS } from './data';

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
      <RoundedTabs tablist={tabList}>
        <TabPanels>
          <TabPanel>
            <TokenForm />
          </TabPanel>
          <TabPanel>2</TabPanel>
        </TabPanels>
      </RoundedTabs>
    </Box>
  );
};

const TokenForm = () => {
  const {
    setValue,
    handleSubmit,
    control,
    watch,
    formState: { isDirty, isValid },
  } = useFormContext();

  const [selectedFromWallet, amountPerLink, totalLinks] = watch([
    'selectedFromWallet',
    'amountPerLink',
    'totalLinks',
  ]);
  const totalCost = useMemo(() => {
    if (totalLinks && amountPerLink) {
      return totalLinks * amountPerLink;
    }
    return 0;
  }, [amountPerLink, totalLinks]);

  const handleWalletChange = (walletSymbol: string) => {
    const { symbol, amount } = WALLET_TOKENS.find((wallet) => wallet.symbol === walletSymbol);
    setValue('selectedFromWallet', { symbol, amount });
  };

  return (
    <Controller
      control={control}
      name="amountPerLink"
      render={({ field, fieldState: { error } }) => (
        <FormControl errorText={error?.message} label="Amount per link">
          <WalletBalanceInput
            {...field}
            isInvalid={Boolean(error?.message)}
            onChange={(e) => field.onChange(parseFloat(e.target.value), 10)}
          >
            <WalletBalanceInput.TokenMenu
              selectedWalletToken={selectedFromWallet}
              tokens={WALLET_TOKENS}
              onChange={handleWalletChange}
            />
            <WalletBalanceInput.CostDisplay
              balanceAmount={selectedFromWallet.amount}
              symbol={selectedFromWallet.symbol}
              totalCost={totalCost}
            />
          </WalletBalanceInput>
        </FormControl>
      )}
    />
  );
};
