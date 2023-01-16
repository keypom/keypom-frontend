import { useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Button, Flex, VStack } from '@chakra-ui/react';

import { IconBox } from '@/common/components/IconBox';
import { LinkIcon } from '@/common/components/Icons';
import { FormControl } from '@/common/components/FormControl';
import { Checkboxes } from '@/common/components/Checkboxes';

import { useDropFlowContext } from '../contexts/DropFlowContext';
import { RedirectInput } from '../Fields/RedirectInput';
import { ArtworkInput } from '../Fields/ArtworkInput';

import { WALLET_OPTIONS } from './CREATE_NFT_DROP_TESTDATA';
import { NftNameInput } from './Fields/NftNameInput';
import { DescriptionInput } from './Fields/DescriptionInput';

export interface CreateNftDropFormFieldTypes {
  nftName: string;
  description: string;
  artwork: string;
  selectedToWallets: string[];
  redirectLink?: string;
}

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
    onNext();
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
                  defaultValues={['near_wallet']}
                  items={WALLET_OPTIONS}
                  onChange={handleCheckboxChange}
                />
              </FormControl>
            )}
          />

          <RedirectInput control={control} />

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
