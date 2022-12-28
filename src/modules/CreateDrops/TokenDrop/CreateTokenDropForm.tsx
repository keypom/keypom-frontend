import { Box, Input } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { IconBox } from '@/common/components/IconBox';
import { HereLogoIcon, LinkIcon, MyNearLogoIcon, NearLogoIcon } from '@/common/components/Icons';
import { FormControl } from '@/common/components/FormControl';
import { Checkboxes, ICheckbox } from '@/common/components/Checkboxes';
import { WalletBalanceInput } from '@/common/components/WalletBalanceInput';

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

const TOKEN_BALANCES = [
  {
    amount: 500,
    symbol: 'NEAR',
    icon: <NearLogoIcon height="4" width="4" />,
  },
  {
    amount: 1000,
    symbol: 'USDC',
    icon: <MyNearLogoIcon height="5" width="5" />,
  },
  {
    amount: 10,
    symbol: 'ETH',
    icon: <HereLogoIcon height="4" width="4" />,
  },
];

export const CreateTokenDropForm = () => {
  const methods = useForm({
    defaultValues: {
      dropName: '',
      selectedFromWallet: TOKEN_BALANCES[0],
      selectedToWallets: [],
      totalLinks: undefined,
      amountPerLink: undefined,
      redirectLink: '',
    },
  });
  const { register, setValue, getValues } = methods;
  const [totalCost, setTotalCost] = useState(0);

  const { selectedFromWallet, amountPerLink, totalLinks } = getValues();

  useEffect(() => {
    if (totalLinks && amountPerLink) {
      setTotalCost(totalLinks * amountPerLink);
    }
  }, [totalLinks, amountPerLink]);

  // const handleCheckboxChange = (value: string, isChecked: boolean) => {
  //   setCheckboxes({ ...checkboxes, [value]: isChecked });
  //   setValue('checkbox', isChecked, { shouldValidate: true });
  // };

  const handleWalletChange = (walletSymbol: string) => {
    setValue(
      'selectedFromWallet',
      TOKEN_BALANCES.find((wallet) => wallet.symbol === walletSymbol),
    );
  };

  // console.log(getValues());

  return (
    <FormProvider {...methods}>
      <IconBox icon={<LinkIcon />} maxW={{ base: '21.5rem', md: '36rem' }}>
        <Box>
          <FormControl helperText="Will be shown on the claim page" label="Token Drop name">
            <Input placeholder="Star Invasion Beta Invites" type="text" {...register('dropName')} />
          </FormControl>

          <FormControl label="Number of links">
            <Input
              placeholder="1 - 10,000"
              type="number"
              {...register('totalLinks', { valueAsNumber: true })}
            />
          </FormControl>

          <FormControl label="Amount per link">
            <WalletBalanceInput {...register('amountPerLink', { valueAsNumber: true })}>
              <WalletBalanceInput.TokenMenu
                selectedWallet={getValues('selectedFromWallet')}
                tokens={TOKEN_BALANCES}
                onChange={handleWalletChange}
              />
              <WalletBalanceInput.CostDisplay
                balanceAmount={selectedFromWallet.amount}
                symbol={selectedFromWallet.symbol}
                totalCost={totalCost}
              />
            </WalletBalanceInput>
          </FormControl>

          <FormControl helperText="Choose which wallet to set people up with." label="Wallets">
            <Checkboxes
              defaultValues={['near_wallet']}
              items={WALLET_OPTIONS}
              onChange={(value) => {
                setValue('selectedToWallets', value);
              }}
            />
          </FormControl>

          <FormControl
            helperText="Where should the user be sent after signing up?"
            label="Redirect link (optional)"
          >
            <Input placeholder="mark@hotmail.com" type="text" {...register('redirectLink')} />
          </FormControl>
        </Box>
      </IconBox>
    </FormProvider>
  );
};
