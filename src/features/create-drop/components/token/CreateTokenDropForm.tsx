import { Button, Flex, Input } from '@chakra-ui/react';
import { useCallback, useState, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { formatNearAmount, createDrop } from 'keypom-js';

import { IconBox } from '@/components/IconBox';
import { FormControl } from '@/components/FormControl';
import { Checkboxes } from '@/components/Checkboxes';
import { TokenInput } from '@/components/TokenInputMenu';
import { LinkIcon } from '@/components/Icons';
import { useDropFlowContext } from '@/features/create-drop/contexts';
import { get } from '@/utils/localStorage';
import { MASTER_KEY } from '@/constants/common';
import { useAppContext, openMasterKeyModal } from '@/contexts/AppContext';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import getConfig from '@/config/config';
import { type IToken } from '@/types/common';

import { WALLET_CHECKBOXES } from '../WalletComponent';

const { defaultWallet } = getConfig();

export const CreateTokenDropForm = () => {
  const { setAppModal } = useAppContext();
  const { account } = useAuthWalletContext();

  const WALLET_TOKENS: IToken[] = account
    ? [
        {
          amount: formatNearAmount(account.amount, 4),
          symbol: 'NEAR',
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

  const [selectedToken, amountPerLink, totalLinks] = watch([
    'selectedToken',
    'amountPerLink',
    'totalLinks',
  ]);

  const calcTotalCost = async () => {
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
    setValue('selectedToken', { symbol: foundWallet?.symbol, amount: foundWallet?.amount });
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
      openMasterKeyModal(setAppModal, onNext?.(), () => {
        // eslint-disable-next-line no-console
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
          render={({ field: { value, onChange, ...fieldProps }, fieldState: { error } }) => {
            return (
              <FormControl errorText={error?.message} label="Number of links">
                <Input
                  isInvalid={Boolean(error?.message)}
                  placeholder="1 - 50"
                  type="number"
                  value={value || ''}
                  onChange={(e) => {
                    onChange(parseInt(e.target.value));
                  }}
                  {...fieldProps}
                />
              </FormControl>
            );
          }}
        />

        <Controller
          control={control}
          name="amountPerLink"
          render={({ field: { value, onChange, name }, fieldState: { error } }) => (
            <FormControl errorText={error?.message} label="Amount per link">
              <TokenInput
                isInvalid={Boolean(error?.message)}
                maxLength={14}
                name={name}
                value={value}
                onChange={(e) => {
                  if (e.target.value.length > e.target.maxLength)
                    e.target.value = e.target.value.slice(0, e.target.maxLength);
                  onChange(e.target.value);
                }}
              >
                <TokenInput.TokenMenu
                  selectedToken={selectedToken}
                  tokens={WALLET_TOKENS}
                  onChange={handleWalletChange}
                />
                <TokenInput.CostDisplay
                  balanceAmount={selectedToken.amount}
                  symbol={selectedToken.symbol}
                  totalCost={totalCost}
                />
              </TokenInput>
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
                defaultValues={[defaultWallet.name]}
                items={WALLET_CHECKBOXES}
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
