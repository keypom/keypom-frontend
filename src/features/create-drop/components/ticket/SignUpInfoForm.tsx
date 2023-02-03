import { Box, Text } from '@chakra-ui/react';
import { Controller, useFormContext } from 'react-hook-form';
import { type BaseSyntheticEvent } from 'react';

import { SwitchInput } from '@/components/SwitchInput';
import { type CreateTicketFieldsSchema } from '@/features/create-drop/contexts/CreateTicketDropContext/CreateTicketDropContext';

interface InfoSwitchItem {
  name: 'firstName' | 'secondName' | 'emailAddress';
  label: string;
}

const infoSwitches: InfoSwitchItem[] = [
  {
    name: 'firstName',
    label: 'First Name',
  },
  {
    name: 'secondName',
    label: 'Second Name',
  },
  {
    name: 'emailAddress',
    label: 'Email address',
  },
];

export const SignUpInfoForm = () => {
  const { control } = useFormContext<CreateTicketFieldsSchema>();

  const switches = infoSwitches.map((switchInfo) => {
    return (
      <Controller
        key={switchInfo.name}
        control={control}
        name={switchInfo.name}
        render={({ field, fieldState: { error } }) => {
          return (
            <SwitchInput
              errorText={error?.message}
              label={switchInfo.label}
              my="1"
              switchProps={{
                id: switchInfo.name,
                onChange: (e: BaseSyntheticEvent) => {
                  field.onChange(e.target.checked);
                },
                isChecked: field.value,
                mt: '0',
              }}
            />
          );
        }}
      />
    );
  });

  return (
    <Box my={{ base: '6', md: '8' }}>
      <Text color="gray.800" fontWeight="medium" mb="4" textAlign="left">
        Collect information
      </Text>
      <Box>{switches}</Box>
    </Box>
  );
};
