import { Box, Checkbox, VStack } from '@chakra-ui/react';

export interface ICheckbox {
  name: string;
  value: string;
  icon?: React.ReactNode;
  isChecked?: boolean;
}

interface CheckboxesProps {
  items: ICheckbox[];
  onChange: (value: string, isChecked: boolean) => void;
}

export const Checkboxes = ({ items, onChange }: CheckboxesProps) => {
  const checkboxes = items.map((item) => (
    <Checkbox
      key={item.value}
      border="1px solid"
      borderColor="gray.200"
      borderRadius="xl"
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
  ));
  return <VStack align="flex-start">{checkboxes}</VStack>;
};
