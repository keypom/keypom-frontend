import { Button, Input } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

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
  const { register, setValue, getValues, handleSubmit, watch } = useForm({
    defaultValues: {
      dropName: '',
      selectedFromWallet: TOKEN_BALANCES[0],
      selectedToWallets: [],
      totalLinks: undefined,
      amountPerLink: undefined,
      redirectLink: '',
    },
  });

  const { selectedFromWallet, amountPerLink, totalLinks } = getValues();

  const totalCost = useMemo(() => {
    if (totalLinks && amountPerLink) {
      return totalLinks * amountPerLink;
    }
    return 0;
  }, [amountPerLink, totalLinks]);

  const handleWalletChange = (walletSymbol: string) => {
    setValue(
      'selectedFromWallet',
      TOKEN_BALANCES.find((wallet) => wallet.symbol === walletSymbol),
    );
  };

  const handleSubmitClick = (data) => console.log(data);

  return (
    <IconBox icon={<LinkIcon />} maxW={{ base: '21.5rem', md: '36rem' }}>
      <form onSubmit={handleSubmit(handleSubmitClick)}>
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
        <Button type="submit">Continue to summary</Button>
      </form>
    </IconBox>
  );
};
