import { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { evaluate, format } from 'mathjs';

import { FormControl } from '@/components/FormControl';
import { WalletBalanceInput, type WalletToken } from '@/components/WalletBalanceInput';
import { type CreateTicketFieldsSchema } from '@/features/create-drop/contexts/CreateTicketDropContext/CreateTicketDropContext';

import { WALLET_TOKENS } from '../../WalletComponent';

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
    if (totalTickets && amountPerLink !== undefined) {
      return format(evaluate(`${totalTickets} * ${amountPerLink as number}`), {
        precision: 14,
      });
    }
    return 0;
  }, [amountPerLink, totalTickets]);

  const handleWalletChange = (walletSymbol: string) => {
    const foundWallet = WALLET_TOKENS.find((wallet) => wallet.symbol === walletSymbol);
    setValue(
      'additionalGift.token.selectedFromWallet',
      { symbol: foundWallet?.symbol, amount: foundWallet?.amount },
      { shouldDirty: true, shouldValidate: true },
    );
  };

  return (
    <Controller
      control={control}
      name="additionalGift.token.amountPerLink"
      render={({ field, fieldState: { error } }) => (
        <FormControl
          errorText={error?.message ?? selectedFromWalletError?.message}
          label="Add tokens"
          my="0"
        >
          <WalletBalanceInput
            {...field}
            isInvalid={Boolean(error?.message)}
            maxLength={14}
            onChange={(e) => {
              if (e.target.value.length > e.target.maxLength)
                e.target.value = e.target.value.slice(0, e.target.maxLength);
              field.onChange(parseFloat(e.target.value));
              void trigger(); // errors not getting updated if its not manually validated
            }}
          >
            <WalletBalanceInput.TokenMenu
              selectedWalletToken={selectedFromWallet as Partial<WalletToken>}
              tokens={WALLET_TOKENS}
              onChange={handleWalletChange}
            />
            <WalletBalanceInput.CostDisplay
              balanceAmount={selectedFromWallet?.amount ?? ''}
              symbol={selectedFromWallet?.symbol ?? ''}
              totalCost={totalCost}
            />
          </WalletBalanceInput>
        </FormControl>
      )}
    />
  );
};
