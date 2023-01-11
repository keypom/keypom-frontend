import { VStack } from '@chakra-ui/react';
import { Controller, useFormContext } from 'react-hook-form';

import { TextInput } from '@/common/components/TextInput';
import { TextAreaInput } from '@/common/components/TextAreaInput';

import { ArtworkInput } from '../../Fields/ArtworkInput';

export const POAPNftForm = () => {
  const {
    setValue,
    handleSubmit,
    control,
    watch,
    formState: { isDirty, isValid },
  } = useFormContext();

  return (
    <VStack spacing={{ base: '4', md: '5' }}>
      <Controller
        control={control}
        name="poapName"
        render={({ field, fieldState: { error } }) => (
          <TextInput
            errorMessage={error?.message}
            isInvalid={!!error?.message}
            label="Name"
            placeholder="Danny Daze"
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="poapDescription"
        render={({ field, fieldState: { error } }) => (
          <TextAreaInput
            errorMessage={error?.message}
            isInvalid={!!error?.message}
            label="POAP Description"
            placeholder="A commemorative NFT for the event"
            {...field}
          />
        )}
      />
      <ArtworkInput control={control} />
    </VStack>
  );
};
