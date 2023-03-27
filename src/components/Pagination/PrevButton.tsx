import { ChevronLeftIcon } from '@chakra-ui/icons';
import { IconButton, type IconButtonProps } from '@chakra-ui/react';

interface PrevButtonProps extends Omit<IconButtonProps, 'aria-label'> {}
export const PrevButton = (props: PrevButtonProps) => {
  return (
    <IconButton aria-label="Previous page" icon={<ChevronLeftIcon h="5" w="5" />} {...props} />
  );
};
