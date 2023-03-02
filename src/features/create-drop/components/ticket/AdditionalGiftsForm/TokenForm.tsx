import { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { evaluate, format } from 'mathjs';
import { formatNearAmount } from 'keypom-js';

import { FormControl } from '@/components/FormControl';
import { WalletBalanceInput, type WalletToken } from '@/components/TokenInputMenu';
import { type CreateTicketFieldsSchema } from '@/features/create-drop/contexts/CreateTicketDropContext/CreateTicketDropContext';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import { NearLogoIcon } from '@/components/Icons';

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

  const WALLET_TOKENS = account
    ? [
        {
          amount: formatNearAmount(account.amount, 4),
          symbol: 'NEAR',
          wallet: 'near_wallet',
          icon: <NearLogoIcon height="4" width="4" />,
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
              onChange={handleTokenChange}
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
