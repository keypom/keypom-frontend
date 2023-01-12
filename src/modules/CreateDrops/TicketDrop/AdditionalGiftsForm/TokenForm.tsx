import { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { FormControl } from '@/common/components/FormControl';
import { WalletBalanceInput } from '@/common/components/WalletBalanceInput';

import { WALLET_TOKENS } from '../data';
import { CreateTicketFieldsSchema } from '../CreateTicketDropContext';

export const TokenForm = () => {
  const {
    setValue,
    handleSubmit,
    control,
    watch,
    formState: { isDirty, isValid },
  } = useFormContext<CreateTicketFieldsSchema>();

  const [selectedFromWallet, amountPerLink, totalTickets] = watch([
    'additionalGift.token.selectedFromWallet',
    'additionalGift.token.amountPerLink',
    'totalTickets',
  ]);
  const totalCost = useMemo(() => {
    if (totalTickets && amountPerLink) {
      return totalTickets * (amountPerLink as number);
    }
    return 0;
  }, [amountPerLink, totalTickets]);

  const handleWalletChange = (walletSymbol: string) => {
    const { symbol, amount } = WALLET_TOKENS.find((wallet) => wallet.symbol === walletSymbol);
    setValue(
      'additionalGift.token.selectedFromWallet',
      { symbol, amount },
      { shouldDirty: true, shouldValidate: true },
    );
  };

  return (
    <Controller
      control={control}
      name="additionalGift.token.amountPerLink"
      render={({ field, fieldState: { error } }) => (
        <FormControl errorText={error?.message} label="Add tokens" my="0">
          <WalletBalanceInput
            {...field}
            isInvalid={Boolean(error?.message)}
            onChange={(e) => {
              field.onChange(parseFloat(e.target.value), 10);
            }}
          >
            <WalletBalanceInput.TokenMenu
              selectedWalletToken={selectedFromWallet}
              tokens={WALLET_TOKENS}
              onChange={handleWalletChange}
            />
            <WalletBalanceInput.CostDisplay
              balanceAmount={selectedFromWallet?.amount}
              symbol={selectedFromWallet?.symbol}
              totalCost={totalCost}
            />
          </WalletBalanceInput>
        </FormControl>
      )}
    />
  );
};
