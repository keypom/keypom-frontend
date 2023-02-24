import { VStack } from '@chakra-ui/react';
import { Controller, useFormContext } from 'react-hook-form';

import { ArtworkInput } from '@/features/create-drop/components/Fields/ArtworkInput';
import { TextInput } from '@/components/TextInput';
import { TextAreaInput } from '@/components/TextAreaInput';
import { type CreateTicketFieldsSchema } from '@/features/create-drop/contexts/CreateTicketDropContext/CreateTicketDropContext';

export const POAPNftForm = () => {
  const { control } = useFormContext<CreateTicketFieldsSchema>();

  return (
    <VStack spacing={{ base: '4', md: '5' }}>
      <Controller
        control={control}
        name="additionalGift.poapNft.name"
        render={({ field, fieldState: { error } }) => (
          <TextInput
            errorMessage={error?.message}
            isInvalid={!!error?.message}
            label="Name"
            placeholder="Art Vandelay Official"
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="additionalGift.poapNft.description"
        render={({ field, fieldState: { error } }) => (
          <TextAreaInput
            errorMessage={error?.message}
            isInvalid={!!error?.message}
            label="POAP Description"
            placeholder="A commemorative NFT for attending the Vandelay Industries networking event."
            {...field}
          />
        )}
      />
      <ArtworkInput name="additionalGift.poapNft.artwork" />
    </VStack>
  );
};
