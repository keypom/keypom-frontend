import { Box, Checkbox, VStack } from '@chakra-ui/react';

import { CheckedIcon, UncheckedIcon } from '../Icons';

export interface ICheckbox {
  name: string;
  value: string;
  icon?: React.ReactNode;
}

interface CheckboxesProps {
  items: ICheckbox[]; //
  values: {
    // Map of value:boolean pairs for checkboxes values
    [key: string]: boolean;
  };
  onChange: (value: string, isChecked: boolean) => void;
}

export const Checkboxes = ({ items = [], values = {}, onChange }: CheckboxesProps) => {
  const checkboxes = items.map((item) => {
    const isChecked = values[item.value];
    return (
      <Checkbox
        key={item.value}
        border="1px solid"
        borderColor={isChecked ? 'blue.400' : 'gray.200'}
        borderRadius="xl"
        icon={
          isChecked ? <CheckedIcon height="5" width="5" /> : <UncheckedIcon height="5" width="5" />
        }
        iconColor="blue.400"
        iconSize="1.375rem"
        p="4"
        w="full"
        onChange={(e) => onChange(item.value, e.target.checked)}
      >
        <Box alignItems="center" display="flex">
          {item.icon && (
            <Box display="inline-block" mx="4">
              {item.icon}
            </Box>
          )}
          {item.name}
        </Box>
      </Checkbox>
    );
  });
  return <VStack align="flex-start">{checkboxes}</VStack>;
};
