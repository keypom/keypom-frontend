import { Checkbox as _Checkbox } from '@chakra-ui/react';

import { CheckedIcon, UncheckedIcon } from '@/components/Icons';

export const Checkbox = ({ isChecked, value, children, ...props }) => {
  return (
    <_Checkbox
      icon={
        isChecked ? <CheckedIcon height="5" width="5" /> : <UncheckedIcon height="5" width="5" />
      }
      iconColor="blue.400"
      iconSize="1.375rem"
      isChecked={isChecked}
      p={{ base: '2', md: '4' }}
      pl={{ base: '3' }}
      value={value}
      w="full"
      {...props}
    >
      {children}
    </_Checkbox>
  );
};
