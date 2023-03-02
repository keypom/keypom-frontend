import { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { evaluate, format } from 'mathjs';
import { formatNearAmount } from 'keypom-js';

import { FormControl } from '@/components/FormControl';
import { TokenInput } from '@/components/TokenInputMenu';
import { type CreateTicketFieldsSchema } from '@/features/create-drop/contexts/CreateTicketDropContext/CreateTicketDropContext';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import { type IToken } from '@/types/common';

export const TokenForm = () => {
  const {
    setValue,
    trigger,
    control,
    watch,
    formState: { errors },
  } = useFormContext<CreateTicketFieldsSchema>();
  const { account } = useAuthWalletContext();

  const selectedFromWalletError = errors?.additionalGift?.token?.selectedFromWallet;

  const WALLET_TOKENS: IToken[] = account
    ? [
        {
          amount: formatNearAmount(account.amount, 4),
          symbol: 'NEAR',
        },
      ]
    : [];

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

  const handleTokenChange = (tokenSymbol: string) => {
    const foundWallet = WALLET_TOKENS.find((token) => token.symbol === tokenSymbol);

    if (!foundWallet) {
      return;
    }

    setValue(
      'additionalGift.token.selectedFromWallet',
      { symbol: foundWallet.symbol, amount: foundWallet.amount },
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
          <TokenInput
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
            <TokenInput.TokenMenu
              selectedWalletToken={selectedFromWallet as IToken}
              tokens={WALLET_TOKENS}
              onChange={handleTokenChange}
            />
            <TokenInput.CostDisplay
              balanceAmount={selectedFromWallet?.amount ?? ''}
              symbol={selectedFromWallet?.symbol ?? ''}
              totalCost={totalCost}
            />
          </TokenInput>
        </FormControl>
      )}
    />
  );
};
