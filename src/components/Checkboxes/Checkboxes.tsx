import { Box, Checkbox, useCheckboxGroup, VStack } from '@chakra-ui/react';
import type React from 'react';
import { useEffect } from 'react';

import { CheckedIcon, UncheckedIcon } from '../Icons';

export interface CheckboxItem {
  name: string;
  value: string;
  icon?: React.ReactNode;
}

interface CheckboxesProps {
  items: CheckboxItem[];
  defaultValues: string[];
  onChange: (value: Array<string | number>) => void;
}

export const Checkboxes = ({ items = [], defaultValues = [], onChange }: CheckboxesProps) => {
  const { value, getCheckboxProps } = useCheckboxGroup({
    defaultValue: defaultValues,
  });

  useEffect(() => {
    onChange(value);
  }, [value.length, onChange, value]);

  const checkboxes = items.map((item) => {
    const { isChecked } = getCheckboxProps({ value: item.value });
    return (
      <Checkbox
        key={item.value}
        checked
        border="1px solid"
        borderColor={isChecked ? 'blue.400' : 'gray.200'}
        borderRadius="6xl"
        icon={
          isChecked ? <CheckedIcon height="5" width="5" /> : <UncheckedIcon height="5" width="5" />
        }
        iconColor="blue.400"
        iconSize="1.375rem"
        p={{ base: '2', md: '4' }}
        pl={{ base: '3' }}
        value={item.value}
        w="full"
        {...getCheckboxProps({ value: item.value })}
      >
        <Box alignItems="center" display="flex">
          {item.icon !== undefined && (
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
