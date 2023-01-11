import { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { FormControl } from '@/common/components/FormControl';
import { WalletBalanceInput } from '@/common/components/WalletBalanceInput';

import { WALLET_TOKENS } from '../data';

export const TokenForm = () => {
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
        <FormControl errorText={error?.message} label="Add tokens">
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
