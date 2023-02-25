import { Button, Flex, Input } from '@chakra-ui/react';
import { useCallback, useState, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { formatNearAmount, createDrop } from 'keypom-js';

import { IconBox } from '@/components/IconBox';
import { FormControl } from '@/components/FormControl';
import { Checkboxes } from '@/components/Checkboxes';
import { WalletBalanceInput } from '@/components/WalletBalanceInput';
import { LinkIcon, NearLogoIcon } from '@/components/Icons';
import { useDropFlowContext } from '@/features/create-drop/contexts';
import { get } from '@/utils/localStorage';
import { MASTER_KEY } from '@/constants/common';
import { useAppContext, setAppModalHelper } from '@/contexts/AppContext';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';

import { WALLET_OPTIONS } from '../WalletComponent';

export const CreateTokenDropForm = () => {
  const { setAppModal } = useAppContext();
  const { account } = useAuthWalletContext();

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

  const { onNext } = useDropFlowContext();
  const {
    setValue,
    handleSubmit,
    control,
    watch,
    formState: { isDirty, isValid },
  } = useFormContext();

  const [totalCost, setTotalCost] = useState(0);

  const [selectedFromWallet, amountPerLink, totalLinks] = watch([
    'selectedFromWallet',
    'amountPerLink',
    'totalLinks',
  ]);

  const calcTotalCost = async () => {
    console.log(totalLinks, amountPerLink, totalCost);
    if (totalLinks && amountPerLink) {
      const { requiredDeposit } = await createDrop({
        wallet: await window.selector.wallet(),
        depositPerUseNEAR: amountPerLink,
        numKeys: totalLinks,
        returnTransactions: true,
      });
      setTotalCost(parseFloat(formatNearAmount(requiredDeposit!, 4)));
    }
  };

  useEffect(() => {
    calcTotalCost();
  }, [amountPerLink, totalLinks]);

  const handleWalletChange = (walletSymbol: string) => {
    const foundWallet = WALLET_TOKENS.find((wallet) => wallet.symbol === walletSymbol);
    setValue('selectedFromWallet', { symbol: foundWallet?.symbol, amount: foundWallet?.amount });
  };

  const handleCheckboxChange = useCallback(
    (value) => {
      setValue('selectedToWallets', value, { shouldValidate: true });
    },
    [setValue],
  );

  const handleSubmitClick = () => {
    const masterKey = get(MASTER_KEY);
    if (masterKey === undefined) {
      setAppModalHelper(setAppModal, onNext?.(), () => {
        // eslint-disable-next-line no-console
        console.log('user cancelled');
        window.location.reload();
      });
      return;
    }
    onNext?.();
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
                  placeholder="NEARCon Token Giveaway"
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
                placeholder="1 - 50"
                type="number"
                {...field}
                onChange={(e) => {
                  field.onChange(parseInt(e.target.value));
                }}
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
                maxLength={14}
                onChange={(e) => {
                  if (e.target.value.length > e.target.maxLength)
                    e.target.value = e.target.value.slice(0, e.target.maxLength);
                  field.onChange(parseFloat(e.target.value));
                }}
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
                defaultValues={['my_near_wallet']}
                items={WALLET_OPTIONS}
                onChange={handleCheckboxChange}
              />
            </FormControl>
          )}
        />

        {/* <Controller
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
        /> */}
        <Flex justifyContent="flex-end">
          <Button disabled={!isDirty || !isValid} mt="10" type="submit">
            Continue to summary
          </Button>
        </Flex>
      </form>
    </IconBox>
  );
};
