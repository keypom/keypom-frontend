import { Button, Flex, Input } from '@chakra-ui/react';
import { useCallback, useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { IconBox } from '@/common/components/IconBox';
import { FormControl } from '@/common/components/FormControl';
import { Checkboxes } from '@/common/components/Checkboxes';
import { WalletBalanceInput } from '@/common/components/WalletBalanceInput';
import { LinkIcon } from '@/common/components/Icons';

import { useDropFlowContext } from '../contexts/DropFlowContext';

import { WALLET_TOKENS, WALLET_OPTIONS } from './data';

export const CreateTokenDropForm = () => {
  const { onNext } = useDropFlowContext();
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

  const handleCheckboxChange = useCallback(
    (value) => {
      setValue('selectedToWallets', value, { shouldValidate: true });
    },
    [setValue],
  );

  const handleSubmitClick = () => {
    onNext();
  };

  return (
    <IconBox
      icon={<LinkIcon h={{ base: '7', md: '9' }} />}
      maxW={{ base: '21.5rem', md: '36rem' }}
      mx="auto"
    >
      <form onSubmit={handleSubmit(handleSubmitClick)}>
        <Controller
          control={control}
          name="dropName"
          render={({ field, fieldState: { error } }) => {
            return (
              <FormControl
                errorText={error?.message}
                helperText="Will be shown on the claim page"
                label="Token Drop name"
              >
                <Input
                  isInvalid={Boolean(error?.message)}
                  placeholder="Star Invasion Beta Invites"
                  type="text"
                  {...field}
                />
              </FormControl>
            );
          }}
        />

        <Controller
          control={control}
          name="totalLinks"
          render={({ field, fieldState: { error } }) => (
            <FormControl errorText={error?.message} label="Number of links">
              <Input
                isInvalid={Boolean(error?.message)}
                placeholder="1 - 10,000"
                type="number"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value), 10)}
              />
            </FormControl>
          )}
        />

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

        <Controller
          control={control}
          name="selectedToWallets"
          render={({ fieldState: { error } }) => (
            <FormControl
              errorText={error?.message}
              helperText="Choose which wallet to set people up with."
              label="Wallets"
            >
              <Checkboxes
                defaultValues={['near_wallet']}
                items={WALLET_OPTIONS}
                onChange={handleCheckboxChange}
              />
            </FormControl>
          )}
        />

        <Controller
          control={control}
          name="redirectLink"
          render={({ field, fieldState: { error } }) => (
            <FormControl
              errorText={error?.message}
              helperText="Where should the user be sent after signing up?"
              label="Redirect link (optional)"
            >
              <Input
                isInvalid={Boolean(error?.message)}
                placeholder="Enter a link"
                type="text"
                {...field}
              />
            </FormControl>
          )}
        />
        <Flex justifyContent="flex-end">
          <Button disabled={!isDirty || !isValid} mt="10" type="submit">
            Continue to summary
          </Button>
        </Flex>
      </form>
    </IconBox>
  );
};
