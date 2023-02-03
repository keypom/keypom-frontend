import { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { FormControl } from '@/components/FormControl';
import { WalletBalanceInput } from '@/components/WalletBalanceInput';
import { type CreateTicketFieldsSchema } from '@/features/create-drop/contexts/CreateTicketDropContext/CreateTicketDropContext';

import { WALLET_TOKENS } from '../data';

export const TokenForm = () => {
  const {
    setValue,
    trigger,
    control,
    watch,
    formState: { errors },
  } = useFormContext<CreateTicketFieldsSchema>();

  const selectedFromWalletError = errors?.additionalGift?.token?.selectedFromWallet;

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
        <FormControl
          errorText={error?.message || selectedFromWalletError?.message}
          label="Add tokens"
          my="0"
        >
          <WalletBalanceInput
            {...field}
            isInvalid={Boolean(error?.message)}
            onChange={(e) => {
              field.onChange(parseFloat(e.target.value));
              trigger(); // errors not getting updated if its not manually validated
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
