import { useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Button, Flex, VStack } from '@chakra-ui/react';

import { Checkboxes } from '@/components/Checkboxes';
import { FormControl } from '@/components/FormControl';
import { LinkIcon } from '@/components/Icons';
import { IconBox } from '@/components/IconBox';
import { useDropFlowContext } from '@/features/create-drop/contexts/DropFlowContext';
import getConfig from '@/config/config';

import { ArtworkInput } from '../Fields/ArtworkInput';
import { WALLET_CHECKBOXES } from '../WalletComponent';

import { NftNameInput } from './Fields/NftNameInput';
import { NumberInput } from './Fields/NumberInput';
import { DescriptionInput } from './Fields/DescriptionInput';

export interface CreateNftDropFormFieldTypes {
  title: string;
  description: string;
  number: number;
  artwork: string;
  selectedToWallets: string[];
  redirectLink?: string;
}

const { defaultWallet } = getConfig();

export const CreateNftDropForm = () => {
  const { onNext } = useDropFlowContext();
  const {
    setValue,
    handleSubmit,
    control,
    formState: { isDirty, isValid },
  } = useFormContext<CreateNftDropFormFieldTypes>();

  const handleCheckboxChange = useCallback(
    (value) => {
      setValue('selectedToWallets', value, { shouldValidate: true });
    },
    [setValue],
  );

  const handleSubmitClick = () => {
    onNext?.();
  };

  return (
    <IconBox
      icon={<LinkIcon h={{ base: '7', md: '9' }} />}
      maxW={{ base: '21.5rem', md: '36rem' }}
      mx="auto"
    >
      <form onSubmit={handleSubmit(handleSubmitClick)}>
        <VStack spacing={{ base: '4', md: '5' }}>
          <NftNameInput control={control} />
          <DescriptionInput control={control} />
          <NumberInput control={control} />

          <ArtworkInput />

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

          {/* <RedirectInput control={control} /> commented in case of use in the future */}

          <Flex justifyContent="flex-end" w="full">
            <Button disabled={!isDirty || !isValid} mt="10" type="submit">
              Continue to summary
            </Button>
          </Flex>
        </VStack>
      </form>
    </IconBox>
  );
};
